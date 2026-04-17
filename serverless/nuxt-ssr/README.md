# Nuxt SSR（Serverless）

Nuxt Nitro（`nitro.preset: aws_lambda`）の Lambda バンドルを配備する Serverless Framework v4 サービスです。CloudFront の第 2 オリジンなどは Terraform 側で、この HTTP API のホストを指す想定です（`serverless.yml` 先頭コメント参照）。

## SSR の入口 URLを確定する

### 前提

- AWS 認証が使えること（ローカルの `~/.aws`、または CI の `configure-aws-credentials`）
- 既定リージョンは `ap-northeast-1`（`serverless.yml` の `provider.region`）

### デプロイの有無（重要）

`.github/workflows/nuxt-ssr.yml` では **`refs/heads/main` のときだけ** `serverless deploy --stage prod` が走ります。`develop` への push ではパッケージまでで、**dev ステージを CI が自動デプロイしません**。開発用の SSR エンドポイントが必要な場合は、手元または別パイプラインで次を実行してください。

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

`main` 向けデプロイ成功後、同じワークフロー内の **Show SSR endpoint (serverless info)** ステップが `serverless info --stage prod` をジョブサマリーに出力します。Terraform に転記する値の確認に使えます。
