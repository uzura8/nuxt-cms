// app/composables/index.ts

import type { Ref } from 'vue'

export const useTitleState = () => {
  const title = useState<string>('title', () => 'Default Title')
  const setTitle = (title: Ref<string>) => (value: string) => {
    title.value = value
  }
  return {
    title: readonly(title),
    setTitle: setTitle(title)
  }
}

export const useCounterState = () => {
  const count = useState<number>('count', () => 0)
  // useState<number>('count', () => 0)
  const countUp = () => {
    count.value++
  }
  const countDown = () => {
    if (count.value <= 0) return
    count.value--
  }
  const resetCount = () => {
    count.value = 0
  }
  return {
    count: readonly(count),
    countUp,
    countDown,
    resetCount
  }
}
