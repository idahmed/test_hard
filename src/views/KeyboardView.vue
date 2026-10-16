<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { getTool } from '@/tools'

const last = ref('')
const code = ref('')
const mods = ref('')
const log = ref([])

const seoPoints = [
  'Press keys to confirm your keyboard is sending events.',
  'See the key name, code, and modifier keys.',
  'Useful for laptop keyboards and external USB / Bluetooth boards.',
]

const seoFaq = getTool('keyboard')?.faq ?? []


function onKey(event) {
  if (event.target.closest('input, select, textarea, button, a')) return
  event.preventDefault()
  last.value = event.key === ' ' ? 'Space' : event.key
  code.value = event.code
  mods.value = [
    event.ctrlKey && 'Ctrl',
    event.altKey && 'Alt',
    event.shiftKey && 'Shift',
    event.metaKey && 'Meta',
  ].filter(Boolean).join(' · ') || 'none'

  log.value = [
    {
      id: `${Date.now()}-${event.code}`,
      label: `${last.value} · ${event.code}`,
    },
    ...log.value,
  ].slice(0, 12)
}

function clearLog() {
  log.value = []
  last.value = ''
  code.value = ''
  mods.value = ''
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Keyboard</h2>
      <p>Press any key to test your keyboard.</p>
    </header>

    <div class="workspace">
      <div class="focus-box" tabindex="0">
        <strong v-if="last">{{ last }}</strong>
        <span v-else>Click here, then press keys</span>
        <p v-if="code" class="meta-line">{{ code }} · mods {{ mods }}</p>
      </div>

      <div class="controls">
        <div v-if="log.length" class="log">
          <button
            v-for="item in log"
            :key="item.id"
            type="button"
            class="log-item"
          >
            {{ item.label }}
          </button>
        </div>
        <div class="actions">
          <button type="button" class="btn" :disabled="!log.length" @click="clearLog">
            Clear
          </button>
        </div>
      </div>
    </div>

    <SeoBlurb :faq="seoFaq" title="Keyboard test online" :points="seoPoints" />
  </section>
</template>
