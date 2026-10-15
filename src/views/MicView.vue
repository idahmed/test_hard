<script setup>
import { onUnmounted, ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import {
  createMicMeter,
  ensureAudio,
  listDevices,
  readLevel,
  stopStream,
  getMicStream,
} from '@/lib/media'

const active = ref(false)
const level = ref(0)
const peak = ref(0)
const error = ref('')
const deviceId = ref('')
const devices = ref([])
const status = ref('Click Start to allow microphone access.')

const seoPoints = [
  'Check that your microphone is detected and picking up sound.',
  'Watch the live level meter while you speak.',
  'Everything runs in your browser — nothing is recorded or uploaded.',
]

let stream
let meter
let frame

async function refreshDevices() {
  devices.value = await listDevices('audioinput')
}

async function start() {
  error.value = ''
  status.value = 'Requesting microphone…'
  try {
    await ensureAudio()
    stream = await getMicStream(deviceId.value || undefined)
    meter = createMicMeter(stream)
    active.value = true
    peak.value = 0
    status.value = 'Speak near the mic.'
    await refreshDevices()
    tick()
  } catch {
    stop()
    error.value = 'Could not access the microphone. Check permissions.'
    status.value = ''
  }
}

function stop() {
  cancelAnimationFrame(frame)
  stopStream(stream)
  stream = null
  meter = null
  active.value = false
  level.value = 0
  if (!error.value) status.value = 'Stopped.'
}

function tick() {
  if (!meter) return
  const value = readLevel(meter.analyser)
  level.value = value
  peak.value = Math.max(peak.value, value)
  frame = requestAnimationFrame(tick)
}

onUnmounted(stop)
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Mic</h2>
      <p>Test your microphone with a live level meter.</p>
    </header>

    <div class="workspace">
      <div class="meter-wrap">
        <div class="meter">
          <div class="meter-fill" :style="{ width: `${Math.min(100, level * 280)}%` }" />
        </div>
        <p class="meta-line">
          Level {{ Math.round(level * 100) }}%
          · Peak {{ Math.round(peak * 100) }}%
        </p>
      </div>

      <div class="controls">
        <label v-if="devices.length" class="field">
          <span>Input</span>
          <select v-model="deviceId" :disabled="active">
            <option value="">Default</option>
            <option
              v-for="item in devices"
              :key="item.deviceId"
              :value="item.deviceId"
            >
              {{ item.label || 'Microphone' }}
            </option>
          </select>
        </label>

        <div class="actions">
          <button
            v-if="!active"
            type="button"
            class="btn primary"
            @click="start"
          >
            Start
          </button>
          <button v-else type="button" class="btn" @click="stop">Stop</button>
        </div>

        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>

    <SeoBlurb title="Microphone test online" :points="seoPoints" />
  </section>
</template>
