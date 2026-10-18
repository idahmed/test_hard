<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { getTool } from '@/tools'

const last = ref('')
const code = ref('')
const mods = ref('')
const log = ref([])

const tool = getTool('keyboard')
const seoPoints = tool?.points ?? []
const seoFaq = tool?.faq ?? []
const seoLede = tool?.lede ?? ''
const seoSteps = tool?.steps ?? []
const seoNote = tool?.note ?? ''


let nextId = 0

function onKey(event) {
  if (event.target.closest('input, select, textarea')) return
  // Leave Ctrl/Cmd shortcuts (reload, tabs, …) to the browser.
  if (!event.ctrlKey && !event.metaKey) event.preventDefault()

  const key = event.key === ' ' ? 'Space' : event.key
  const down = event.type === 'keydown'
  if (down) {
    last.value = key
    code.value = event.code
    mods.value = [
      event.ctrlKey && 'Ctrl',
      event.altKey && 'Alt',
      event.shiftKey && 'Shift',
      event.metaKey && 'Meta',
    ].filter(Boolean).join(' · ') || 'none'
  }

  log.value = [
    {
      id: nextId++,
      label: `${down ? '↓' : '↑'} ${key} · ${event.code}`,
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

onMounted(() => {
  window.addEventListener('keydown', onKey)
  window.addEventListener('keyup', onKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('keyup', onKey)
})
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
          <span v-for="item in log" :key="item.id" class="log-item">
            {{ item.label }}
          </span>
        </div>
        <div class="actions">
          <button type="button" class="btn" :disabled="!log.length" @click="clearLog">
            Clear
          </button>
        </div>
      </div>
    </div>

    <SeoBlurb :faq="seoFaq" title="Keyboard test online" :lede="seoLede" :points="seoPoints" :steps="seoSteps" :note="seoNote" />
  </section>
</template>
