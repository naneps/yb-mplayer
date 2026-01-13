<script setup lang="ts">
import type { EmbyVideo } from '~/types/emby.types'

const route = useRoute()
const embyApi = useEmbyApi()

// ===============================
// STATE
// ===============================
const search = ref('')

// ===============================
// FETCH VIDEOS
// ===============================
const { data, pending, refresh } = await useAsyncData(
  () => `library-videos-${route.params.id}-${search.value}`,
  () =>
    embyApi.getVideosByLibrary(
      route.params.id as string,
      search.value || undefined
    ),
  {
    watch: [search]
  }
)

// ===============================
// COMPUTED
// ===============================
const videos = computed<EmbyVideo[]>(() => data.value?.Items ?? [])

// ===============================
// NAV
// ===============================
const playVideo = (id: string) => {
  navigateTo(`/watch/${id}`)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- ===================== -->
    <!-- HEADER -->
    <!-- ===================== -->
    <div class="space-y-1">
      <h1 class="text-xl font-semibold">
        Library Videos
      </h1>
      <p class="text-sm opacity-70">
        Browse and play videos from this library.
      </p>
    </div>

    <!-- ===================== -->
    <!-- SEARCH -->
    <!-- ===================== -->
    <div class="flex justify-center">
      <UInput
        v-model="search"
        icon="i-lucide-search"
        size="lg"
        placeholder="Search videos..."
        class="w-full max-w-2xl"
        :loading="pending"
      />
    </div>

    <!-- ===================== -->
    <!-- LOADING -->
    <!-- ===================== -->
    <div v-if="pending" class="opacity-60">
      Loading videos...
    </div>

    <!-- ===================== -->
    <!-- GRID -->
    <!-- ===================== -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
    >
      <div
        v-for="video in videos"
        :key="video.Id"
        class="group cursor-pointer rounded-lg border border-default hover:bg-elevated transition overflow-hidden"
        @click="playVideo(video.Id)"
      >
        <!-- ================= -->
        <!-- POSTER -->
        <!-- ================= -->
        <div class="relative aspect-video bg-muted overflow-hidden">
          <img
            :src="embyApi.posterUrl(video.Id)"
            :alt="video.Name"
            class="w-full h-full object-cover group-hover:scale-105 transition"
            @error="$event.target.style.display = 'none'"
          />

          <!-- PLAY OVERLAY -->
          <div
            class="absolute inset-0 flex items-center justify-center
                   bg-black/30 opacity-0 group-hover:opacity-100 transition"
          >
            <UIcon
              name="i-lucide-play-circle"
              class="size-12 text-white"
            />
          </div>
        </div>

        <!-- ================= -->
        <!-- TITLE -->
        <!-- ================= -->
        <div class="p-2">
          <div class="text-sm font-medium truncate">
            {{ video.Name }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== -->
    <!-- EMPTY -->
    <!-- ===================== -->
    <div
      v-if="!pending && videos.length === 0"
      class="text-center text-sm opacity-60 pt-10"
    >
      No videos found.
    </div>
  </div>
</template>