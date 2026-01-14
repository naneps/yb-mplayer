<script setup lang="ts">
const route = useRoute();
const embyApi = useEmbyApi();

const videoId = route.params.id as string;

// =====================
// TITLE
// =====================
const title = computed(() => (route.query.title as string) || "Now Playing");

// =====================
// STREAM URL
// =====================
const videoSrc = computed(() => embyApi.streamUrl(videoId));

// =====================
// FULLSCREEN
// =====================
const videoRef = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  setTimeout(() => {
    videoRef.value?.requestFullscreen?.().catch(() => {});
  }, 400);
});

// =====================
// NAV
// =====================
const goBack = () => history.back();
const goLibrary = () => navigateTo("/library");
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="relative max-w-6xl mx-auto px-2 md:px-4 py-6">
      <!-- ===================== -->
      <!-- PLAYER WRAPPER -->
      <!-- ===================== -->
      <div
        class="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <!-- ===================== -->
        <!-- OVERLAY CONTROLS -->
        <!-- ===================== -->
        <div class="absolute inset-0 z-40 pointer-events-none group">
          <!-- TOP LEFT -->
          <div class="absolute top-4 left-4 flex gap-2 pointer-events-auto">
            <button
              class="bg-black/70 hover:bg-black px-3 py-2 rounded-lg text-sm backdrop-blur transition"
              @click="goBack">
              ← Back
            </button>

            <button
              class="bg-black/70 hover:bg-black px-3 py-2 rounded-lg text-sm backdrop-blur transition"
              @click="goLibrary">
              📁 Library
            </button>
          </div>

          <!-- TOP CENTER TITLE -->
          <div
            class="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <div
              class="bg-black/70 px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur">
              {{ title }}
            </div>
          </div>
        </div>

        <!-- ===================== -->
        <!-- VIDEO -->
        <!-- ===================== -->
        <video
          ref="videoRef"
          :src="videoSrc"
          controls
          autoplay
          loop
          playsinline
          preload="metadata"
          class="w-full h-full object-contain bg-black pointer-events-auto" />
      </div>
    </div>
  </div>
</template>
