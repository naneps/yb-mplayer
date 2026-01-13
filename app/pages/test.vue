<script setup lang="ts">
console.log('🔥 TEST PAGE SCRIPT')

onMounted(async () => {
  console.log('🔥 TEST PAGE MOUNTED')

  const api = useEmbyApi()
  const res = await api.getLibraries()
  console.log('🔥 LIBRARIES RESULT', res)
})
</script>

<template>
  <div>TEST PAGE</div>
</template>
