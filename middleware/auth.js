export default defineNuxtRouteMiddleware((to) => {
    const authStore = useAuthStore()

    // Список публичных маршрутов
    const publicRoutes = ['/', '/login']

    // Если маршрут публичный, пропускаем
    if (publicRoutes.includes(to.path)) {
        return
    }

    // Проверяем авторизацию только на клиенте
    if (process.client) {
        authStore.checkAuth()

        // Если пользователь не авторизован и пытается попасть на защищенный маршрут
        if (!authStore.isAuthenticated) {
            // Перенаправляем на страницу логина
            return navigateTo('/login')
        }
    }
})
