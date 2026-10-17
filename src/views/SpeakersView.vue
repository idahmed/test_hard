<script setup>
import { onMounted, ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { listDevices, playTone, unlockDeviceLabels } from '@/lib/media'
import { getTool } from '@/tools'

const busy = ref(false)
const sinkId = ref('')
const outputs = ref([])
const status = ref('Choose an output, then play a tone.')
const error = ref('')
const canSelect = ref(true)

const tool = getTool('speakers')
const seoPoints = tool?.points ?? []
const seoFaq = tool?.faq ?? []
const seoLede = tool?.lede ?? ''
const seoSteps = tool?.steps ?? []
const seoNote = tool?.note ?? ''


async function refreshOutputs() {
  await unlockDeviceLabels()
  outputs.value = await listDevices('audiooutput')
  const probe = document.createElement('audio')
  canSelect.value = typeof probe.setSinkId === 'function'
    || typeof AudioContext.prototype.setSinkId === 'function'
}

async function play(pan, label) {
  busy.value = true
  error.value = ''
  status.value = `Playing ${label}…`
  try {
    await playTone({
      pan,
      sinkId: sinkId.value,
      frequency: pan < 0 ? 380 : pan > 0 ? 520 : 440,
    })
    status.value = `Played ${label}.`
  } catch {
    error.value = 'Could not play audio. Check output permissions and system sound.'
    status.value = ''
  } finally {
    busy.value = false
  }
}

onMounted(refreshOutputs)
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Speakers</h2>
      <p>Play left, right, or both channel tones.</p>
    </header>

    <div class="workspace">
      <div class="controls controls-top">
        <label class="field">
          <span>Output</span>
          <select v-model="sinkId" :disabled="busy || !canSelect">
            <option value="">Default</option>
            <option
              v-for="item in outputs"
              :key="item.deviceId"
              :value="item.deviceId"
            >
              {{ item.label || `Output ${item.deviceId.slice(0, 6)}` }}
            </option>
          </select>
        </label>
        <p v-if="!canSelect" class="status">
          This browser does not allow choosing an audio output.
        </p>
        <div class="actions">
          <button type="button" class="btn" :disabled="busy" @click="refreshOutputs">
            Refresh outputs
          </button>
        </div>
      </div>

      <div class="speaker-grid">
        <button type="button" class="speaker-btn" :disabled="busy" @click="play(-1, 'left')">
          Left
        </button>
        <button type="button" class="speaker-btn" :disabled="busy" @click="play(0, 'both')">
          Both
        </button>
        <button type="button" class="speaker-btn" :disabled="busy" @click="play(1, 'right')">
          Right
        </button>
      </div>

      <div class="controls">
        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>

    <SeoBlurb :faq="seoFaq" title="Speaker test online" :lede="seoLede" :points="seoPoints" :steps="seoSteps" :note="seoNote" />
  </section>
</template>
