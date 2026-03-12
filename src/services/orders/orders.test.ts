import {
    initialOrders,
    createOrder,
    fetchUserOrders,
    fetchOrderByNumber,
    clearTargetOrder,
    selectUserOrders,
    selectOrderByNumber,
    selecTargetOrder,
    selecLoadingOrder,
    ordersSlice
} from './orders'; // импортируем все необходимое из файла со слайсом
import { TOrder } from '@utils-types'; // импортируем тип заказа
import { RootState } from '../store'; // импортируем тип корневого состояния

// Мокаем API функции, чтобы не отправлять реальные запросы
jest.mock('@api', () => ({
    orderBurgerApi: jest.fn(), // мокаем функцию создания заказа
    getOrdersApi: jest.fn(), // мокаем функцию получения заказов пользователя
    getOrderByNumberApi: jest.fn() // мокаем функцию получения заказа по номеру
}));

const testOrders = {
    loading: false,
    error: null,
    listOrder: [{
        _id: '1',
        status: 'status',
        name: 'name1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: ['ing1']
    },
    {
        _id: '2',
        status: 'status',
        name: 'name2',
        createdAt: '',
        updatedAt: '',
        number: 2,
        ingredients: ['ing2']
    }
    ],
    targetOrder: {
        _id: '1',
        status: 'status',
        name: 'name1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: ['ing1']
    },
    selectOrderByNumber: {
        _id: '1',
        status: 'status',
        name: 'name1',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: ['ing1']
    }
};

const ordersReducer = ordersSlice.reducer;

// Импортируем замоканные функции для использования в тестах
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';

