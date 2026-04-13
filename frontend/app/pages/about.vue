<script setup lang="ts">
import config from '@/configs/config.json'
import { documentMetaTitle } from '@/lib/siteHead'

defineOptions({ name: 'AboutPage' })

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const siteUrlBase = computed(() => String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''))
const canonicalUrl = computed(() => `${siteUrlBase.value}/about`)

const pageTitle = computed(() => t('page.about.title'))
const fullOgTitle = computed(() => documentMetaTitle(config.site, pageTitle.value))

useSeoMeta({
  title: pageTitle,
  description: t('page.about.description'),
  ogTitle: fullOgTitle,
  ogDescription: t('page.about.description'),
  ogUrl: canonicalUrl
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }]
})
</script>

<template>
  <div>
    <h1>{{ pageTitle }}</h1>
  </div>
</template>
