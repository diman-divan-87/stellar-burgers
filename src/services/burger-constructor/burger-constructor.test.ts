import {
    addIngredient,
    addBun,
    addAllingredientsArr,
    moveIngredient,
    clearBurgerConstructor,
    burgerConstructorSlice,
    getIngredients,
    getBun,
    initialConstructor,
    BurgerConstructorState
} from './burger-constructor'; // Импортируем тестируемый модуль
import { TConstructorIngredient, TIngredient } from '@utils-types'; // Импортируем типы

// Мокаем uuid v4, чтобы каждый раз получать предсказуемый id
jest.mock('uuid', () => ({
    v4: () => 'test-id-123' // Всегда возвращаем один и тот же id для тестов
}));

const testBurgerConstructor: BurgerConstructorState = {
    ingredientsArr: [
        {
            id: '1',
            _id: '1',
            name: 'Name',
            type: 'main',
            proteins: 1,
            fat: 1,
            carbohydrates: 1,
            calories: 1,
            price: 1,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile'
        },
        {
            id: '2',
            _id: '2',
            name: 'Name2',
            type: 'main',
            proteins: 2,
            fat: 2,
            carbohydrates: 2,
            calories: 2,
            price: 2,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile'
        },
        {
            id: '3',
            _id: '3',
            name: 'Name3',
            type: 'main',
            proteins: 3,
            fat: 3,
            carbohydrates: 3,
            calories: 3,
            price: 3,
            image: 'image',
            image_large: 'image_large',
            image_mobile: 'image_mobile'
        }
    ],
    bun: {
        id: '4',
        _id: '4',
        name: 'bun',
        type: 'main',
        proteins: 4,
        fat: 4,
        carbohydrates: 4,
        calories: 4,
        price: 4,
        image: 'image',
        image_large: 'image_large',
        image_mobile: 'image_mobile'
    }
};

const mockRootState = testBurgerConstructor as any;

const burgerConstructorReducer = burgerConstructorSlice.reducer;

describe('burgerConstructorSlice', () => {

    //Проверяем начальное состояние
    test('должен вернуть исходное состояние', () => {
        const next = burgerConstructorReducer(undefined, { type: 'TEST' });
        expect(next).toEqual(initialConstructor);
    });

    // Тест 2: Проверяем добавление ингредиента через prepare
    test('должен добавить ингредиент с уникальным id', () => {
        // Создаем action с помощью prepare
        const action = addIngredient(testBurgerConstructor.ingredientsArr[0]);
        // Проверяем, что prepare добавил id
        expect(action.payload).toEqual({...testBurgerConstructor.ingredientsArr[0], "id": "test-id-123"});

        // Применяем редьюсер
        const state = burgerConstructorReducer(initialConstructor, action);
        // Проверяем, что ингредиент добавился в массив
        expect(state.ingredientsArr).toHaveLength(1);
        expect(state.ingredientsArr[0]).toEqual({ ...testBurgerConstructor.ingredientsArr[0], "id": "test-id-123"});
        // Проверяем, что булка осталась без изменений
        expect(state.bun).toBeNull();
    });

    // Тест 3: Проверяем добавление булки
    test('должен добавить булку', () => {
        // Создаем action для добавления булки
        const action = addBun(testBurgerConstructor.bun as TConstructorIngredient);
        // Применяем редьюсер
        const state = burgerConstructorReducer(initialConstructor, action);
        // Проверяем, что булка установлена
        expect(state.bun).toEqual(testBurgerConstructor.bun);
        // Проверяем, что массив ингредиентов остался пустым
        expect(state.ingredientsArr).toHaveLength(0);
    });

    // Тест 4: Проверяем замену существующей булки
    test('должен заменить существующую булку на новую', () => {
        // Создаем состояние с существующей булкой
        const initialState = {
            ...initialConstructor,
            bun: testBurgerConstructor.bun
        };

        const newBun = { ...testBurgerConstructor.bun, _id: 'new-bun-id', id: 'new-bun-id', name: 'Новая булка' };
        const action = addBun(newBun as TConstructorIngredient);
        const state = burgerConstructorReducer(initialState, action);
        // Проверяем, что булка заменилась
        expect(state.bun).toEqual(newBun);
        expect(state.bun?.name).toBe('Новая булка');
    });

    // Тест 5: Проверяем добавление нескольких ингредиентов в массив
    test('должен добавить все ингредиенты в массив', () => {
        // Создаем массив ингредиентов для добавления
        const ingredientsArray = testBurgerConstructor.ingredientsArr;
        const action = addAllingredientsArr(ingredientsArray);
        const state = burgerConstructorReducer(initialConstructor, action);
        // Проверяем, что массив содержит все добавленные ингредиенты
        expect(state.ingredientsArr).toHaveLength(3);
        expect(state.ingredientsArr).toEqual(ingredientsArray);
    });

    // Тест 6: Проверяем перемещение ингредиента
    test('должен переместить ингредиент с позиции from на позицию to', () => {
        // Подготавливаем начальное состояние с тремя ингредиентами
        const initialState = {
            ...initialConstructor,
            ingredientsArr: testBurgerConstructor.ingredientsArr
        };

        // Перемещаем элемент с позиции 1 на позицию 0
        const action = moveIngredient({ from: 1, to: 0 });
        const state = burgerConstructorReducer(initialState, action);

        // Проверяем, что ингредиенты переставились правильно
        expect(state.ingredientsArr[0]).toEqual(testBurgerConstructor.ingredientsArr[1]);
        expect(state.ingredientsArr[1]).toEqual(testBurgerConstructor.ingredientsArr[0]);
        expect(state.ingredientsArr).toHaveLength(3);
    });

    // Тест 7: Проверяем очистку конструктора
    test('должен очистить массив ингредиентов и булку', () => {
        // Создаем состояние с заполненными данными
        const filledState = testBurgerConstructor;
        const action = clearBurgerConstructor();
        const state = burgerConstructorReducer(filledState, action);

        // Проверяем, что состояние очистилось
        expect(state.ingredientsArr).toHaveLength(0);
        expect(state.bun).toBeNull();
    });

    // // Тест 8: Проверяем селектор для получения ингредиентов
    // test('селектор getIngredients должен возвращать массив ингредиентов', () => {
    //     // Создаем мок корневого состояния
    //     const ingredients = getIngredients(mockRootState as any);
    //     expect(ingredients).toHaveLength(3);
    //     expect(ingredients).toEqual(testBurgerConstructor.ingredientsArr);
    // });

    // // Тест 9: Проверяем селектор для получения булки
    // test('селектор getBun должен возвращать булку', () => {
    //     const bun = getBun(mockRootState as any);
    //     expect(bun).toEqual(testBurgerConstructor.bun);
    // });

    // Тест 10: Проверяем добавление ингредиента к существующим
    test('должен добавить ингредиент к существующему массиву', () => {
        // Начальное состояние с одним ингредиентом
        const initialState = {
            ...initialConstructor,
            ingredientsArr: [testBurgerConstructor.ingredientsArr[0]]
        };
        let job = { ...testBurgerConstructor.ingredientsArr[1], id: 'test-id-123'}
        const action = addIngredient(job);
        const state = burgerConstructorReducer(initialState, action);

        // Проверяем, что добавился второй ингредиент
        expect(state.ingredientsArr).toHaveLength(2);
        expect(state.ingredientsArr[1]).toEqual(job);
    });
});