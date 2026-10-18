<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HubLinks from '@/components/HubLinks.vue'
import InfoContent from '@/components/InfoContent.vue'
import InfoModal from '@/components/InfoModal.vue'
import { HUB_URL } from '@/lib/sites'
import { loadTheme, saveTheme } from '@/lib/prefs'
import { tools } from '@/tools'

const route = useRoute()
const router = useRouter()
const theme = ref(loadTheme())
const isDark = computed(() => theme.value === 'dark')
const activePath = computed(() => route.path)
const isLegal = computed(() => Boolean(route.meta.legal))
const docsOpen = ref(false)

watch(theme, (value) => {
  saveTheme(value)
  document.documentElement.dataset.theme = value
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.content = value === 'dark' ? '#141414' : '#1c1c1c'
}, { immediate: true })

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

function onKeydown(event) {
  if (docsOpen.value) return
  if (route.name === 'keyboard') return
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const tag = document.activeElement?.tagName
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return

  const match = tools.find((tool) => tool.shortcut === event.key)
  if (match) router.push(match.path)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="shell">
    <div class="app">
      <main class="page">
        <header class="brand">
          <button
            type="button"
            class="theme-toggle"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <svg v-if="isDark" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path
                d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <h1>{{ route.meta.heading || route.meta.label || 'Hardware test' }}</h1>
          <HubLinks />
        </header>

        <nav v-if="!isLegal" class="tabs" aria-label="Tests">
          <button
            v-for="tool in tools"
            :key="tool.path"
            type="button"
            class="tab"
            :class="{ active: activePath === tool.path }"
            :title="`Shortcut ${tool.shortcut}`"
            @click="router.push(tool.path)"
          >
            {{ tool.label }}
          </button>
        </nav>

        <p v-if="!isLegal" class="tips">1–5 tests</p>

        <RouterView />

        <footer class="footer">
          <nav class="footer-links">
            <button v-if="!isLegal" type="button" class="footer-link" @click="docsOpen = true">
              How to Use
            </button>
            <RouterLink class="footer-link" to="/privacy">Privacy</RouterLink>
            <RouterLink class="footer-link" to="/terms">Terms</RouterLink>
            <a class="footer-link" :href="`${HUB_URL}/about`">About</a>
            <a class="footer-link" :href="`${HUB_URL}/contact`">Contact</a>
          </nav>
        </footer>
      </main>
    </div>

    <InfoModal :open="docsOpen" title="How to Use" @close="docsOpen = false">
      <InfoContent />
    </InfoModal>
  </div>
</template>
