const COIN_BASE_PRICES = {
    'BTC': 65000,
    'ETH': 3500,
    'BNB': 450,
    'XRP': 0.55,
    'SOL': 0.45,
    'USDT': 1
}

export const useScannerStore = defineStore('scanner', {
    state: () => ({
        opportunities: [],
        filters: {
            sellExchanges: [],
            buyExchanges: [],
            coins: [],
            minVolume: 0,
            maxVolume: 1000000, // Явно указываем числовое значение вместо пустой строки
            minProfit: 0,
            spread: 0,
            maxFee: 100, // Явно указываем числовое значение вместо пустой строки
            updatePeriod: 5
        },
        exchanges: ['Binance', 'ByBit', 'Kraken', 'MEXC'],
        coins: ['USDT', 'BTC', 'ETH', 'BNB', 'XRP', 'SOL'],
        websocket: null,
        loading: false,
        currentPage: 1,
        itemsPerPage: 50
    }),

    getters: {
        filteredOpportunities: (state) => {
            // console.log('Running filter with state:', state.filters);
            return state.opportunities.filter(opp => {
                // Преобразуем строковые значения в числа с дефолтными значениями
                const volume = parseFloat(opp.volume) || 0;
                const minVolume = parseFloat(state.filters.minVolume) || 0;
                const maxVolume = parseFloat(state.filters.maxVolume) || Infinity; // Если пустая строка или невалидное число, берем Infinity
                const maxFee = parseFloat(state.filters.maxFee) || Infinity; // Если пустая строка или невалидное число, берем Infinity
                const minProfit = parseFloat(state.filters.minProfit) || 0;
                const minSpread = parseFloat(state.filters.spread) || 0;

                const matchesSellExchange = state.filters.sellExchanges.length === 0 ||
                    state.filters.sellExchanges.includes(opp.sellExchange);
                const matchesBuyExchange = state.filters.buyExchanges.length === 0 ||
                    state.filters.buyExchanges.includes(opp.buyExchange);
                const matchesCoins = state.filters.coins.length === 0 ||
                    state.filters.coins.includes(opp.coin);
                const matchesVolume = volume >= minVolume && volume <= maxVolume;
                const matchesProfit = opp.profitPercent >= minProfit;
                const matchesSpread = opp.spread >= minSpread;
                const matchesFee = opp.fee <= maxFee;

                // Отладочная информация для первой возможности
                // if (state.opportunities.indexOf(opp) === 0) {
                //     console.log('First opportunity:', {
                //         ...opp,
                //         matches: {
                //             matchesSellExchange,
                //             matchesBuyExchange,
                //             matchesCoins,
                //             matchesVolume,
                //             matchesProfit,
                //             matchesSpread,
                //             matchesFee
                //         }
                //     });
                // }

                return matchesSellExchange && matchesBuyExchange && matchesCoins &&
                    matchesVolume && matchesProfit && matchesSpread && matchesFee;
            });
        },

        paginatedOpportunities: (state) => {
            const start = (state.currentPage - 1) * state.itemsPerPage;
            const end = start + state.itemsPerPage;
            return state.filteredOpportunities.slice(start, end);
        },

        totalPages: (state) => {
            return Math.ceil(state.filteredOpportunities.length / state.itemsPerPage);
        }
    },

    actions: {
        async fetchOpportunities() {
            this.loading = true;
            const opportunities = [];
            // Генерируем больше возможностей, так как некоторые могут быть не прибыльными
            for (let i = 0; i < 500; i++) {
                const opp = this.generateOpportunity();
                if (opp) opportunities.push(opp);
                if (opportunities.length >= 300) break;
            }
            // console.log('Generated opportunities:', opportunities.length);
            // console.log('Sample opportunity:', opportunities[0]);
            // console.log('Current store filters:', this.filters);
            this.opportunities = opportunities;
            this.loading = false;
        },

        generateOpportunity() {
            const coin = this.coins[Math.floor(Math.random() * this.coins.length)];
            const buyExchange = this.exchanges[Math.floor(Math.random() * this.exchanges.length)];
            let sellExchange;
            do {
                sellExchange = this.exchanges[Math.floor(Math.random() * this.exchanges.length)];
            } while (sellExchange === buyExchange);

            // Базовая цена монеты + случайное отклонение ±0.5%
            const basePrice = COIN_BASE_PRICES[coin] * (1 + (Math.random() - 0.5) * 0.01);

            // Спред между биржами - увеличиваем для низкостоимостных монет
            let spread;
            if (basePrice < 1) {
                // Для монет стоимостью меньше $1 используем больший спред (1-3%)
                spread = (Math.random() * 2 + 1);
            } else if (basePrice < 100) {
                // Для монет стоимостью $1-$100 используем средний спред (0.5-1.5%)
                spread = (Math.random() * 1 + 0.5);
            } else {
                // Для дорогих монет используем меньший спред (0.1-0.5%)
                spread = (Math.random() * 0.4 + 0.1);
            }

            const buyPrice = basePrice;
            const sellPrice = basePrice * (1 + spread / 100);

            // Генерируем объем в зависимости от стоимости монеты
            let volume;
            if (basePrice < 1) {
                // Для дешевых монет больше объем
                volume = parseFloat((Math.random() * 1000000 + 10000).toFixed(2));
            } else if (basePrice < 100) {
                // Для средних монет средний объем
                volume = parseFloat((Math.random() * 100000 + 1000).toFixed(2));
            } else {
                // Для дорогих монет меньший объем
                volume = parseFloat((Math.random() * 10000 + 100).toFixed(2));
            }

            // Комиссии в процентах от стоимости
            const feePercent = 0.1; // 0.1%

            // Комиссия за перевод в зависимости от стоимости монеты
            const transferFeePercent = 0.05; // 0.05% от стоимости
            const transferFee = basePrice * transferFeePercent / 100;

            // Расчет комиссии в долларах
            const fee = (buyPrice * feePercent / 100) + // комиссия за покупку
                (sellPrice * feePercent / 100) + // комиссия за продажу
                transferFee; // комиссия за перевод

            // Расчет профита
            const profit = sellPrice - buyPrice - fee;
            const profitPercent = (profit / buyPrice) * 100;

            // Делаем проверку на прибыльность менее строгой
            if (profitPercent <= -0.1) { // Позволяем генерировать возможности с очень маленьким убытком
                return null;
            }

            return {
                id: Math.random().toString(36).substr(2, 9),
                coin,
                buyExchange,
                sellExchange,
                buyPrice: parseFloat(buyPrice.toFixed(basePrice < 1 ? 6 : 2)),
                sellPrice: parseFloat(sellPrice.toFixed(basePrice < 1 ? 6 : 2)),
                spread: parseFloat(spread.toFixed(2)),
                volume: volume,
                feePercent: feePercent,
                fee: parseFloat(fee.toFixed(basePrice < 1 ? 6 : 2)),
                profit: parseFloat(profit.toFixed(basePrice < 1 ? 6 : 2)),
                profitPercent: parseFloat(profitPercent.toFixed(2)),
                transferFee: parseFloat(transferFee.toFixed(basePrice < 1 ? 6 : 2)),
            };
        },

        updateFilters(newFilters) {
            console.log('Updating filters in store:', newFilters);
            this.filters = {...this.filters, ...newFilters};
            console.log('Updated store filters:', this.filters);
        },

        initializeWebSocket() {
            if (process.client) {
                console.log('Initializing WebSocket with filters:', this.filters);
                // В реальном приложении здесь будет подключение к WebSocket
                this.websocket = setInterval(() => {
                    const updatedOpportunities = this.opportunities.map(opp => {
                        if (Math.random() > 0.7) { // Обновляем только часть возможностей
                            const priceChange = (Math.random() - 0.5) * 2; // -1% до +1%
                            const newBuyPrice = opp.buyPrice * (1 + priceChange / 100);
                            const newSellPrice = opp.sellPrice * (1 + priceChange / 100);
                            const newSpread = ((newSellPrice - newBuyPrice) / newBuyPrice) * 100;

                            // Пересчитываем комиссию и профит
                            const newFee = (newBuyPrice * opp.feePercent / 100) +
                                (newSellPrice * opp.feePercent / 100) +
                                opp.transferFee;

                            const newProfit = newSellPrice - newBuyPrice - newFee;
                            const newProfitPercent = (newProfit / newBuyPrice) * 100;

                            const updatedOpp = {
                                ...opp,
                                buyPrice: parseFloat(newBuyPrice.toFixed(2)),
                                sellPrice: parseFloat(newSellPrice.toFixed(2)),
                                spread: parseFloat(newSpread.toFixed(2)),
                                fee: parseFloat(newFee.toFixed(2)),
                                profit: parseFloat(newProfit.toFixed(2)),
                                profitPercent: parseFloat(newProfitPercent.toFixed(2)),
                                // Добавляем флаги для отслеживания изменений
                                priceChanged: true,
                                spreadChanged: Math.abs(newSpread - opp.spread) > 0.01,
                                profitChanged: Math.abs(newProfit - opp.profit) > 0.01
                            };
                            
                            // Сбрасываем флаги через секунду
                            setTimeout(() => {
                                updatedOpp.priceChanged = false;
                                updatedOpp.spreadChanged = false;
                                updatedOpp.profitChanged = false;
                            }, 1000);
                            
                            return updatedOpp;
                        }
                        return opp;
                    });

                    // Проверяем, что обновленные данные соответствуют фильтрам
                    this.opportunities = updatedOpportunities;
                    console.log('Updated opportunities. Total:', updatedOpportunities.length, 'Filtered:', this.filteredOpportunities.length);
                }, this.filters.updatePeriod * 1000);
            }
        },

        clearWebSocket() {
            if (this.websocket) {
                clearInterval(this.websocket);
                this.websocket = null;
            }
        },

        setPage(page) {
            this.currentPage = page;
        }
    }
});
