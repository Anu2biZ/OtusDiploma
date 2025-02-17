// stores/dashboard.js
import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        // Общая статистика
        statistics: {
            totalProfit: 0,
            profit24h: 0,
            volume24h: 0
        },

        // Время начала сессии
        sessionStartTime: new Date().toISOString(),

        // Список поддерживаемых монет
        supportedCoins: ['USDT', 'BTC', 'ETH', 'BNB', 'XRP', 'SOL'],

        // Балансы бирж
        exchanges: [
            {
                name: 'Binance',
                coins: [
                    { symbol: 'USDT', amount: 1000, usdValue: 1000, change: 0 },
                    { symbol: 'BTC', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'ETH', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'BNB', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'XRP', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'SOL', amount: 0, usdValue: 0, change: 0 }
                ]
            },
            {
                name: 'ByBit',
                coins: [
                    { symbol: 'USDT', amount: 1000, usdValue: 1000, change: 0 },
                    { symbol: 'BTC', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'ETH', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'BNB', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'XRP', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'SOL', amount: 0, usdValue: 0, change: 0 }
                ]
            },
            {
                name: 'Kraken',
                coins: [
                    { symbol: 'USDT', amount: 1000, usdValue: 1000, change: 0 },
                    { symbol: 'BTC', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'ETH', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'BNB', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'XRP', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'SOL', amount: 0, usdValue: 0, change: 0 }
                ]
            },
            {
                name: 'MEXC',
                coins: [
                    { symbol: 'USDT', amount: 1000, usdValue: 1000, change: 0 },
                    { symbol: 'BTC', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'ETH', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'BNB', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'XRP', amount: 0, usdValue: 0, change: 0 },
                    { symbol: 'SOL', amount: 0, usdValue: 0, change: 0 }
                ]
            }
        ],

        // История сделок
        trades: [],

        // Данные для графика (profit по дням)
        chartData: {
            labels: [], // Даты
            values: []  // Значения профита
        }
    }),

    getters: {
        // Получение баланса конкретной биржи
        getExchangeBalance: (state) => (exchangeName) => {
            const exchange = state.exchanges.find(e => e.name === exchangeName)
            if (!exchange) return 0
            return exchange.coins.reduce((total, coin) => total + coin.usdValue, 0)
        },

        // Общий баланс по всем биржам
        totalBalance: (state) => {
            return state.exchanges.reduce((total, exchange) => {
                return total + exchange.coins.reduce((sum, coin) => sum + coin.usdValue, 0)
            }, 0)
        },

        // Получение истории сделок за последние 24 часа
        trades24h: (state) => {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
            return state.trades.filter(trade => new Date(trade.date) > oneDayAgo)
        }
    },

    actions: {
        // Обновление статистики
        updateStatistics() {
            const trades24h = this.trades24h
            this.statistics.profit24h = trades24h.reduce((sum, trade) => sum + trade.profit, 0)
            this.statistics.volume24h = trades24h.reduce((sum, trade) => sum + (trade.amount * trade.buyPrice), 0)
            this.statistics.totalProfit = this.trades.reduce((sum, trade) => sum + trade.profit, 0)
        },

        // Добавление новой сделки
        addTrade(trade) {
            // Округляем значения до 8 знаков для криптовалют и до 2 знаков для USD
            const roundToDecimals = (value, decimals) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

            // Определяем количество знаков после запятой в зависимости от цены
            const decimals = trade.buyPrice < 1 ? 8 : 2;

            const roundedTrade = {
                id: Date.now(),
                date: new Date().toISOString(),
                ...trade,
                buyPrice: roundToDecimals(trade.buyPrice, decimals),
                sellPrice: roundToDecimals(trade.sellPrice, decimals),
                amount: roundToDecimals(trade.amount, decimals),
                fee: roundToDecimals(trade.fee, 2), // Комиссия всегда в USD, округляем до 2 знаков
                profit: roundToDecimals(trade.profit, 2) // Профит всегда в USD, округляем до 2 знаков
            }

            this.trades.unshift(roundedTrade)
            this.updateStatistics()
            this.updateChartData()
            this.updateExchangeBalances(roundedTrade)
        },

        // Обновление балансов бирж после сделки
        updateExchangeBalances(trade) {
            // Находим биржи
            const buyExchange = this.exchanges.find(e => e.name === trade.buyExchange)
            const sellExchange = this.exchanges.find(e => e.name === trade.sellExchange)

            if (!buyExchange || !sellExchange) return

            // Сохраняем изначальные балансы для расчета изменений
            const initialBuyExchangeBalance = this.getExchangeBalance(trade.buyExchange)
            const initialSellExchangeBalance = this.getExchangeBalance(trade.sellExchange)

            // 1. На бирже покупки:
            // - Уменьшаем USDT на сумму покупки
            const buyUSDT = buyExchange.coins.find(c => c.symbol === 'USDT')
            if (buyUSDT) {
                buyUSDT.amount -= (trade.amount * trade.buyPrice)
                buyUSDT.usdValue = buyUSDT.amount
            }

            // 2. На бирже продажи:
            // - Увеличиваем USDT на сумму продажи
            const sellUSDT = sellExchange.coins.find(c => c.symbol === 'USDT')
            if (sellUSDT) {
                sellUSDT.amount += (trade.amount * trade.sellPrice)
                sellUSDT.usdValue = sellUSDT.amount
            }

            // Обновляем процент изменения для обеих бирж
            const newBuyExchangeBalance = this.getExchangeBalance(trade.buyExchange)
            const newSellExchangeBalance = this.getExchangeBalance(trade.sellExchange)

            // Обновляем изменения для всех монет на бирже покупки
            buyExchange.coins.forEach(coin => {
                if (coin.symbol === 'USDT') {
                    coin.change = ((coin.usdValue - 1000) / 1000 * 100).toFixed(2)
                } else {
                    coin.amount = 0
                    coin.usdValue = 0
                    coin.change = 0
                }
            })

            // Обновляем изменения для всех монет на бирже продажи
            sellExchange.coins.forEach(coin => {
                if (coin.symbol === 'USDT') {
                    coin.change = ((coin.usdValue - 1000) / 1000 * 100).toFixed(2)
                } else {
                    coin.amount = 0
                    coin.usdValue = 0
                    coin.change = 0
                }
            })
        },

        // Обновление данных графика
        updateChartData() {
            // Группируем сделки по дням
            const dailyProfits = this.trades.reduce((acc, trade) => {
                const date = new Date(trade.date).toLocaleDateString()
                acc[date] = (acc[date] || 0) + trade.profit
                return acc
            }, {})

            this.chartData.labels = Object.keys(dailyProfits)
            this.chartData.values = Object.values(dailyProfits)
        },

        // Сброс сессии
        resetSession() {
            this.sessionStartTime = new Date().toISOString()
            this.statistics = {
                totalProfit: 0,
                profit24h: 0,
                volume24h: 0
            }
            this.trades = []
            this.chartData = {
                labels: [],
                values: []
            }

            // Сброс балансов бирж (оставляем только USDT)
            this.exchanges.forEach(exchange => {
                exchange.coins.forEach(coin => {
                    if (coin.symbol === 'USDT') {
                        coin.amount = 1000
                        coin.usdValue = 1000
                    } else {
                        coin.amount = 0
                        coin.usdValue = 0
                    }
                    coin.change = 0
                })
            })
        },

    }
})
