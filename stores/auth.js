export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null
    }),

    actions: {
        checkAuth() {
            if (process.client) {
                const token = localStorage.getItem('token')
                this.isAuthenticated = !!token

                if (token) {
                    // Здесь можно добавить декодирование JWT если используется
                    this.user = JSON.parse(localStorage.getItem('user') || '{}')
                }
            }
        },

        login(credentials) {
            // Имитация запроса к API
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Фейковые данные для демонстрации
                    const userData = {
                        id: 1,
                        username: credentials.username,
                        token: 'fake-jwt-token'
                    }

                    localStorage.setItem('token', userData.token)
                    localStorage.setItem('user', JSON.stringify(userData))

                    this.isAuthenticated = true
                    this.user = userData

                    resolve(userData)
                }, 500)
            })
        },

        logout() {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            this.isAuthenticated = false
            this.user = null
        }
    }
})
