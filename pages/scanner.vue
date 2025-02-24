<template>
  <notifications position="top center" :duration="3000" />
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-blue-400">Межбиржевой сканер</h1>

      <!-- Filters Card -->
      <div class="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
        <h2 class="text-xl font-semibold mb-6 text-blue-400">Фильтры</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Exchange & Coin Filters -->
          <div class="space-y-6">
            <!-- Sell Exchanges -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Где продавать
              </label>
              <Multiselect
                  v-model="filters.sellExchanges"
                  :options="exchanges"
                  :classes="{

                  }"
                  :multiple="true"
                  mode="tags"
                  placeholder="Выберите биржи"
                  class="multiselect-dark"
                  track-by="value"
                  label="name"
                  :searchable="true"
                  :createTag="false"
                  :clear-on-select="false"
                  :close-on-select="false"
              />
            </div>

            <!-- Buy Exchanges -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Где покупать
              </label>
              <Multiselect
                  v-model="filters.buyExchanges"
                  :options="exchanges"
                  :multiple="true"
                  placeholder="Выберите биржи"
                  class="multiselect-dark"
                  track-by="name"
                  label="name"
                  mode="tags"
                  :searchable="true"
                  :createTag="false"
                  :clear-on-select="false"
                  :close-on-select="false"
              />
            </div>

            <!-- Coins -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Монеты
              </label>
              <Multiselect
                  v-model="filters.coins"
                  :options="coins"
                  :multiple="true"
                  placeholder="Выберите монеты"
                  class="multiselect-dark"
                  track-by="value"
                  label="name"
                  mode="tags"
                  :searchable="true"
                  :createTag="false"
                  :clear-on-select="false"
                  :close-on-select="false"
              />
            </div>
          </div>

          <!-- Volume and Profit Filters -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Минимальный объем
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model="filters.minVolume"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                >
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Максимальный объем
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model="filters.maxVolume"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="1000000"
                >
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Минимальная прибыль
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model="filters.minProfit"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                >
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          </div>

          <!-- Additional Filters -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Спред
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model="filters.spread"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="0"
                >
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Макс. комиссия
              </label>
              <div class="relative">
                <input
                    type="number"
                    v-model="filters.maxFee"
                    class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="100"
                >
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Период обновления
              </label>
              <select
                  v-model="filters.updatePeriod"
                  class="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="5">5 секунд</option>
                <option value="10">10 секунд</option>
                <option value="30">30 секунд</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Opportunities Table -->
      <div class="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-700">
            <thead class="bg-gray-700">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Монета</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Цена покупки
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Биржа покупки
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Цена продажи
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Биржа продажи
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Спред (%)</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Объем</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Комиссия ($)
              </th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Профит ($)</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Действия</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
            <tr v-for="opportunity in paginatedOpportunities"
                :key="opportunity.id"
                class="hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-gray-200">
                {{ opportunity.coin }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-200"
                  :class="{ 'value-changed': opportunity.priceChanged }">
                ${{ opportunity.buyPrice.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-200">
                {{ opportunity.buyExchange }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-200"
                  :class="{ 'value-changed': opportunity.priceChanged }">
                ${{ opportunity.sellPrice.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-200">
                {{ opportunity.sellExchange }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-green-400"
                  :class="{ 'value-changed': opportunity.spreadChanged }">
                {{ opportunity.spread.toFixed(2) }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-200">
                ${{ opportunity.volume.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-red-400">
                ${{ opportunity.fee.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap"
                  :class="[
                    opportunity.profit > 0 ? 'text-green-400' : 'text-red-400',
                    { 'value-changed': opportunity.profitChanged }
                  ]"
              >
                ${{ opportunity.profit.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <input
                      type="number"
                      v-model="opportunity.amount"
                      placeholder="Кол-во"
                      class="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                  <button
                      @click="executeTrade(opportunity)"
                      class="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Старт
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-center pb-6">
          <nav class="flex items-center space-x-1">
            <button
                v-for="page in totalPages"
                :key="page"
                @click="setPage(page)"
                :class="[
                                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                                currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700'
                            ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useScannerStore } from '~/stores/scanner'
import { useDashboardStore } from '~/stores/dashboard'
import {Notifications, useNotification} from '@kyvg/vue3-notification'
import Multiselect from '@vueform/multiselect'

// Стили для Multiselect
import '@vueform/multiselect/themes/default.css'

const scannerStore = useScannerStore()
const dashboardStore = useDashboardStore()
const { notify } = useNotification()

// Инициализируем фильтры с пустыми значениями
const filters = ref({
  sellExchanges: [],
  buyExchanges: [],
  coins: [],
  minVolume: 0,
  maxVolume: '',
  minProfit: 0,
  spread: 0,
  maxFee: '',
  updatePeriod: 5 // TODO: Update period, чето не работает щас
})

// Состояние и геттеры
const exchanges = computed(() => scannerStore.exchanges.map(exchange => ({
  name: exchange,
  value: exchange
})))

const coins = computed(() => scannerStore.coins.map(coin => ({
  name: coin,
  value: coin
})))

const paginatedOpportunities = computed(() => {
  return scannerStore.paginatedOpportunities
})

const currentPage = computed(() => scannerStore.currentPage)
const totalPages = computed(() => scannerStore.totalPages)

// Методы
const setPage = (page) => {
  scannerStore.setPage(page)
}

const executeTrade = async (opportunity) => {
  try {
    // Проверяем что количество введено
    if (!opportunity.amount || opportunity.amount <= 0) {
      notify({
        title: 'Ошибка!',
        text: 'Введите корректное количество',
        type: 'error',
        duration: 3000
      });
      return;
    }

    // Находим биржу покупки и проверяем баланс USDT
    const buyExchange = dashboardStore.exchanges.find(e => e.name === opportunity.buyExchange)
    if (!buyExchange) {
      notify({
        title: 'Ошибка!',
        text: 'Биржа покупки не найдена',
        type: 'error',
        duration: 3000
      });
      return;
    }

    const buyUSDTBalance = buyExchange.coins.find(c => c.symbol === 'USDT')
    const requiredUSDT = opportunity.amount * opportunity.buyPrice

    if (!buyUSDTBalance || buyUSDTBalance.amount < requiredUSDT) {
      notify({
        title: 'Ошибка!',
        text: `Недостаточно USDT на бирже ${opportunity.buyExchange}. Требуется: ${requiredUSDT.toFixed(2)} USDT`,
        type: 'error',
        duration: 3000
      });
      return;
    }

    // Сделка объект
    const trade = {
      coin: opportunity.coin,
      buyExchange: opportunity.buyExchange,
      sellExchange: opportunity.sellExchange,
      buyPrice: opportunity.buyPrice,
      sellPrice: opportunity.sellPrice,
      amount: opportunity.amount,
      spread: opportunity.spread,
      fee: opportunity.fee,
      profit: (opportunity.sellPrice - opportunity.buyPrice) * opportunity.amount - opportunity.fee,
      status: 'Завершено'
    }

    console.log('Executing trade:', trade);

    // Добавляем сделку в дашборд
    dashboardStore.addTrade(trade)

    // Удаляем возможность из сканера
    const newOpportunities = scannerStore.opportunities.filter(
        opp => opp.id !== opportunity.id
    );
    scannerStore.opportunities = newOpportunities;

    notify({
      title: 'Успех!',
      text: `Сделка выполнена успешно. Профит: ${trade.profit.toFixed(2)} USDT`,
      type: 'success',
      duration: 3000
    });

  } catch (error) {
    console.error('Trade execution error:', error);
    notify({
      title: 'Ошибка!',
      text: 'Произошла ошибка при выполнении сделки',
      type: 'error',
      duration: 3000
    });
  }
}

onMounted(async () => {
  console.log('Component mounted')
  console.log('Initial filters:', filters.value)
  // Устанавливаем начальные фильтры
  scannerStore.updateFilters(filters.value)
  // Загружаем возможности
  await scannerStore.fetchOpportunities()
  console.log('Opportunities fetched:', scannerStore.opportunities.length)
  console.log('First opportunity:', scannerStore.opportunities[0])
  scannerStore.initializeWebSocket()
})

onUnmounted(() => {
  console.log('Component unmounted')
  scannerStore.clearWebSocket()
})

// Отслеживание изменений
watch(filters, (newFilters) => {
  console.log('Filters changed:', newFilters)
  scannerStore.updateFilters(newFilters)
}, { deep: true })
</script>

<style>
/* Animation for value changes */
@keyframes flash {
  0% {
    background-color: rgba(37, 99, 235, 0); /* blue-600 with 0 opacity */
  }
  50% {
    background-color: rgba(37, 99, 235, 0.3); /* blue-600 with 0.3 opacity */
  }
  100% {
    background-color: rgba(37, 99, 235, 0); /* blue-600 with 0 opacity */
  }
}

.value-changed {
  animation: flash 1s ease;
}

/* Dark theme for Multiselect */
.multiselect-dark {
  --ms-bg: #374151 !important;
  --ms-border-color: #4B5563 !important;
  --ms-dropdown-bg: #1F2937 !important;
  --ms-option-bg-pointed: #2D3748 !important;
  --ms-option-color-pointed: #fff !important;
  --ms-tag-bg: #2563EB !important;
  --ms-tag-color: #fff !important;
  --ms-ring-color: #3B82F6 !important;
  --ms-option-bg-selected: #2563EB !important;
  --ms-option-color-selected: #fff !important;
  --ms-tag-bg-disabled: #4B5563 !important;
  --ms-placeholder-color: #9CA3AF !important;
  --ms-color: #fff !important;
}

.multiselect-dark .multiselect-dropdown {
  border-color: #4B5563 !important;
}

.multiselect-dark .multiselect-option {
  color: #fff !important;
}

.multiselect-dark .multiselect-no-options {
  color: #9CA3AF !important;
}

.multiselect-dark .multiselect-search {
  background-color: #374151 !important;
  color: #fff !important;
}

.multiselect-dark .multiselect-clear {
  color: #9CA3AF !important;
}

.multiselect-dark .multiselect-tag {
  background-color: #2563EB !important;
  color: white !important;
}

.multiselect-dark .multiselect-tags-search {
  background-color: transparent !important;
  color: white !important;
}

.multiselect-wrapper {
  height: 44px;
}
</style>
