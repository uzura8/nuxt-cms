<script setup lang="ts">
// app/components/layout/main/footer.vue
import config from '@/configs/config.json'

const footerRightSafe = computed(() => sanitizeHtml(config.site.footerRight))
</script>

<template>
  <footer class="mt-auto w-full max-w-340 py-10 px-4 sm:px-6 lg:px-8 mx-auto">
    <div class="text-center">
      <div class="mt-3">
        <p
          class="text-gray-500"
          v-html="footerRightSafe"
        ></p>
      </div>
    </div>
  </footer>
</template>
