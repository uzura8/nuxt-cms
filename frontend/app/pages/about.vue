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
      <img
        src="~/assets/km-001.JPG"
        alt="コムギの写真"
        width="300"
      />
    </div>
  </div>
</template>
