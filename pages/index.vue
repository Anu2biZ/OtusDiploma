<!-- pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-900 text-white flex items-center justify-center">
    <div class="max-w-2xl mx-auto text-center p-8">
      <h1 class="text-4xl font-bold mb-6 text-blue-400">
        Межбиржевой Арбитраж
      </h1>
      <p class="text-gray-300 mb-8 text-lg">
        Автоматизированная система поиска арбитражных возможностей между криптовалютными биржами
      </p>
      <NuxtLink
          :to="authStore.isAuthenticated ? '/dashboard' : '/login'"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
      >
        Перейти в Dashboard
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
</script>
