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
