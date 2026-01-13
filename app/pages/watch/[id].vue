<script setup lang="ts">
const route = useRoute()
const embyApi = useEmbyApi()

const videoId = route.params.id as string

const videoSrc = computed(() => embyApi.streamUrl(videoId))
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-lg font-semibold">
      Now Playing
    </h1>

    <div class="w-full max-w-5xl mx-auto">
      <video
        :src="videoSrc"
        controls
        autoplay
        playsinline
        class="w-full rounded-lg bg-black"
      />
    </div>
  </div>
</template>