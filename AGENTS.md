# AGENTS.md

## プロジェクト概要

このリポジトリは Web アプリケーションの monorepo である。

- `frontend/` は現在存在し、Nuxt アプリケーションを扱う
- `serverless/` は Serverless Framework を使用した AWS Lambda のデプロイを扱う
- `terraform/` は Terraform を使用した AWS インフラ定義を扱う
- `.github/` は GitHub Actions のワークフローなど CI 関連を扱う（例: `workflows/develop.yml`, `workflows/production.yml`）

## リポジトリ構成

現在存在する主なディレクトリ:

- `frontend/`: Nuxt / Vue / TypeScript のコード
- `serverless/`: Serverless Framework を使用した AWS Lambda のデプロイ
- `terraform/`: Terraform を使用した AWS インフラ定義
- `.github/`: GitHub Actions のワークフローなど CI 関連

## ルールの置き場所

- **`frontend/` 配下の実装**（Nuxt / Vue / TypeScript / Tailwind / i18n など）の詳細は、`.cursor/rules/frontend.mdc` を優先する。
- **`terraform/` 配下のインフラ定義**の詳細は、`.cursor/rules/terraform.mdc` を優先する。
- **本ファイル（AGENTS.md）**は、monorepo 全体の前提、領域をまたぐ変更、検証・報告の共通方針をまとめる。内容が重なる箇所は、frontend 固有は `frontend.mdc`、terraform 固有は `terraform.mdc`、横断事項は本書を正とする。

## 参照用ソースコードの扱い

- `frontend/_reference_vue_src/` は移植元の Vue 3 (Composition API) + TypeScript の参照用コードである
- `frontend/_reference_vue_src/` は実装対象ではない
- 既存実装の確認、仕様把握、移植方針の検討のために参照してよい
- 明示的な指示がない限り、`frontend/_reference_vue_src/` 配下のファイルを編集しない
- 新規実装、修正、リファクタの対象は `frontend/_reference_vue_src/` 以外の frontend 側コードとする
- 参照元コードと移植先コードを混同しない
- `frontend/_reference_vue_src/` のコードは、そのまま複製するのではなく、Nuxt の構成・既存設計に合わせて移植する
- 文言の細部は `.cursor/rules/frontend.mdc` の「移植元参照コードの扱い」と整合させる

## リポジトリ横断の原則

- 変更は小さく、目的に集中する。無関係なリファクタは行わない。
- 既存のアーキテクチャ、命名規則、ディレクトリ構成、実装パターンに合わせる。編集前に周辺コードを読むこと。
- タスク上必要でない限り、複数領域を同時に変更しない。明確な理由がない限り、新しい依存関係は追加しない。
- 挙動を変更する場合は、必要に応じて検証内容や関連する型・スキーマを更新する。
- API 契約を変更する場合は、frontend と serverless の両方への影響を確認する。
- インフラ変更では、Serverless Framework と Terraform の責務を混同しない。実装コードとインフラ定義のどちらを直すべきかを先に判断する。
- リポジトリに実在しないディレクトリ、ファイル、コマンド、インフラ構成を前提にしない。検証や手順を書く前に、該当ディレクトリの `package.json` の `scripts` やツール設定を確認する。
- ディレクトリ再編、パッケージマネージャ、CI の変更などで構成が変わったら、本書・README・各 `package.json` の記述が現状と一致するよう更新する。

## 領域をまたぐ変更

### frontend / serverless をまたぐ場合

- request / response の shape が整合しているか確認する
- 必要に応じて関連する types、schemas、検証コードを更新する
- 命名および field の使い方を frontend / serverless 間で一貫させる

### serverless / terraform をまたぐ場合

- 変更対象がアプリケーションコードなのか、インフラ定義なのかを明確にする
- Serverless Framework で管理する内容と Terraform で管理する内容を混同しない
- IAM、API Gateway、環境変数、AWS リソース参照などに変更がある場合は関連箇所の整合を確認する

## 検証

作業完了前に、変更内容に応じた検証を可能な限り実施すること。

- リポジトリに存在しないコマンドを前提にしない。実行前に該当パスの `package.json` の `scripts` と lockfile を確認する。
- **frontend**: `frontend/package.json` の `scripts`（例: `pnpm run build`, `pnpm run dev`）に従い、`frontend/` をカレントディレクトリにして実行する。`pnpm-lock.yaml` があるためパッケージ操作は原則 pnpm とする（lockfile が変わる場合は既存運用に従う）。
- **serverless / terraform**: 各サブディレクトリの `package.json`、シェルスクリプト、`README` 等に手順があればそれに従う。
- 変更箇所に関係する最小限かつ適切な検証を優先する。広範囲な確認が不要なら、対象を絞った検証を優先する。

## 完了時の報告

完了時には以下を明記すること。

- 何を変更したか
- 主な変更ファイル
- 実行した検証コマンド
- 残っている懸念点、前提、追加対応が必要な点
- frontend / serverless / terraform / `.github` のどの領域を変更したか

## 安全性とレビュー観点

- 認証情報・API キー・トークン・秘密鍵をコードやコミットに埋め込まない。環境変数や `.env` の扱いは、既存のサンプル（例: `*.sample`）とチーム運用に従う。
- 明確な理由なく重要な既存挙動を削除しない
- 意図が不明確な場合は推測で進めず、不確実性を明記する
- 危険な大規模変更より、戻しやすい変更を優先する
- 人間のレビュアーが理解しやすい実装を優先する
- AWS 関連の変更では、責務境界を崩さないことを優先する

## 出力方針

- 原則として日本語で説明する
- コード、コマンド、パス、ライブラリ名は必要に応じて英語のまま記述してよい
- 提示するコードは可能な限りコピペ可能な形にする
- 事実と推測を混同しない
- 簡潔で実務的な説明を優先する
- `frontend/` の変更時の補足は `.cursor/rules/frontend.mdc` の「出力方針」に合わせる
