import { defineNuxtPlugin } from '#app'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faBars,
  faCheck,
  faGear,
  faGripVertical,
  faMagnifyingGlass,
  faPencil,
  faPlus,
  faTrash,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

config.autoAddCss = false

library.add(
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faBars,
  faCheck,
  faGear,
  faGripVertical,
  faMagnifyingGlass,
  faPencil,
  faPlus,
  faTrash,
  faXmark
)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
