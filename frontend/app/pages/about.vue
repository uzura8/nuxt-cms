<script setup lang="ts">
defineOptions({ name: 'AboutPage' })

const { t } = useI18n()
const pageTitle = computed(() => t('page.about.title'))

usePageSeo({
  title: pageTitle,
  description: () => t('page.about.description')
})
</script>

<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <div>
      <NuxtImg
        src="/images/km-002.JPG"
        alt="コムギの写真"
        width="300"
        sizes="300px"
      />
    </div>
  </div>
</template>
