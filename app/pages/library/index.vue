<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useEmbyApi } from "~/composables/useEmbyApi";
import { useEmbyStore } from "~/stores/emby/emby.store";

// ===============================
// STORE
// ===============================
const embyStore = useEmbyStore();
const {libraries, loadingLibraries} = storeToRefs(embyStore);

const embyApi = useEmbyApi();

// ===============================
// SEARCH (CLIENT SIDE)
// ===============================
const search = ref("");

const filteredLibraries = computed(() => {
  if (!search.value) return libraries.value;
  return libraries.value.filter((lib) =>
    lib.Name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

// ===============================
// INIT
// ===============================
onMounted(() => {
  if (!libraries.value.length) {
    embyStore.fetchLibraries();
  }
});

// ===============================
// NAV
// ===============================
const goToLibrary = (id: string) => {
  navigateTo(`/library/${id}`);
};

// ===============================
// THUMBNAIL
// ===============================
const libraryThumb = (id: string) => {
  return embyApi.posterUrl(id);
};
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- ===================== -->
    <!-- HEADER -->
    <!-- ===================== -->
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">Media Libraries</h1>
      <p class="text-sm text-muted max-w-2xl">
        Browse all available media libraries on your Emby server. Choose a
        library to explore its videos.
      </p>
    </div>

    <!-- ===================== -->
    <!-- SEARCH -->
    <!-- ===================== -->
    <div class="flex justify-center">
      <UInput
        v-model="search"
        size="lg"
        icon="i-lucide-search"
        placeholder="Search libraries…"
        class="w-full max-w-2xl" />
    </div>

    <!-- ===================== -->
    <!-- LOADING -->
    <!-- ===================== -->
    <div v-if="loadingLibraries" class="text-sm opacity-60">
      Loading libraries…
    </div>

    <!-- ===================== -->
    <!-- GRID -->
    <!-- ===================== -->
    <div
      v-else
      class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      <div
        v-for="lib in filteredLibraries"
        :key="lib.Id"
        class="group cursor-pointer rounded-lg border border-default hover:bg-elevated transition overflow-hidden"
        @click="goToLibrary(lib.Id)">
        <!-- THUMB -->
        <div class="relative aspect-video bg-muted overflow-hidden">
          <img
            :src="libraryThumb(lib.Id)"
            :alt="lib.Name"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            @error="$event.target.style.display  = 'none'" />

          <!-- FALLBACK ICON -->
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon name="i-lucide-folder-video" class="size-8 opacity-60" />
          </div>
        </div>

        <!-- TITLE -->
        <div class="p-3">
          <div class="text-sm font-medium truncate">
            {{ lib.Name }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== -->
    <!-- EMPTY -->
    <!-- ===================== -->
    <div
      v-if="!loadingLibraries && filteredLibraries.length === 0"
      class="text-center text-sm opacity-60 pt-10">
      No libraries match your search.
    </div>
  </div>
</template>
