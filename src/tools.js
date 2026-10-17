/**
 * Registry for hardware tests.
 * Add new tools here + a view file, then they appear in nav automatically.
 */
export const tools = [
  {
    path: '/mic',
    name: 'mic',
    label: 'Mic',
    heading: 'Mic test',
    title: 'Microphone test online — free browser mic check',
    description:
      'Test your microphone online for free. Check input level, devices, and record a sample in your browser. No upload required.',
    shortcut: '1',
    lede: 'Use this page to confirm your microphone is detected, see live input levels, and optionally record a short sample that stays on your device.',
    points: [
      'Check that your microphone is detected and picking up sound.',
      'Record a short local sample, play it back, and download it.',
      'Nothing is uploaded — audio stays in your browser.',
    ],
    steps: [
      'Click Start and allow microphone access when the browser asks.',
      'Speak normally and watch the level meter respond.',
      'Optionally record a sample, play it back, then download or clear it.',
    ],
    note: 'Revoke mic permission in your browser site settings when you finish if you share the computer.',
    faq: [
      { q: 'How do I test my microphone online?', a: 'Allow mic access, watch the level meter, and optionally record a short sample.' },
      { q: 'Is the mic test private?', a: 'Yes. Audio stays in your browser and is not uploaded to our servers.' },
    ],
  },
  {
    path: '/camera',
    name: 'camera',
    label: 'Camera',
    heading: 'Camera test',
    title: 'Camera test online — free webcam check',
    description:
      'Test your webcam online for free. Preview video, switch cameras, and verify your camera works in the browser.',
    shortcut: '2',
    lede: 'Preview your webcam in the browser to confirm framing, lighting, and that the correct camera is selected before a call or class.',
    points: [
      'See a live preview after you grant camera permission.',
      'Switch facing cameras when your device supports it.',
      'Video is not uploaded to sessea — it stays in the page.',
    ],
    steps: [
      'Allow camera access when prompted.',
      'Check the preview and switch cameras if needed.',
      'Stop the preview when you are done testing.',
    ],
    note: 'Cover or disable the camera when finished if you are on a shared machine.',
    faq: [
      { q: 'How do I test my webcam online?', a: 'Allow camera access and check the live preview. Switch facing cameras if available.' },
      { q: 'Does the camera test upload video?', a: 'No. The stream stays local in your browser.' },
    ],
  },
  {
    path: '/speakers',
    name: 'speakers',
    label: 'Speakers',
    heading: 'Speaker test',
    title: 'Speaker test online — left right channel check',
    description:
      'Test speakers and headphones online. Play left, right, and both channels to check stereo audio output.',
    shortcut: '3',
    lede: 'Play test tones to verify left and right channels on headphones or speakers before meetings or music work.',
    points: [
      'Play left, right, and both channels separately.',
      'Confirm stereo wiring and that neither side is muted.',
      'No file upload is required — tones play in the browser.',
    ],
    steps: [
      'Set a comfortable volume on your device.',
      'Play Left, then Right, then Both.',
      'Adjust system sound settings if a channel is missing.',
    ],
    note: 'Start quiet if you use headphones to avoid sudden loud tones.',
    faq: [
      { q: 'How do I test left and right speakers?', a: 'Play the left, right, and both buttons and listen for each channel.' },
      { q: 'Do I need to upload audio?', a: 'No. Test tones play directly in your browser.' },
    ],
  },
  {
    path: '/keyboard',
    name: 'keyboard',
    label: 'Keyboard',
    heading: 'Keyboard test',
    title: 'Keyboard test online — key press checker',
    description:
      'Test your keyboard online. See every key press, release, and code instantly in your browser.',
    shortcut: '4',
    lede: 'Press keys to see live press and release events so sticky, missing, or remapped keys are easy to spot.',
    points: [
      'Log key down and key up events as you type.',
      'Useful for new keyboards, laptops, and troubleshooting.',
      'Key data stays in the browser session.',
    ],
    steps: [
      'Focus the test area on the page.',
      'Press and release keys you want to verify.',
      'Watch the log for missing or repeated events.',
    ],
    note: 'Avoid typing passwords on a shared screen while testing.',
    faq: [
      { q: 'How do I check if keyboard keys work?', a: 'Focus the test area and press keys. Each press and release is logged.' },
      { q: 'Does the keyboard test send data online?', a: 'No. Key events are shown locally only.' },
    ],
  },
  {
    path: '/mouse',
    name: 'mouse',
    label: 'Mouse',
    heading: 'Mouse test',
    title: 'Mouse and trackpad test online',
    description:
      'Test mouse or trackpad online. Check move, left/middle/right clicks, and scroll in your browser.',
    shortcut: '5',
    lede: 'Move, click, and scroll inside the pad to confirm buttons and tracking on a mouse or trackpad.',
    points: [
      'See pointer movement inside the test pad.',
      'Check left, middle, and right clicks plus scroll.',
      'Events stay local — nothing is uploaded.',
    ],
    steps: [
      'Move the pointer inside the pad.',
      'Click each button and scroll the wheel or trackpad.',
      'Confirm the page registers each action.',
    ],
    note: 'On some trackpads, middle-click needs a system gesture or external mouse.',
    faq: [
      { q: 'How do I test mouse buttons online?', a: 'Move inside the pad and click left, middle, or right. Scroll to test the wheel.' },
      { q: 'Does the mouse test upload anything?', a: 'No. Pointer events stay in your browser.' },
    ],
  },
]

export function getTool(name) {
  return tools.find((tool) => tool.name === name)
}
