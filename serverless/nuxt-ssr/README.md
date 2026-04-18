# Nuxt SSR（Serverless）

Nuxt Nitro（`nitro.preset: aws_lambda`）の Lambda バンドルを配備する Serverless Framework v4 サービスです。CloudFront の第 2 オリジンなどは Terraform 側で、この HTTP API のホストを指す想定です（`serverless.yml` 先頭コメント参照）。

## SSR の入口 URLを確定する

### 前提

- AWS 認証が使えること（ローカルの `~/.aws`、または CI の `configure-aws-credentials`）
- 既定リージョンは `ap-northeast-1`（`serverless.yml` の `provider.region`）

### デプロイの有無（重要）

- `**develop` ブランチ**: `.github/workflows/develop.yml` で `**pnpm run build` を 1 回だけ**実行し、その続きで **S3（dev）に `.output/public` を同期**してから `**serverless deploy --stage dev`** し、CloudFront（dev）をキャッシュ削除します。
- `**main` ブランチ**: `.github/workflows/production.yml` で同様に **1 ビルド → S3（prod）同期 → `serverless deploy --stage prod` → CloudFront（prod）キャッシュ削除**します。

手元だけで dev に載せたい場合の例:

```bash
cd serverless/nuxt-ssr
pnpm install --frozen-lockfile
pnpm run sync:nitro   # 先に frontend で nuxt build 済みの .output を同期していること
pnpm exec serverless deploy --stage dev
```

### `serverless info` で URL を取得する

```bash
cd serverless/nuxt-ssr
pnpm exec serverless info --stage prod
# または
pnpm exec serverless info --stage dev
```

出力の **endpoints** / **endpoint** / **Service Information** 付近にある次の形式の URL が、HTTP API のベース URLです。

`https://{api-id}.execute-api.{region}.amazonaws.com`

### Terraform（CloudFront カスタムオリジン）に書く値

- **カスタムオリジンのドメイン（ホストのみ）**  
上記 URL から `https://` を除いたホスト名。末尾のパスやステージ用プレフィックスが表示されている場合は、API の設計に合わせてオリジン／Behavior のパスで揃えます。  
例: `https://abc123.execute-api.ap-northeast-1.amazonaws.com` → `abc123.execute-api.ap-northeast-1.amazonaws.com`

プロトコルはオリジン側で **HTTPS only**（`443`）を指定します。

### カスタムドメイン

現状の `serverless.yml` では HTTP API に独自ドメインは定義していません。独自ドメインを付ける場合は API Gateway / ACM の設定が別途必要です。未設定の間は **execute-api のホスト**をオリジンに使う形で問題ありません。

### CI ログ

`main` 向け（`production.yml`）デプロイの最後に **Show SSR endpoint (serverless info)** が `serverless info --stage prod` をジョブサマリーに出力します。Terraform に転記する値の確認に使えます。

## Terraform（CloudFront 二オリジン）

`terraform/variables.tf` の `**nuxt_ssr_http_api_host`** に、上記と同じ **ホスト名のみ**（`https://` なし）を設定すると、`terraform/static_site.tf` の CloudFront が `**/posts*` を HTTP API オリジン**へ振り分けます。

- **SSR 未設定（空文字）**: 従来どおり S3 のみ。404/403 は `/200.html` にフォールバック（静的 SPA 用）。
- **SSR 設定済み**: `/posts*` は execute-api へ。配布全体の custom error を無効化するため、**それ以外の未知パス**は S3 の生の 404 になり得ます（必要なら後から Viewer Request 等で S3 のみ 200.html に限定する）。

## CloudFront 分割時：`/_nuxt/*.js` が 404（`application/xml`）になる理由

ブラウザは **HTML を取ったオリジン**ではなく、**ドキュメント内の URL** に従って `/_nuxt/xxxx.js` を取りにいきます。Terraform では `**/posts*` 以外は S3** なので、**チャンクは常に S3** から配られます。

一方、`**/posts*` の HTML** は **Lambda 上の Nitro** が、**その Lambda 用に実行した `nuxt build` の結果**（`buildId` や `/_nuxt/` のファイル名のハッシュ）を埋め込みます。

`**develop` と `main` の両方**で、それぞれ `develop.yml` / `production.yml` の **同一ジョブ内**に `pnpm run build` → S3 同期 → `serverless deploy` がまとまっており、**HTML と `/_nuxt` のビルドがズレる典型原因は解消**されています。

### 過去に起きていた不整合（参考）

以前は `develop.yml`（npm）と `nuxt-ssr.yml`（pnpm）が **別々に `nuxt build`** しており、**Lambda の HTMLが指すチャンク名と S3 の `/_nuxt` が一致しない**ことがありました。その結果 S3 が **NoSuchKey 等の XML**（`application/xml`）を返し、ブラウザが JS モジュールとして読めませんでした。