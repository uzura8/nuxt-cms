<script setup lang="ts">
// app/pages/index.vue

import { buttonClass } from '@/utils/buttonStyles'

defineOptions({ name: 'TopPage' })
usePageSeo()

const { t } = useI18n()
const title = t('site.name')
const description = t('site.description')
</script>

<template>
  <div>
    <div class="text-center">
      <BaseHeading
        tag="h1"
        class="tracking-tight text-heading"
        text-size="text-4xl  md:text-5xl lg:text-6xl"
      >
        {{ title }}
      </BaseHeading>
      <p class="mt-8 text-lg font-normal text-body lg:text-xl sm:px-16 xl:px-48">
        {{ description }}
      </p>
      <NuxtLink
        to="/about"
        :class="buttonClass({ variant: 'brand', size: 'md' })"
        class="mt-6"
      >
        {{ t('common.showMore') }}
      </NuxtLink>
      <div class="mt-12">
        <NuxtImg
          src="/images/km-001.JPG"
          alt="コムギの写真"
          width="300"
          sizes="300px"
          class="mx-auto"
        />
      </div>
    </div>
  </div>
</template>
