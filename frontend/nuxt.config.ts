// nuxt.config.ts
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'

import { siteHeadTitleLine } from './app/lib/siteHead'

const isDev = process.env.NODE_ENV !== 'production'

const appConfigDir = join(dirname(fileURLToPath(import.meta.url)), 'app/configs')
const appConfigPath = join(appConfigDir, 'config.json')
const appConfigSamplePath = join(appConfigDir, 'config.json.sample')

const appConfigRaw = existsSync(appConfigPath)
  ? readFileSync(appConfigPath, 'utf8')
  : readFileSync(appConfigSamplePath, 'utf8')

const appConfig = JSON.parse(appConfigRaw) as {
  site: { baseUrl: string; footerRight?: string }
  media: { url: string }
}
const mediaImageDomain = new URL(appConfig.media.url).hostname

/** ビルド時のフォールバック（`i18n` の defaultLocale と揃える）。サイト名・説明の正は `site.*` メッセージ。 */
const i18nDefaultLocalePath = join(dirname(fileURLToPath(import.meta.url)), 'i18n/locales/ja.json')
const i18nDefaultSite = JSON.parse(readFileSync(i18nDefaultLocalePath, 'utf8')) as {
  site: { name: string; caption?: string; description?: string }
}
const siteForBuildHead = {
  name: i18nDefaultSite.site.name,
  caption: i18nDefaultSite.site.caption ?? '',
  description: i18nDefaultSite.site.description ?? ''
}

/** 本番は NUXT_PUBLIC_SITE_URL を優先。useSeoMeta / canonical の絶対 URL 基準に useRuntimeConfig().public.siteUrl を使う。 */
const siteUrlDefault = process.env.NUXT_PUBLIC_SITE_URL || appConfig.site.baseUrl
const siteNameDefault = process.env.NUXT_PUBLIC_SITE_NAME || siteForBuildHead.name

/** `<title>` の `%s` 以降。`title - caption` が空なら `site.name` にフォールバック */
const siteTitleTemplateSuffix =
  siteHeadTitleLine(siteForBuildHead) || (siteForBuildHead.name ?? '').trim()

const titleTemplateForPages = siteTitleTemplateSuffix ? `%s | ${siteTitleTemplateSuffix}` : '%s'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: isDev
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // CommonJS の module.exports と、ESM 風の import ... from を両対応する
        esModuleInterop: true
      }
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ja'
      },
      titleTemplate: titleTemplateForPages,
      meta: [
        {
          name: 'description',
          content: siteForBuildHead.description || siteForBuildHead.name
        },
        {
          property: 'og:site_name',
          content: siteForBuildHead.name
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      siteUrl: siteUrlDefault,
      siteName: siteNameDefault
    }
  },

  routeRules: {
    '/posts': { prerender: false, ssr: true },
    '/posts/**': { prerender: false, ssr: true },
    /**
     * S3 + CloudFront の「404 を 200 で index に差し替え」用フォールバック。
     * トップの index.html には `path: "/"` のペイロードが埋まるため、未知パスに返すと
     * クライアントが `/` へ寄せる。`/200.html` はルート非依存のシェルとして別生成する。
     */
    '/200.html': { prerender: true },
    '/**': { prerender: true }
  },

  nitro: {
    // SSR Lambda 向け（Serverless）。ローカルで Node サーバー成果物にしたいときは NITRO_PRESET=node_server 等で上書き。
    preset: process.env.NITRO_PRESET || 'aws_lambda',
    prerender: {
      routes: ['/', '/about', '/200.html']
    }
  },

  css: ['./app/assets/css/main.css', '@fortawesome/fontawesome-svg-core/styles.css'],

  build: {
    transpile: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/vue-fontawesome'
    ]
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@fortawesome/vue-fontawesome',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-solid-svg-icons',
        '@paralleldrive/cuid2',
        'tailwind-merge',
        '@vue/devtools-core',
        '@vue/devtools-kit'
      ]
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/i18n',
    ...(isDev ? ['@nuxt/hints', '@nuxt/a11y'] : []),
    '@vueuse/nuxt'
  ],
  i18n: {
    strategy: 'no_prefix',
    // strategy: 'prefix_except_default',
    defaultLocale: 'ja',
    locales: [
      {
        code: 'ja',
        language: 'ja-JP',
        name: '日本語',
        file: 'ja.json',
        dir: 'ltr'
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        file: 'en.json',
        dir: 'ltr'
      }
    ],

    // 初回アクセス時はブラウザ言語を見て、以後は cookie を使う
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app_locale'
      // redirectOn のデフォルトは root
      // ルートアクセス時だけ判定したいならこのままで十分
    },

    // TypeScript を少し強めに効かせたい場合
    experimental: {
      typedOptionsAndMessages: 'default'
    },
    types: 'composition'
  },

  image: {
    domains: [mediaImageDomain],
    format: ['avif', 'webp']
  },

  /** `app/composables/post/` 配下も自動 import・型生成の対象にする */
  imports: {
    dirs: ['composables/post']
  }
})
