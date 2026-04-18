<script setup lang="ts">
import { siteHeadTitleLine } from '@/lib/siteHead'

defineOptions({ name: 'TopPage' })

const { t } = useI18n()

const siteI18n = computed(() => ({
  name: t('site.name'),
  caption: t('site.caption')
}))

const topMetaTitle = computed(
  () => siteHeadTitleLine(siteI18n.value) || t('site.name').trim()
)

usePageSeo({
  title: topMetaTitle,
  ogTitle: topMetaTitle
})

useHead({
  /** グローバルの `ページ | site` を上書きし、トップは `title - caption` のみ */
  titleTemplate: '%s'
})

const titleState = useTitleState()
const { title } = titleState

const counterState = useCounterState()
const { count, countUp, countDown, resetCount } = counterState
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div>
      <button @click="titleState.setTitle('Hello Nuxt!')">changeTitle</button>
    </div>
    <div>
      <h3>Counter</h3>
      <div>
        <p>{{ count }}</p>
        <button @click="countUp">+</button>
        <button @click="countDown">-</button>
        <button @click="resetCount">Reset</button>
      </div>
    </div>
  </div>
</template>
