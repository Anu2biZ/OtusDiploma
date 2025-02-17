<!-- app.vue -->
<template>
  <div class="min-h-screen bg-gray-900">
    <header v-if="showHeader" class="bg-gray-800 border-b border-gray-700">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo/Home -->
          <NuxtLink to="/" class="text-xl font-bold text-blue-400">
            Crypto Arbitrage
          </NuxtLink>

          <!-- Navigation -->
          <div class="flex items-center space-x-4">
            <NuxtLink
                v-for="link in navigationLinks"
                :key="link.path"
                :to="link.path"
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              {{ link.name }}
            </NuxtLink>

            <!-- Logout button (показываем только если пользователь авторизован) -->
            <button
                v-if="isAuthenticated"
                @click="handleLogout"
                class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Выйти
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Page Content -->
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Проверяем авторизацию при загрузке приложения
onMounted(() => {
  authStore.checkAuth()
})

const isAuthenticated = computed(() => authStore.isAuthenticated)

// Показываем header везде, кроме страницы логина
const showHeader = computed(() => route.path !== '/login')

// Навигационные ссылки
const navigationLinks = computed(() => {
  if (!isAuthenticated.value) return []

  return [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Сканер', path: '/scanner' }
  ]
})

// Обработчик выхода
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style>
/* Глобальные стили */
body {
  @apply bg-gray-900;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
