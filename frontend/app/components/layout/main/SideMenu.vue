<script setup lang="ts">
defineOptions({ name: 'SideMenu' })
// 復活時: config.post.serviceId 等
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
