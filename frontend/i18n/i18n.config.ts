// i18n/i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'ja',

  missingWarn: false,
  fallbackWarn: false,

  datetimeFormats: {
    ja: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    },
    en: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    }
  },

  numberFormats: {
    ja: {
      currency: {
        style: 'currency',
        currency: 'JPY'
      }
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    }
  }
}))
