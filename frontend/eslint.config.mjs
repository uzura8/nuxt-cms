// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.vue'],
  rules: {
    'eslintvue/no-v-html': ['warn', { ignorePattern: 'Safe$' }], // 末尾が Safe の変数に対する v-html は許可

    'vue/html-self-closing': [
      'warn',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ]
  }
})
