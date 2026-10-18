export function stopStream(stream) {
  stream?.getTracks?.().forEach((track) => track.stop())
}

export async function listDevices(kind) {
  if (!navigator.mediaDevices?.enumerateDevices) return []
  const devices = await navigator.mediaDevices.enumerateDevices()
  return devices.filter((item) => item.kind === kind)
}

/** Unlock device labels (needed in Chromium for outputs). */
export async function unlockDeviceLabels() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stopStream(stream)
  } catch {
    /* ignore */
  }
}

export async function getMicStream(deviceId) {
  const audio = deviceId ? { deviceId: { exact: deviceId } } : true
  return navigator.mediaDevices.getUserMedia({ audio, video: false })
}

export async function getCameraStream(facingMode = 'user', deviceId) {
  const video = deviceId
    ? { deviceId: { exact: deviceId } }
    : { facingMode }
  return navigator.mediaDevices.getUserMedia({ audio: false, video })
}

let audioCtx

function ctx() {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

export async function ensureAudio(sinkId = '') {
  const ac = ctx()
  if (ac.state === 'suspended') await ac.resume()
  if (typeof ac.setSinkId === 'function') {
    try {
      await ac.setSinkId(sinkId || '')
    } catch {
      /* unsupported sink */
    }
  }
  return ac
}

/** RMS level 0–1 from an AnalyserNode. */
export function readLevel(analyser) {
  const data = new Uint8Array(analyser.fftSize)
  analyser.getByteTimeDomainData(data)
  let sum = 0
  for (let i = 0; i < data.length; i += 1) {
    const v = (data[i] - 128) / 128
    sum += v * v
  }
  return Math.sqrt(sum / data.length)
}

/** Play a short tone. pan: -1 left, 0 center, 1 right. */
export async function playTone({
  frequency = 440,
  duration = 0.8,
  pan = 0,
  gain = 0.2,
  sinkId = '',
} = {}) {
  const ac = await ensureAudio(sinkId)
  const osc = ac.createOscillator()
  const amp = ac.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency

  let node = amp
  if (typeof ac.createStereoPanner === 'function') {
    const panner = ac.createStereoPanner()
    panner.pan.value = Math.max(-1, Math.min(1, pan))
    amp.connect(panner)
    node = panner
  }

  osc.connect(amp)

  let el
  const canSetCtxSink = typeof ac.setSinkId === 'function'
  if (sinkId && !canSetCtxSink) {
    const dest = ac.createMediaStreamDestination()
    node.connect(dest)
    el = new Audio()
    el.srcObject = dest.stream
    if (typeof el.setSinkId === 'function') await el.setSinkId(sinkId)
    await el.play()
  } else {
    node.connect(ac.destination)
  }

  const now = ac.currentTime
  amp.gain.setValueAtTime(0, now)
  amp.gain.linearRampToValueAtTime(gain, now + 0.04)
  amp.gain.linearRampToValueAtTime(0, now + duration)

  osc.start(now)
  osc.stop(now + duration + 0.02)

  return new Promise((resolve) => {
    osc.onended = () => {
      if (el) {
        el.pause()
        el.srcObject = null
      }
      resolve()
    }
  })
}

export function createMicMeter(stream) {
  const ac = ctx()
  const source = ac.createMediaStreamSource(stream)
  const analyser = ac.createAnalyser()
  analyser.fftSize = 1024
  source.connect(analyser)
  return { ac, source, analyser }
}

export function pickRecorderMime() {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
  return types.find((type) => MediaRecorder.isTypeSupported(type)) || ''
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
