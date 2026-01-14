<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import AppBreadCrumb from "~/components/ui/AppBreadCrumb.vue";
import { useEmbyStore } from "~/stores/emby/emby.store";

console.log("[LAYOUT] script loaded");

const toast = useToast();
const open = ref(false);

// ===============================
// STORE
// ===============================
const embyStore = useEmbyStore();
const {libraries, loadingLibraries} = storeToRefs(embyStore);

// ===============================
// FETCH ON MOUNT
// ===============================
onMounted(async () => {
  await embyStore.fetchLibraries();
});

// ===============================
// SIDEBAR MENU (⚠️ HARUS [][])
// ===============================
const libraryMenu = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: "Libraries",
      icon: "i-lucide-library", // ✅ VALID
      to: "/library",
      defaultOpen: true,
      children: libraries.value.map((lib) => ({
        label: lib.Name,
        icon: "i-lucide-video", // ✅ VALID
        to: `/library/${lib.Id}`,
        onSelect: () => {
          open.value = false;
        },
      })),
    },
  ],
]);

// ===============================
// DROPDOWN
// ===============================
const items = [
  [
    {
      label: "Refresh Libraries",
      icon: "i-lucide-refresh-cw",
      onSelect: () => embyStore.fetchLibraries(),
    },
  ],
] satisfies DropdownMenuItem[][];

// ===============================
// GLOBAL SEARCH
// ===============================
const groups = computed(() => [
  {
    id: "libraries",
    label: "Libraries",
    to: "/library",
    icon: "i-lucide-folder-video", // 👈 ICON PARENT
    items: libraries.value.map((lib) => ({
      id: lib.Id,
      label: lib.Name,
      icon: "i-lucide-video",
      to: `/library/${lib.Id}`,
    })),
  },
]);

// ===============================
// COOKIE TOAST
// ===============================
onMounted(() => {
  const cookie = useCookie("cookie-consent");
  if (cookie.value === "accepted") return;

  toast.add({
    title: "We use first-party cookies to enhance your experience.",
    duration: 0,
    close: false,
    actions: [
      {
        label: "Accept",
        color: "neutral",
        variant: "outline",
        onClick: () => {
          cookie.value = "accepted";
        },
      },
    ],
  });
});
</script>

<template>
  <UDashboardGroup unit="rem">
    <!-- ===================== -->
    <!-- SIDEBAR -->
    <!-- ===================== -->
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25">
      <template #header="{collapsed}">
        <div class="flex items-center gap-3 px-3 py-4">
          <img
            src="~/assets/images/logo.png"
            alt="Logo"
            class="object-contain" />
        </div>
      </template>

      <template #default="{collapsed}">
        <UDashboardSearchButton
          :collapsed="collapsed"
          class="bg-transparent ring-default" />

        <!-- 🔥 LIBRARIES -->
        <UNavigationMenu
          :collapsed="collapsed"
          :items="libraryMenu"
          orientation="vertical"
          tooltip
          popover />

        <div v-if="loadingLibraries" class="p-3 text-xs opacity-60">
          Loading libraries...
        </div>
      </template>

      <template #footer="{collapsed}">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <!-- ===================== -->
    <!-- SEARCH -->
    <!-- ===================== -->
    <UDashboardSearch :groups="groups" />

    <!-- ===================== -->
    <!-- MAIN -->
    <!-- ===================== -->
    <UDashboardPanel id="home">
      <template #header>
        <UDashboardNavbar :ui="{right: 'gap-3'}">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <div class="flex items-center gap-2 text-xs opacity-70">
              Powered by
              <img src="~/assets/images/yubi.png" class="h-15" />
            </div>
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar>
          <template #left>
            <AppBreadCrumb :hide-root="false" />
          </template>
        </UDashboardToolbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
