<!-- pages/dashboard.vue -->
<script>
definePageMeta({
  middleware: ['auth']
})
</script>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
import { useDashboardStore } from '~/stores/dashboard'

// Регистрируем компоненты Chart.js
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale)

const dashboardStore = useDashboardStore()
const profitChart = ref(null)

// Инициализация графика
let chartInstance = null

onMounted(() => {
  const ctx = profitChart.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dashboardStore.chartData.labels.length ? dashboardStore.chartData.labels : ['Нет данных'],
      datasets: [{
        label: 'Профит',
        data: dashboardStore.chartData.values.length ? dashboardStore.chartData.values : [0],
        borderColor: '#34D399',
        tension: 0.4,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#fff'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#9CA3AF'
          },
          grid: {
            color: '#374151'
          }
        },
        x: {
          ticks: {
            color: '#9CA3AF'
          },
          grid: {
            color: '#374151'
          }
        }
      }
    }
  })

  // Обновление графика при изменении данных
  watch(() => [dashboardStore.chartData.labels, dashboardStore.chartData.values], () => {
    chartInstance.data.labels = dashboardStore.chartData.labels.length ? dashboardStore.chartData.labels : ['Нет данных']
    chartInstance.data.datasets[0].data = dashboardStore.chartData.values.length ? dashboardStore.chartData.values : [0]
    chartInstance.update()
  }, { deep: true })


  // Очистка при размонтировании
  onUnmounted(() => {
    if (chartInstance) {
      chartInstance.destroy()
    }
   // clearInterval(priceUpdateInterval)
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Основная статистика -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-gray-400 mb-2">Общий профит</h3>
          <p class="text-2xl font-bold text-green-400">${{ dashboardStore.statistics.totalProfit.toFixed(2) }}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-gray-400 mb-2">Прибыль за 24ч</h3>
          <p class="text-2xl font-bold text-green-400">${{ dashboardStore.statistics.profit24h.toFixed(2) }}</p>
        </div>
        <div class="bg-gray-800 rounded-lg p-6">
          <h3 class="text-gray-400 mb-2">Объем за 24ч</h3>
          <p class="text-2xl font-bold text-blue-400">${{ dashboardStore.statistics.volume24h.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Балансы бирж -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="exchange in dashboardStore.exchanges" :key="exchange.name" class="bg-gray-800 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-white">{{ exchange.name }}</h3>
            <span class="text-sm text-gray-400">Баланс</span>
          </div>

          <!-- Список монет на бирже -->
          <div class="space-y-4">
            <div v-for="coin in exchange.coins" :key="coin.symbol" class="flex justify-between items-center">
              <div>
                <span class="text-white">{{ coin.amount.toFixed(4) }} {{ coin.symbol }}</span>
                <p class="text-sm text-gray-400">${{ coin.usdValue.toFixed(2) }}</p>
              </div>
              <div :class="coin.change >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ coin.change >= 0 ? '+' : '' }}{{ coin.change }}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Информация о сессии -->
      <div class="bg-gray-800 rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-gray-400">Сессия началась:</span>
            <span class="text-white ml-2">{{ new Date(dashboardStore.sessionStartTime).toLocaleString() }}</span>
          </div>
          <button
              @click="dashboardStore.resetSession"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
          >
            Сбросить сессию
          </button>
        </div>
      </div>

      <!-- График -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-xl font-bold text-white mb-4">Динамика профита</h3>
        <div class="h-96">
          <canvas ref="profitChart"></canvas>
        </div>
      </div>

      <!-- История сделок -->
      <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-xl font-bold text-white mb-4">История сделок</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
            <tr class="text-gray-400 text-left">
              <th class="py-3 px-4">Дата</th>
              <th class="py-3 px-4">Монета</th>
              <th class="py-3 px-4">Покупка</th>
              <th class="py-3 px-4">Продажа</th>
              <th class="py-3 px-4">Количество</th>
              <th class="py-3 px-4">Спред</th>
              <th class="py-3 px-4">Комиссия</th>
              <th class="py-3 px-4">Чистый профит</th>
              <th class="py-3 px-4">Статус</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="trade in dashboardStore.trades" :key="trade.id" class="border-t border-gray-700 text-white">
              <td class="py-3 px-4">{{ new Date(trade.date).toLocaleString() }}</td>
              <td class="py-3 px-4">{{ trade.coin }}</td>
              <td class="py-3 px-4">${{ trade.buyPrice }} {{ trade.buyExchange }}</td>
              <td class="py-3 px-4">${{ trade.sellPrice }} {{ trade.sellExchange }}</td>
              <td class="py-3 px-4">{{ trade.amount }}</td>
              <td class="py-3 px-4">{{ trade.spread }}%</td>
              <td class="py-3 px-4">${{ trade.fee }}</td>
              <td class="py-3 px-4" :class="trade.profit >= 0 ? 'text-green-400' : 'text-red-400'">
                ${{ trade.profit }}
              </td>
              <td class="py-3 px-4">
                  <span
                      :class="trade.status === 'Завершено' ? 'bg-green-500' : 'bg-yellow-500'"
                      class="px-2 py-1 rounded text-xs"
                  >
                    {{ trade.status }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
