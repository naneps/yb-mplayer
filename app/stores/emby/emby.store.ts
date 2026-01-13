import { defineStore } from 'pinia'
import type { EmbyLibrary } from '~/types/emby.types'

export const useEmbyStore = defineStore('emby', () => {
  const libraries = ref<EmbyLibrary[]>([])
  const loadingLibraries = ref(false)

  const fetchLibraries = async () => {
    loadingLibraries.value = true
    const embyApi = useEmbyApi()

    try {
      const res = await embyApi.getLibraries()
      libraries.value = res.Items
    } finally {
      loadingLibraries.value = false
    }
  }

  const filteredLibraries = (search = '') => {
    if (!search) return libraries.value
    return libraries.value.filter(lib =>
      lib.Name.toLowerCase().includes(search.toLowerCase())
    )
  }

  return {
    libraries,
    loadingLibraries,
    fetchLibraries,
    filteredLibraries
  }
})