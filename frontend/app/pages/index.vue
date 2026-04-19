<script setup lang="ts">
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
      <a
        href="#"
        class="mt-6 inline-flex items-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-base px-5 py-3 focus:outline-none"
      >
        {{ t('common.showMore') }}
      </a>
      <div class="mt-12">
        <img
          src="~/assets/km-001.JPG"
          alt="コムギの写真"
          width="300"
          class="mx-auto"
        />
      </div>
    </div>
  </div>
</template>
