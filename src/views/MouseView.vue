<script setup>
import { onUnmounted, ref } from 'vue'
import SeoBlurb from '@/components/SeoBlurb.vue'
import { getTool } from '@/tools'

const pad = ref(null)
const x = ref(0)
const y = ref(0)
const buttons = ref({ left: false, middle: false, right: false })
const scroll = ref(0)
const clicks = ref(0)
const inside = ref(false)

const seoPoints = [
  'Move, click, and scroll inside the pad to test your mouse or trackpad.',
  'Check left, middle, and right buttons separately.',
  'Works with mice, trackpads, and most pointer devices.',
]

const seoFaq = getTool('mouse')?.faq ?? []


function onMove(event) {
  const el = pad.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  x.value = Math.round(event.clientX - rect.left)
  y.value = Math.round(event.clientY - rect.top)
  inside.value = true
}

function onLeave() {
  inside.value = false
  buttons.value = { left: false, middle: false, right: false }
}

function onDown(event) {
  event.preventDefault()
  if (event.button === 0) buttons.value.left = true
  if (event.button === 1) buttons.value.middle = true
  if (event.button === 2) buttons.value.right = true
  clicks.value += 1
}

function onUp(event) {
  if (event.button === 0) buttons.value.left = false
  if (event.button === 1) buttons.value.middle = false
  if (event.button === 2) buttons.value.right = false
}

function onWheel(event) {
  event.preventDefault()
  scroll.value += Math.sign(event.deltaY) || (event.deltaY > 0 ? 1 : -1)
}

function reset() {
  scroll.value = 0
  clicks.value = 0
}

onUnmounted(() => {
  /* listeners are on the pad element via template */
})
</script>

<template>
  <section class="tool">
    <header class="tool-head">
      <h2>Mouse</h2>
      <p>Test mouse or trackpad move, buttons, and scroll.</p>
    </header>

    <div class="workspace">
      <div
        ref="pad"
        class="pointer-pad"
        @pointermove="onMove"
        @pointerleave="onLeave"
        @pointerdown="onDown"
        @pointerup="onUp"
        @contextmenu.prevent
        @wheel="onWheel"
      >
        <span v-if="!inside">Move here</span>
        <span v-else>{{ x }}, {{ y }}</span>
      </div>

      <div class="chips">
        <span class="chip" :class="{ active: buttons.left }">Left</span>
        <span class="chip" :class="{ active: buttons.middle }">Middle</span>
        <span class="chip" :class="{ active: buttons.right }">Right</span>
      </div>

      <p class="meta-line">
        Clicks {{ clicks }} · Scroll {{ scroll }}
      </p>

      <div class="controls">
        <div class="actions">
          <button type="button" class="btn" @click="reset">Reset</button>
        </div>
      </div>
    </div>

    <SeoBlurb :faq="seoFaq" title="Mouse and trackpad test" :points="seoPoints" />
  </section>
</template>
