<script setup lang="ts">
import config from '@/configs/config.json'
import { siteHeadTitleLine } from '@/lib/siteHead'

defineOptions({ name: 'TopPage' })

const { t } = useI18n()

const topMetaTitle = computed(
  () => siteHeadTitleLine(config.site) || (config.site.name ?? '').trim()
)

usePageSeo({
  title: topMetaTitle,
  description: () => t('page.top.description'),
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
    <div>
      <img
        src="~/assets/km-001.JPG"
        alt="コムギの写真"
        width="300"
      />
    </div>
    <hr />
    <ul>
      <li><NuxtLink to="/posts">Posts</NuxtLink></li>
      <li><NuxtLink to="/todo">TODO</NuxtLink></li>
    </ul>
  </div>
</template>
