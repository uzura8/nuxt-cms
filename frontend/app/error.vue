<script setup lang="ts">
const error = useError()
const statusCode = computed(() => error.value?.status || 500)
const message = computed(() => error.value?.message || 'An unexpected error occurred.')
</script>

<template>
  <div>
    <h1>Error</h1>
    <p>Status Code: {{ statusCode }}</p>
    <p>Message: {{ message }}</p>
  </div>
</template>