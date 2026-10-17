<script setup>
import { onUnmounted, ref, watch } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { getCameraStream, listDevices, stopStream } from '@/lib/media'
import { getTool } from '@/tools'

const videoEl = ref(null)
const active = ref(false)
const facing = ref('user')
const deviceId = ref('')
const devices = ref([])
const error = ref('')
const status = ref('Click Start to allow camera access.')
const info = ref('')

const tool = getTool('camera')
const seoPoints = tool?.points ?? []
const seoFaq = tool?.faq ?? []
const seoLede = tool?.lede ?? ''
const seoSteps = tool?.steps ?? []
const seoNote = tool?.note ?? ''


let stream

async function refreshDevices() {
  devices.value = await listDevices('videoinput')
}

async function start() {
  error.value = ''
  status.value = 'Requesting camera…'
  stopStream(stream)
  try {
    stream = await getCameraStream(facing.value, deviceId.value || undefined)
    active.value = true
    status.value = 'Camera live.'
    await refreshDevices()
    if (videoEl.value) {
      videoEl.value.srcObject = stream
      await videoEl.value.play()
      const track = stream.getVideoTracks()[0]
      const settings = track?.getSettings?.() || {}
      info.value = [
        settings.width && settings.height
          ? `${settings.width}×${settings.height}`
          : '',
        settings.frameRate ? `${Math.round(settings.frameRate)} fps` : '',
      ].filter(Boolean).join(' · ')
    }
  } catch {
    stop()
    error.value = 'Could not access the camera. Check permissions.'
    status.value = ''
  }
}

function stop() {
  stopStream(stream)
  stream = null
  if (videoEl.value) videoEl.value.srcObject = null
  active.value = false
  info.value = ''
  if (!error.value) status.value = 'Stopped.'
}

function toggleFacing() {
  facing.value = facing.value === 'user' ? 'environment' : 'user'
  deviceId.value = ''
  if (active.value) start()
}

watch(deviceId, () => {
  if (active.value) start()
})

onUnmounted(stop)
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Camera</h2>
      <p>Preview your webcam in the browser.</p>
    </header>

    <div class="workspace">
      <div class="video-frame">
        <video
          ref="videoEl"
          class="video"
          playsinline
          muted
          autoplay
        />
        <p v-if="!active" class="video-empty">No camera yet</p>
      </div>
      <p v-if="info" class="meta-line">{{ info }}</p>

      <div class="controls">
        <label v-if="devices.length" class="field">
          <span>Camera</span>
          <select v-model="deviceId">
            <option value="">Default</option>
            <option
              v-for="item in devices"
              :key="item.deviceId"
              :value="item.deviceId"
            >
              {{ item.label || 'Camera' }}
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
          <button type="button" class="btn" :disabled="!active" @click="toggleFacing">
            Flip
          </button>
        </div>

        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>

    <SeoBlurb :faq="seoFaq" title="Camera test online" :lede="seoLede" :points="seoPoints" :steps="seoSteps" :note="seoNote" />
  </section>
</template>
