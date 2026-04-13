<script setup lang="ts">
// import { useRoute } from 'vue-router'
import config from '@/configs/config.json'

const siteName = config.site.name
const serviceId: string = config.post.serviceId

// const route = useRoute()
// const current = computed((): string => route.path)
</script>

<template>
  <div>
    <!-- <section>
      <h5 class="text-xl font-semibold text-gray-600 dark:text-gray-300">
        {{ $t('common.categoriesShort') }}
      </h5>
      <CategoryList
        :serviceId="serviceId"
        class="mt-4 px-2 mx-auto"
      />
    </section>

    <section>
      <h5 class="mt-12 text-xl font-semibold text-gray-600 dark:text-gray-300">
        {{ $t('common.tagsShort') }}
      </h5>
      <TagList
        :serviceId="serviceId"
        class="mt-4 px-2 mx-auto"
      />
    </section>

    <section>
      <h5 class="mt-12 text-xl font-semibold text-gray-600 dark:text-gray-300">
        {{ $t('term.postGroupShort') }}
      </h5>
      <PostGroupList
        :serviceId="serviceId"
        class="mt-4 px-2 mx-auto"
      />
    </section> -->
  </div>
</template>
