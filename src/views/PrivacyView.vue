<script setup>
import { HUB_URL, SITE_URL } from '@/lib/sites'
</script>

<template>
  <article class="legal">
    <h2>Privacy Policy</h2>
    <p class="legal-meta">Last updated: October 2026 · {{ SITE_URL.replace('https://', '') }}</p>

    <section>
      <h3>Short version</h3>
      <p>
        Hardware tests run in your browser. Microphone and camera streams are used
        for on-page previews after you grant permission. We do not upload those
        streams to sessea servers or require an account.
      </p>
    </section>

    <section>
      <h3>Local processing</h3>
      <p>
        Mic level meters, camera previews, speaker tones, keyboard logs, and mouse
        events stay in the tab. Optional recordings you download are saved only
        where you choose on your device.
      </p>
    </section>

    <section>
      <h3>Advertising</h3>
      <p>
        Pages may show Google AdSense ads. Ad partners may use cookies or similar
        technologies. That is separate from your mic/camera media. Manage ads in
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.
      </p>
    </section>

    <section>
      <h3>Full policy</h3>
      <p>
        The complete hub policy is on
        <a :href="`${HUB_URL}/privacy`">sessea.com/privacy</a>.
        Contact:
        <a :href="`${HUB_URL}/contact`">sessea.com/contact</a>.
      </p>
    </section>
  </article>
</template>