// Описываем тесты для ordersSlice
describe('ordersSlice', () => {
    // Сбрасываем все моки перед каждым тестом
    beforeEach(() => {
        jest.clearAllMocks(); // очищаем все вызовы моков
    });

    // Тестируем начальное состояние
    test('ordersSlice', () => {
        // Вызываем редьюсер с undefined и пустым действием
        expect(ordersReducer(undefined, { type: '' })).toEqual(initialOrders); // проверяем, что вернулось начальное состояние
    });

    // Тестируем синхронное действие clearTargetOrder
    test('очистка targetOrder', () => {
        // Создаем состояние с заполненным targetOrder
        const previousState = {
            ...initialOrders,
            targetOrder: {...testOrders.targetOrder, _id: '1' } as TOrder // добавляем тестовый заказ
        };

        // Применяем действие clearTargetOrder к предыдущему состоянию
        expect(ordersReducer(previousState, clearTargetOrder())).toEqual({
            ...initialOrders, // ожидаем, что targetOrder стал null
            targetOrder: null
        });
    });

    // Тестируем асинхронное действие createOrder (pending состояние)
    test('createOrder.pending', () => {
        // Создаем предыдущее состояние с ошибкой
        const previousState = {
            ...initialOrders,
            error: 'some error', // устанавливаем тестовую ошибку
            loading: false // loading = false
        };

        // Создаем действие pending для createOrder
        const action = { type: createOrder.pending.type };
        // Применяем действие к предыдущему состоянию
        const state = ordersReducer(previousState, action);

        // Проверяем, что состояние обновилось корректно
        expect(state.loading).toEqual(true)
        expect(state.error).toEqual(null)

    });

    // Тестируем успешное выполнение createOrder (fulfilled состояние)
    test('createOrder.fulfilled', () => {
        // Создаем предыдущее состояние с загрузкой
        const previousState = {
            ...initialOrders,
            loading: true // устанавливаем loading = true
        };

        // Создаем действие fulfilled с полезной нагрузкой
        const action = {
            type: createOrder.fulfilled.type,
            payload: { order: testOrders.targetOrder } // передаем тестовый заказ
        };

        // Применяем действие к предыдущему состоянию
        const state = ordersReducer(previousState, action);

        // Проверяем, что состояние обновилось корректно
        expect(state.loading).toEqual(false)
        expect(state.targetOrder).toEqual(testOrders.targetOrder)
    });

    // Тестируем ошибку createOrder (rejected состояние)
    test('createOrder.rejected', () => {
        // Создаем предыдущее состояние с загрузкой
        const previousState = {
            ...initialOrders,
            loading: true // устанавливаем loading = true
        };

        // Создаем действие rejected с ошибкой
        const action = {
            type: createOrder.rejected.type,
            error: { message: 'Error message' } // передаем сообщение об ошибке
        };

        // Применяем действие к предыдущему состоянию
        const state = ordersReducer(previousState, action);

        // Проверяем, что состояние обновилось корректно
        expect(state.loading).toEqual(false)
        expect(state.error).toEqual('failed')
    });

    // Тестируем успешное выполнение fetchUserOrders (fulfilled состояние)
    test('fetchUserOrders.fulfilled', () => {
        // Создаем предыдущее состояние с загрузкой
        const previousState = {
            ...initialOrders,
            loading: true // устанавливаем loading = true
        };

        // Создаем действие fulfilled с массивом заказов
        const action = {
            type: fetchUserOrders.fulfilled.type,
            payload: testOrders.listOrder // передаем тестовые заказы
        };

        // Применяем действие к предыдущему состоянию
        const state = ordersReducer(previousState, action);

        // Проверяем, что состояние обновилось корректно
        expect(state.loading).toEqual(false)
        expect(state.listOrder).toEqual(testOrders.listOrder)
    });

    // Тестируем успешное выполнение fetchOrderByNumber (fulfilled состояние)
    test('fetchOrderByNumber.fulfilled', () => {
        // Создаем предыдущее состояние с загрузкой
        const previousState = {
            ...initialOrders,
            loading: true // устанавливаем loading = true
        };

        // Создаем действие fulfilled с объектом, содержащим массив заказов
        const action = {
            type: fetchOrderByNumber.fulfilled.type,
            payload: { orders: testOrders.listOrder } // API возвращает объект с полем orders
        };

        // Применяем действие к предыдущему состоянию
        const state = ordersReducer(previousState, action);

        // Проверяем, что состояние обновилось корректно
        expect(state.loading).toEqual(false)
        expect(state.selectOrderByNumber).toEqual(testOrders.selectOrderByNumber)

    });

    // Тестируем селекторы
    describe('selectors', () => {
        // Создаем тестовое состояние для проверки селекторов
        const mockState = {
            orders: {
                ...initialOrders,
                listOrder: [{ _id: '1' }] as TOrder[], // устанавливаем тестовый listOrder
                selectOrderByNumber: { _id: '2' } as TOrder, // устанавливаем тестовый selectOrderByNumber
                targetOrder: { _id: '3' } as TOrder, // устанавливаем тестовый targetOrder
                loading: true // устанавливаем loading = true
            }
        } as RootState; // приводим к типу RootState

        // Тестируем селектор selectUserOrders
        test(' селектор selectUserOrders', () => {
            // Проверяем, что селектор возвращает правильное значение
            expect(selectUserOrders(mockState)).toEqual([{ _id: '1' }]);
        });

        // Тестируем селектор selectOrderByNumber
        test('селектор selectOrderByNumber', () => {
            // Проверяем, что селектор возвращает правильное значение
            expect(selectOrderByNumber(mockState)).toEqual({ _id: '2' });
        });

        // Тестируем селектор selecTargetOrder
        test('селектор selecTargetOrder', () => {
            // Проверяем, что селектор возвращает правильное значение
            expect(selecTargetOrder(mockState)).toEqual({ _id: '3' });
        });

        // Тестируем селектор selecLoadingOrder
        test('селектор selecLoadingOrder', () => {
            // Проверяем, что селектор возвращает правильное значение
            expect(selecLoadingOrder(mockState)).toBe(true);
        });
    });

    // Тестируем полный цикл работы с API
    describe('async thunks', () => {
        // Тестируем успешное выполнение createOrder
        test('успешное выполнение createOrder', async () => {
            // Создаем тестовый заказ
            const mockOrder = { _id: '123', number: 1 } as TOrder;
            // Настраиваем мок API на успешный ответ
            (orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });

            // Диспатчим createOrder и получаем результат
            const dispatch = jest.fn(); // создаем мок dispatch
            const thunk = createOrder(['ingredient1']); // создаем thunk с тестовыми ингредиентами
            await thunk(dispatch, () => ({}), undefined); // выполняем thunk

            // Получаем все вызовы dispatch
            const calls = dispatch.mock.calls;

            // Проверяем, что первый вызов был с pending действием
            expect(calls[0][0].type).toBe(createOrder.pending.type);
            // Проверяем, что последний вызов был с fulfilled действием и правильным payload
            expect(calls[calls.length - 1][0].type).toBe(createOrder.fulfilled.type);
            expect(calls[calls.length - 1][0].payload).toEqual({ order: mockOrder });
        });

        // Тестируем успешное выполнение fetchUserOrders
        test('успешное выполнение fetchUserOrders', async () => {
            // Создаем массив тестовых заказов
            const mockOrders = [{ _id: '1' }, { _id: '2' }] as TOrder[];
            // Настраиваем мок API на успешный ответ
            (getOrdersApi as jest.Mock).mockResolvedValue(mockOrders);

            // Диспатчим fetchUserOrders и получаем результат
            const dispatch = jest.fn(); // создаем мок dispatch
            const thunk = fetchUserOrders(); // создаем thunk
            await thunk(dispatch, () => ({}), undefined); // выполняем thunk

            // Получаем все вызовы dispatch
            const calls = dispatch.mock.calls;

            // Проверяем, что первый вызов был с pending действием
            expect(calls[0][0].type).toBe(fetchUserOrders.pending.type);
            // Проверяем, что последний вызов был с fulfilled действием и правильным payload
            expect(calls[calls.length - 1][0].type).toBe(fetchUserOrders.fulfilled.type);
            expect(calls[calls.length - 1][0].payload).toEqual(mockOrders);
        });

        // Тестируем успешное выполнение fetchOrderByNumber
        test('успешное выполнение fetchOrderByNumber', async () => {
            // Создаем тестовый заказ
            const mockOrder = { _id: '123', number: 123 } as TOrder;
            // Настраиваем мок API на успешный ответ
            (getOrderByNumberApi as jest.Mock).mockResolvedValue({ orders: [mockOrder] });

            // Диспатчим fetchOrderByNumber и получаем результат
            const dispatch = jest.fn(); // создаем мок dispatch
            const thunk = fetchOrderByNumber(123); // создаем thunk с тестовым номером заказа
            await thunk(dispatch, () => ({}), undefined); // выполняем thunk

            // Получаем все вызовы dispatch
            const calls = dispatch.mock.calls;

            // Проверяем, что первый вызов был с pending действием
            expect(calls[0][0].type).toBe(fetchOrderByNumber.pending.type);
            // Проверяем, что последний вызов был с fulfilled действием и правильным payload
            expect(calls[calls.length - 1][0].type).toBe(fetchOrderByNumber.fulfilled.type);
            expect(calls[calls.length - 1][0].payload).toEqual({ orders: [mockOrder] });
        });
    });
});