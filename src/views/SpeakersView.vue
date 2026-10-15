<script setup>
import { ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { playTone } from '@/lib/media'

const busy = ref(false)
const status = ref('Play a tone in the left, right, or both speakers.')
const error = ref('')

const seoPoints = [
  'Verify left and right channels with short test tones.',
  'Use headphones to hear stereo separation clearly.',
  'No files are uploaded — tones are generated locally.',
]

async function play(pan, label) {
  busy.value = true
  error.value = ''
  status.value = `Playing ${label}…`
  try {
    await playTone({ pan, frequency: pan < 0 ? 380 : pan > 0 ? 520 : 440 })
    status.value = `Played ${label}.`
  } catch {
    error.value = 'Could not play audio. Check system sound settings.'
    status.value = ''
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Speakers</h2>
      <p>Play left, right, or both channel tones.</p>
    </header>

    <div class="workspace">
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

    <SeoBlurb title="Speaker test online" :points="seoPoints" />
  </section>
</template>
