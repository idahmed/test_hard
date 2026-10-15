import { createRouter, createWebHistory } from 'vue-router'
import { tools } from '@/tools'
import CameraView from '@/views/CameraView.vue'
import KeyboardView from '@/views/KeyboardView.vue'
import MicView from '@/views/MicView.vue'
import MouseView from '@/views/MouseView.vue'
import SpeakersView from '@/views/SpeakersView.vue'

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
      meta: { title: tool.title, label: tool.label },
    })),
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Hardware test'} by sessea`
})

export default router
