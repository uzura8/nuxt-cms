<script setup lang="ts">
const titleState = useTitleState()
const { title } = titleState
useHead({
  title: title.value,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap'
    }
  ]
})
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <!--
        NuxtPage の keepalive + include は履歴バック/フォワードで表示が更新されない事例がある（Nuxt 4 周知の挙動）。
        一覧のスクロール等を保持したい場合は definePageMeta / 別ストア等で検討する。
      -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
