import {
    initialState,
    getFeeds,
    feedSlice
} from './feeds';

const testFeeds = {

    orders: [
        {
            _id: '1',
            status: 'done',
            name: 'Order 1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            number: 123,
            ingredients: ['ing1', 'ing2']
        },
        {
            _id: '2',
            status: 'pending',
            name: 'Order 2',
            createdAt: '2024-01-02T00:00:00Z',
            updatedAt: '2024-01-02T00:00:00Z',
            number: 124,
            ingredients: ['ing3', 'ing4']
        }
    ],
    total: 100,
    totalToday: 5,
};

// Получение reducer'а из слайса для тестирования
const feedReducer = feedSlice.reducer;

// Тест начального состояния
describe('feedSlice', () => {
    const reducer = feedSlice.reducer;
    test('должен вернуть исходное состояние', () => {
        const next = reducer(undefined, { type: 'TEST' });
        expect(next).toEqual(initialState);
    });
});

// Тесты для экшена getFeeds.pending
describe('getFeeds.pending', () => {
    test('установить isLoading в значение true и очистить ошибку.', () => {
        const action = { type: getFeeds.pending.type };
        const state = feedReducer(initialState, action);

        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });
});

// Тесты для экшена getFeeds.fulfilled
describe('getFeeds.fulfilled', () => {
    test('обновить состояние данными из ленты и установить isLoading в значение false.', () => {
        //обновление данными
        const previousState = {
            ...initialState,
            isLoading: true
        };
        // Создание успешного экшена с тестовыми данными
        const action = {
            type: getFeeds.fulfilled.type,
            payload: testFeeds
        };
        // Применение экшена
        const state = feedReducer(previousState, action);

        expect(state.isLoading).toBe(false);
        expect(state.orders).toEqual(testFeeds.orders);
        expect(state.feed.total).toBe(100);
        expect(state.feed.totalToday).toBe(5);
        expect(state.error).toBeNull();
    });
});

// Тесты для экшена getFeeds.rejected
describe('getFeeds.rejected', () => {
    test('установить значения error и isLoading в false.', () => {
        const errorMessage = 'Network error';
        // Создание экшена с ошибкой
        const action = {
            type: getFeeds.rejected.type,
            error: { message: errorMessage }
        };
        // Предыдущее состояние (загрузка)
        const previousState = {
            ...initialState,
            isLoading: true
        };
        // Применение экшена с ошибкой
        const state = feedReducer(previousState, action);

        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(errorMessage);
        expect(state.orders).toEqual([]);
    });
});