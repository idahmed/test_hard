<script setup>
defineProps({
  kind: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="info-content">
    <template v-if="kind === 'docs'">
      <article>
        <h3>Getting started</h3>
        <ol>
          <li>Pick a test from the tabs (Mic, Camera, Speakers, Keyboard, Mouse).</li>
          <li>Allow browser permissions when prompted.</li>
          <li>Follow the on-screen checks for that device.</li>
        </ol>
      </article>
      <article>
        <h3>Keyboard shortcuts</h3>
        <ul>
          <li><kbd>1</kbd>–<kbd>5</kbd> Switch between tests</li>
        </ul>
      </article>
      <article>
        <h3>Privacy</h3>
        <p>
          Mic and camera streams stay in your browser. Nothing is uploaded to our servers.
        </p>
      </article>
    </template>

    <template v-else-if="kind === 'terms'">
      <article>
        <h3>1. Acceptance of Terms</h3>
        <p>
          By using these hardware tests, you agree to these Terms of Service.
          If you do not agree, please do not use the service.
        </p>
      </article>
      <article>
        <h3>2. Description of Service</h3>
        <p>
          We provide free browser-based tests for microphone, camera, speakers,
          keyboard, and mouse. Processing runs locally in your browser.
        </p>
      </article>
      <article>
        <h3>3. User Responsibilities</h3>
        <p>
          Use the service lawfully. You are responsible for how you use device
          access granted by your browser.
        </p>
      </article>
      <article>
        <h3>4. Disclaimer</h3>
        <p>
          The service is provided “as is” without warranties. Results may vary by
          browser, OS, and hardware.
        </p>
      </article>
      <article>
        <h3>5. Advertising</h3>
        <p>
          Ads from Google Ads and partners may appear to support the free service.
        </p>
      </article>
      <article>
        <h3>6. Contact</h3>
        <p>
          Questions:
          <a href="https://sessea.com" target="_blank" rel="noopener">sessea.com</a>
        </p>
      </article>
      <p class="info-date">Last updated: October 2026</p>
    </template>

    <template v-else-if="kind === 'privacy'">
      <article class="highlight">
        <h3>Short version</h3>
        <p>
          <strong>We do not collect personal data from these tests.</strong>
          Mic and camera media stay on your device.
        </p>
      </article>
      <article>
        <h3>Local processing</h3>
        <p>
          Device access is handled by your browser. Streams are not uploaded to
          our servers. Closing the tab releases media.
        </p>
      </article>
      <article>
        <h3>Local storage</h3>
        <p>
          Theme preference may be saved in localStorage on your device only.
        </p>
      </article>
      <article>
        <h3>Third-party advertising</h3>
        <p>
          Advertising partners may use cookies and similar tech. You can manage
          ads at
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">
            Google Ads Settings
          </a>.
        </p>
      </article>
      <article>
        <h3>Contact</h3>
        <p>
          Privacy questions:
          <a href="https://sessea.com" target="_blank" rel="noopener">sessea.com</a>
        </p>
      </article>
      <p class="info-date">Last updated: October 2026</p>
    </template>
  </div>
</template>
