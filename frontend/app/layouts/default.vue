<script setup lang="ts">
import { computed } from 'vue'

// const loader = useGlobalLoaderStore()
// const { isLoading: isGlobalLoading } = storeToRefs(loader)

// const route = useRoute()
// const columns = computed(() => (Number(route.meta.columns) === 1 ? 1 : 2))
const columns = ref(2)
const hasAside = computed(() => columns.value === 2)
// グリッドの有無（2カラム時のみグリッド）
const layoutGridClass = computed(() =>
  hasAside.value ? 'lg:grid lg:grid-cols-12 h-full mx-auto' : 'h-full mx-auto'
)

// // main カラムのクラス（1カラム時は全幅）
// const mainColClass = computed(() =>
//   [
//     hasAside.value ? 'lg:col-span-9 xl:col-span-10' : '',
//     'w-full py-8 px-6 md:max-w-7xl md:mx-auto'
//   ].join(' ')
// )

// return { isGlobalLoading, layoutGridClass, mainColClass, hasAside }
</script>
<template>
  <div id="main-container">
    <!-- <GlobalLoading v-if="isGlobalLoading" /> -->

    <div class="flex flex-col h-screen">
      <LayoutMainHeader />

      <div class="flex-1">
        <div class="h-full mx-auto">
          <main
            id="main-content"
            class="lg:col-span-9 xl:col-span-10 w-full py-8 px-6 md:max-w-7xl md:mx-auto"
          >
            <slot></slot>
          </main>

          <aside
            v-if="hasAside"
            class="lg:col-span-3 xl:col-span-2 px-6 py-8"
          >
            <LayoutMainSideMenu />
          </aside>
        </div>
      </div>

      <LayoutMainFooter />
    </div>
  </div>
</template>
