export default defineNuxtRouteMiddleware((to) => {
  // kalau akses root "/"
  if (to.path === '/') {
    return navigateTo('/library')
  }
})
