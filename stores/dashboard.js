// stores/dashboard.js
import {defineStore} from 'pinia'

const createHistoricalData = () => {
    // Генерируем даты для последних 3 дней
    const dates = Array.from({length: 3}).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (2 - i))
        return date
    })

    // Предопределенные сделки
    const trades = [
        {
            id: Date.now() - 1000000,
            date: dates[0].toISOString(),
            coin: 'BTC',
            buyExchange: 'Binance',
            sellExchange: 'ByBit',
            buyPrice: 64850.00,
            sellPrice: 65100.00,
            amount: 0.015,
            spread: 0.38,
            fee: 12.50,
            profit: 1.25,
            status: 'Завершено'
        },
        {
            id: Date.now() - 900000,
            date: dates[0].toISOString(),
            coin: 'ETH',
            buyExchange: 'Kraken',
            sellExchange: 'MEXC',
            buyPrice: 3480.00,
            sellPrice: 3495.00,
            amount: 0.12,
            spread: 0.43,
            fee: 5.20,
            profit: 0.80,
            status: 'Завершено'
        },
        {
            id: Date.now() - 800000,
            date: dates[1].toISOString(),
            coin: 'SOL',
            buyExchange: 'ByBit',
            sellExchange: 'Binance',
            buyPrice: 118.50,
            sellPrice: 119.20,
            amount: 2.5,
            spread: 0.59,
            fee: 3.80,
            profit: 0.95,
            status: 'Завершено'
        },
        {
            id: Date.now() - 700000,
            date: dates[1].toISOString(),
            coin: 'BNB',
            buyExchange: 'MEXC',
            sellExchange: 'Kraken',
            buyPrice: 448.20,
            sellPrice: 450.40,
            amount: 0.8,
            spread: 0.49,
            fee: 4.60,
            profit: 1.18,
            status: 'Завершено'
        },
        {
            id: Date.now() - 600000,
            date: dates[1].toISOString(),
            coin: 'XRP',
            buyExchange: 'Binance',
            sellExchange: 'ByBit',
            buyPrice: 0.54777,
            sellPrice: 0.55140,
            amount: 1200,
            spread: 0.66,
            fee: 3.90,
            profit: 0.45,
            status: 'Завершено'
        },
        {
            id: Date.now() - 500000,
            date: dates[2].toISOString(),
            coin: 'BTC',
            buyExchange: 'MEXC',
            sellExchange: 'Kraken',
            buyPrice: 65200.00,
            sellPrice: 65450.00,
            amount: 0.012,
            spread: 0.38,
            fee: 10.20,
            profit: 1.80,
            status: 'Завершено'
        },
        {
            id: Date.now() - 400000,
            date: dates[2].toISOString(),
            coin: 'ETH',
            buyExchange: 'Kraken',
            sellExchange: 'Binance',
            buyPrice: 3490.00,
            sellPrice: 3505.00,
            amount: 0.15,
            spread: 0.43,
            fee: 4.80,
            profit: 1.45,
            status: 'Завершено'
        },
        {
            id: Date.now() - 300000,
            date: dates[2].toISOString(),
            coin: 'SOL',
            buyExchange: 'ByBit',
            sellExchange: 'MEXC',
            buyPrice: 119.80,
            sellPrice: 120.50,
            amount: 3.2,
            spread: 0.58,
            fee: 5.10,
            profit: 1.12,
            status: 'Завершено'
        },
        {
            id: Date.now() - 200000,
            date: dates[2].toISOString(),
            coin: 'BNB',
            buyExchange: 'Binance',
            sellExchange: 'Kraken',
            buyPrice: 449.80,
            sellPrice: 451.90,
            amount: 0.9,
            spread: 0.47,
            fee: 4.90,
            profit: 1.02,
            status: 'Завершено'
        },
        {
            id: Date.now() - 100000,
            date: dates[2].toISOString(),
            coin: 'XRP',
            buyExchange: 'MEXC',
            sellExchange: 'ByBit',
            buyPrice: 0.54890,
            sellPrice: 0.55240,
            amount: 1500,
            spread: 0.64,
            fee: 4.20,
            profit: 1.15,
            status: 'Завершено'
        }
    ]

    // Рассчитываем статистику
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const trades24h = trades.filter(trade => new Date(trade.date) > oneDayAgo)

    const statistics = {
        totalProfit: trades.reduce((sum, trade) => sum + trade.profit, 0),
        profit24h: trades24h.reduce((sum, trade) => sum + trade.profit, 0),
        volume24h: trades24h.reduce((sum, trade) => sum + (trade.amount * trade.buyPrice), 0)
    }

    // Группируем сделки по дням для графика
    const chartData = {
        labels: dates.map(date => date.toLocaleDateString()),
        values: dates.map(date => {
            const dayTrades = trades.filter(trade =>
                new Date(trade.date).toLocaleDateString() === date.toLocaleDateString()
            )
            return dayTrades.reduce((sum, trade) => sum + trade.profit, 0)
        })
    }

    return {
        trades,
        statistics,
        chartData
    }
}


export const useDashboardStore = defineStore('dashboard', {
    state: () => {
        // Получаем исторические данные
        const historical = createHistoricalData()

        return {
            statistics: historical.statistics,
            sessionStartTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            supportedCoins: ['USDT', 'BTC', 'ETH', 'BNB', 'XRP', 'SOL'],
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
            trades: historical.trades,
            chartData: historical.chartData
        }
    },

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
