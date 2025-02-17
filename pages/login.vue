<!-- pages/login.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center">
    <div class="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Вход в систему</h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-gray-300 mb-2">Логин</label>
          <input
              v-model="credentials.username"
              type="text"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
          />
        </div>

        <div>
          <label class="block text-gray-300 mb-2">Пароль</label>
          <input
              v-model="credentials.password"
              type="password"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
          />
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
        >
          Войти
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'nuxt/app'

const router = useRouter()
const credentials = ref({
  username: '',
  password: ''
})

const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    const success = await authStore.login(credentials.value)
    if (success) {
      router.push('/dashboard')
    } else {
      alert('Ошибка авторизации')
    }
  } catch (error) {
    console.error('Login error:', error)
    alert('Произошла ошибка при попытке входа')
  }
}
</script>
