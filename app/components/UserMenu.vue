<script setup lang="ts">
import { useAuthStore } from "@/stores/auth/auth.store";
import type { User } from "@/types/user.types";
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{collapsed?: boolean}>();

const auth = useAuthStore();
const toast = useToast();
const colorMode = useColorMode();
const appConfig = useAppConfig();
const showConfirm = ref(false);
const pending = ref(false);
// —— user dari store (fallback aman) ——
const menuUser = computed(() => {
  const u = (auth.user as User | null) || null;
  const name = u?.name || (u as any)?.username || (u as any)?.email || "User";
  const avatarSrc =
    (u as any)?.avatar &&
    typeof (u as any).avatar === "string" &&
    (u as any).avatar.length > 4
      ? (u as any).avatar
      : "https://dummyimage.com/96x96/2e2e2e/ffffff.png&text=U";
  return {name, avatar: {src: avatarSrc, alt: name}};
});

// —— confirm logout state ——
const confirmingLogout = ref(false);
const logoutPending = ref(false);
async function doLogout() {
  logoutPending.value = true;
  try {
    await auth.logout();
    confirmingLogout.value = false;
    toast.add({title: "Berhasil keluar", color: "success"});
    await navigateTo("/auth", {replace: true});
  } catch {
    toast.add({title: "Gagal logout", color: "error"});
  } finally {
    logoutPending.value = false;
  }
}

// —— theme options (tetap) ——
const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];
const neutrals = ["slate", "gray", "zinc", "neutral", "stone"];

const items = computed<DropdownMenuItem[][]>(() => [
  
  [
    {
      label: "Theme",
      icon: "i-lucide-palette",
      children: [
        {
          label: "Primary",
          slot: "chip",
          chip: appConfig.ui.colors.primary,
          content: {align: "center", collisionPadding: 16},
          children: colors.map((color) => ({
            label: color,
            chip: color,
            slot: "chip",
            type: "checkbox",
            checked: appConfig.ui.colors.primary === color,
            onSelect: (e: Event) => {
              e.preventDefault();
              appConfig.ui.colors.primary = color;
            },
          })),
        },
        {
          label: "Neutral",
          slot: "chip",
          chip:
            appConfig.ui.colors.neutral === "neutral"
              ? "old-neutral"
              : appConfig.ui.colors.neutral,
          content: {align: "end", collisionPadding: 16},
          children: neutrals.map((color) => ({
            label: color,
            chip: color === "neutral" ? "old-neutral" : color,
            slot: "chip",
            type: "checkbox",
            checked: appConfig.ui.colors.neutral === color,
            onSelect: (e: Event) => {
              e.preventDefault();
              appConfig.ui.colors.neutral = color;
            },
          })),
        },
      ],
    },
    {
      label: "Appearance",
      icon: "i-lucide-sun-moon",
      children: [
        {
          label: "Light",
          icon: "i-lucide-sun",
          type: "checkbox",
          checked: colorMode.value === "light",
          onSelect(e: Event) {
            e.preventDefault();
            colorMode.preference = "light";
          },
        },
        {
          label: "Dark",
          icon: "i-lucide-moon",
          type: "checkbox",
          checked: colorMode.value === "dark",
          onUpdateChecked(checked: boolean) {
            if (checked) colorMode.preference = "dark";
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ],
 
]);
async function onConfirmLogout() {
  pending.value = true;
  try {
    await auth.logout();
    useToast().add({title: "Berhasil keluar", color: "success"});
    await navigateTo("/auth", {replace: true});
  } finally {
    pending.value = false;
    showConfirm.value = false;
  }
}
</script>

<template>

  <UDropdownMenu
    :items="items"
    :content="{align: 'center', collisionPadding: 12}"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
    }">
    <UButton
      v-bind="{
        ...menuUser,
        label: collapsed ? undefined : menuUser.name,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{trailingIcon: 'text-dimmed'}" />

  
  </UDropdownMenu>
</template>
