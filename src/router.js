import { createRouter, createWebHistory } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import { tools } from '@/tools'
import CameraView from '@/views/CameraView.vue'
import KeyboardView from '@/views/KeyboardView.vue'
import MicView from '@/views/MicView.vue'
import MouseView from '@/views/MouseView.vue'
import SpeakersView from '@/views/SpeakersView.vue'

const { setPageSeo } = useSeo()

const views = {
  mic: MicView,
  camera: CameraView,
  speakers: SpeakersView,
  keyboard: KeyboardView,
  mouse: MouseView,
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/mic' },
    ...tools.map((tool) => ({
      path: tool.path,
      name: tool.name,
      component: views[tool.name],
      meta: {
        title: tool.title,
        description: tool.description,
        heading: tool.heading,
        label: tool.label,
      },
    })),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  setPageSeo({
    title: to.meta.title || 'Hardware test online',
    description:
      to.meta.description ||
      'Test mic, camera, speakers, keyboard, and mouse in your browser for free.',
    path: to.path,
  })
})

export default router
