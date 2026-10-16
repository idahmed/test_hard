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
    faq: [
      { q: 'How do I test mouse buttons online?', a: 'Move inside the pad and click left, middle, or right. Scroll to test the wheel.' },
      { q: 'Does the mouse test upload anything?', a: 'No. Pointer events stay in your browser.' },
    ],
  },
]

export function getTool(name) {
  return tools.find((tool) => tool.name === name)
}
