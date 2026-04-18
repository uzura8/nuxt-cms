<script setup lang="ts">
// import { useGlobalHeaderStore } from '@/stores/globalHeader'

const { t } = useI18n()
const siteName = computed(() => t('site.name'))

const route = useRoute()
const current = computed((): string => route.path)

const header = ref<HTMLElement | null>(null)
// const globalHeader = useGlobalHeaderStore()
// const isMenuOpen = computed((): boolean => globalHeader.isMenuOpen)
const isMenuOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  }
)

const toggleHeaderMenuOpenStatus = (): void => {
  // globalHeader.updateMenuOpenStatus(!isMenuOpen.value)
  isMenuOpen.value = !isMenuOpen.value
}

const handleClickOutside = (event: MouseEvent): void => {
  if (header.value && !header.value.contains(event.target as Node)) {
    // globalHeader.updateMenuOpenStatus(false)
  }
}

onMounted(async () => {
  await nextTick()
  header.value = document.querySelector('#header')
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header
    id="header"
    class="flex flex-wrap lg:justify-start lg:flex-nowrap w-full bg-white text-sm py-2 xs:px-5 dark:bg-gray-800 z-40"
  >
    <nav
      class="max-w-340 w-full mx-auto md:max-w-7xl px-4 lg:flex lg:items-center lg:justify-between"
      aria-label="Global"
    >
      <div class="flex items-center justify-between">
        <NuxtLink
          to="/"
          class="flex-none text-xl font-medium text-gray-800 dark:text-white py-1"
        >
          {{ siteName }}
        </NuxtLink>
        <div class="lg:hidden">
          <button
            type="button"
            :class="{ open: isMenuOpen }"
            class="p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
            aria-controls="navbar-with-collapse"
            :aria-expanded="isMenuOpen"
            aria-label="Toggle navigation"
            @click="toggleHeaderMenuOpenStatus"
          >
            <FontAwesomeIcon
              v-if="isMenuOpen"
              class="w-4 h-4"
              icon="xmark"
            />
            <FontAwesomeIcon
              v-else
              class="w-4 h-4"
              icon="bars"
            />
          </button>
        </div>
      </div>
      <div
        id="navbar-with-collapse"
        class="grid basis-full grow overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out lg:ml-10 lg:grid-rows-[1fr]"
        :class="isMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="min-h-0 overflow-hidden">
          <ul class="flex flex-col gap-5 mt-5 lg:flex-row lg:items-center lg:mt-0 lg:pl-40">
            <li>
              <NuxtLink
                to="/"
                exact
                :aria-current="current === '/about' ? 'page' : undefined"
                class="font-medium text-gray-800 text-base"
              >
                {{ $t('page.top.title') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/about"
                exact
                :aria-current="current === '/about' ? 'page' : undefined"
                class="font-medium text-gray-800 text-base"
              >
                {{ $t('page.about.title') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/posts"
                exact
                :aria-current="current === '/posts' ? 'page' : undefined"
                class="font-medium text-gray-800 text-base"
              >
                {{ $t('page.posts.list.title') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.router-link-exact-active {
  color: #3b82f6;
}
</style>
