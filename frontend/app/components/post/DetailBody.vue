<script setup lang="ts">
// app/components/post/DetailBody.vue

const props = defineProps<{
  body: string
}>()

const safeHtml = computed(() => sanitizePostBodyHtml(props.body))
</script>

<template>
  <div
    class="post-body"
    v-html="safeHtml"
  />
</template>

<style>
@import '../../styles/post-body-browser-default.css';
</style>
