<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { getTool } from '@/tools'
import {
  createMicMeter,
  downloadBlob,
  ensureAudio,
  getMicStream,
  listDevices,
  pickRecorderMime,
  readLevel,
  stopStream,
} from '@/lib/media'

const active = ref(false)
const recording = ref(false)
const level = ref(0)
const peak = ref(0)
const error = ref('')
const deviceId = ref('')
const devices = ref([])
const status = ref('Click Start to allow microphone access.')
const sampleUrl = ref('')
const sampleType = ref('audio/webm')

const tool = getTool('mic')
const seoPoints = tool?.points ?? []
const seoFaq = tool?.faq ?? []
const seoLede = tool?.lede ?? ''
const seoSteps = tool?.steps ?? []
const seoNote = tool?.note ?? ''


let stream
let meter
let frame
let recorder
let chunks = []
let recordTimer

function deviceLabel(item, index) {
  if (item.label) return item.label
  return `Microphone ${index + 1}`
}

async function refreshDevices() {
  const list = await listDevices('audioinput')
  devices.value = list.filter((item) => item.deviceId)
  if (deviceId.value && !devices.value.some((item) => item.deviceId === deviceId.value)) {
    deviceId.value = ''
  }
}

/** Chromium often hides inputs until getUserMedia runs once in this page. */
async function loadInputs() {
  await refreshDevices()
  if (devices.value.length) return
  try {
    const probe = await getMicStream()
    stopStream(probe)
    await refreshDevices()
  } catch {
    /* permission not granted yet — Start will ask */
  }
}

function revokeSample() {
  if (sampleUrl.value) URL.revokeObjectURL(sampleUrl.value)
  sampleUrl.value = ''
}

function stopRecorder() {
  clearTimeout(recordTimer)
  if (recorder && recorder.state !== 'inactive') recorder.stop()
  recorder = null
  recording.value = false
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
    status.value = 'Speak near the mic. You can also record a sample.'
    await refreshDevices()
    tick()
  } catch {
    stop()
    error.value = 'Could not access the microphone. Check permissions.'
    status.value = ''
  }
}

function stop() {
  stopRecorder()
  cancelAnimationFrame(frame)
  stopStream(stream)
  stream = null
  meter = null
  active.value = false
  level.value = 0
  if (!error.value) status.value = sampleUrl.value ? 'Stopped. Sample kept below.' : 'Stopped.'
}

function tick() {
  if (!meter) return
  const value = readLevel(meter.analyser)
  level.value = value
  peak.value = Math.max(peak.value, value)
  frame = requestAnimationFrame(tick)
}

function startRecord() {
  if (!stream || recording.value) return
  if (typeof MediaRecorder === 'undefined') {
    error.value = 'Recording is not supported in this browser.'
    return
  }

  chunks = []
  const mime = pickRecorderMime()
  try {
    recorder = mime
      ? new MediaRecorder(stream, { mimeType: mime })
      : new MediaRecorder(stream)
  } catch {
    error.value = 'Could not start recording.'
    return
  }

  sampleType.value = recorder.mimeType || mime || 'audio/webm'
  recorder.ondataavailable = (event) => {
    if (event.data?.size) chunks.push(event.data)
  }
  recorder.onstop = () => {
    if (!chunks.length) return
    revokeSample()
    const blob = new Blob(chunks, { type: sampleType.value })
    sampleUrl.value = URL.createObjectURL(blob)
    status.value = 'Sample ready — play or download it.'
  }

  recording.value = true
  error.value = ''
  status.value = 'Recording… (max 8s)'
  recorder.start()
  recordTimer = setTimeout(stopRecord, 8000)
}

function stopRecord() {
  if (!recording.value) return
  stopRecorder()
}

function downloadSample() {
  if (!sampleUrl.value) return
  const ext = sampleType.value.includes('mp4') ? 'm4a' : 'webm'
  fetch(sampleUrl.value)
    .then((res) => res.blob())
    .then((blob) => downloadBlob(blob, `mic-sample.${ext}`))
}

onMounted(() => {
  loadInputs()
  navigator.mediaDevices?.addEventListener?.('devicechange', refreshDevices)
})

onUnmounted(() => {
  navigator.mediaDevices?.removeEventListener?.('devicechange', refreshDevices)
  stop()
  revokeSample()
})
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Mic</h2>
      <p>Test your microphone and record a short sample.</p>
    </header>

    <div class="workspace">
      <div class="meter-wrap">
        <div class="meter">
          <div class="meter-fill" :style="{ width: `${Math.min(100, level * 280)}%` }" />
        </div>
        <p class="meta-line">
          Level {{ Math.round(level * 100) }}%
          · Peak {{ Math.round(peak * 100) }}%
          <template v-if="recording"> · Recording</template>
        </p>
      </div>

      <div class="controls">
        <label class="field">
          <span>Input</span>
          <select v-model="deviceId" :disabled="active">
            <option value="">Default</option>
            <option
              v-for="(item, index) in devices"
              :key="item.deviceId"
              :value="item.deviceId"
            >
              {{ deviceLabel(item, index) }}
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
          <button
            v-if="active && !recording"
            type="button"
            class="btn primary"
            @click="startRecord"
          >
            Record
          </button>
          <button
            v-if="recording"
            type="button"
            class="btn"
            @click="stopRecord"
          >
            Stop record
          </button>
        </div>

        <div v-if="sampleUrl" class="sample">
          <audio :key="sampleUrl" :src="sampleUrl" controls preload="metadata" />
          <div class="actions">
            <button type="button" class="btn" @click="downloadSample">
              Download sample
            </button>
            <button type="button" class="btn" @click="revokeSample">
              Clear sample
            </button>
          </div>
        </div>

        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>

    <SeoBlurb :faq="seoFaq" title="Microphone test online" :lede="seoLede" :points="seoPoints" :steps="seoSteps" :note="seoNote" />
  </section>
</template>
