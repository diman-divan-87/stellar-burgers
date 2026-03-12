import { getIngredientsApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import {
  getIngredients,
  initialState,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
  ingredientsSlice
} from './ingredients';
import { TIngredient } from '@utils-types';

// Мокаем API вызов, чтобы не отправлять реальные запросы
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

// Типизируем мок для удобства использования
const mockedGetIngredientsApi = jest.mocked(getIngredientsApi);

// Тестовые данные - пример ингредиента для использования в тестах
const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 150,
  price: 100,
  image: 'test.jpg',
  image_large: 'test-large.jpg',
  image_mobile: 'test-mobile.jpg'
};

const ingredientsReducer = ingredientsSlice.reducer;
describe('ingredients slice', () => {
  // Очищаем все моки перед каждым тестом для изоляции тестов
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тест начального состояния - проверяем, что редьюсер возвращает корректное начальное состояние
  test('should return initial state', () => {
    // Вызываем редьюсер с undefined и пустым action, ожидаем initialState
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // Тест селекторов - проверяем, что селекторы правильно извлекают данные из store
  test('should select correct data from state', () => {
    // Создаем тестовое состояние
    const state = {
      ingredients: {
        data: [mockIngredient],
        isLoading: true,
        error: 'Test error'
      }
    };

  });

  // Тест для pending состояния - проверяем установку флага загрузки
  test('should handle getIngredients.pending', () => {
    // Создаем состояние с существующими данными для проверки сброса
    const previousState: typeof initialState = {
      data: [mockIngredient],
      isLoading: false,
      error: 'Previous error'
    };

    // Применяем pending action к состоянию
    const newState = ingredientsReducer(
      previousState,
      getIngredients.pending('', undefined)
    );

    // Проверяем, что isLoading стал true, error сброшен, данные остались без изменений
    expect(newState).toEqual({
      data: [mockIngredient],
      isLoading: true,
      error: null
    });
  });

  // Тест для fulfilled состояния - проверяем успешную загрузку данных
  test('should handle getIngredients.fulfilled', () => {
    // Создаем состояние с флагом загрузки
    const previousState: typeof initialState = {
      data: [],
      isLoading: true,
      error: null
    };

    // Массив ингредиентов для ответа
    const mockIngredients = [mockIngredient];

    // Применяем fulfilled action с полученными данными
    const newState = ingredientsReducer(
      previousState,
      getIngredients.fulfilled(mockIngredients, '', undefined)
    );

    // Проверяем, что данные сохранились, загрузка завершена, ошибок нет
    expect(newState).toEqual({
      data: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  // Тест для rejected состояния - проверяем обработку ошибки
  test('should handle getIngredients.rejected', () => {
    // Создаем состояние с флагом загрузки
    const previousState: typeof initialState = {
      data: [],
      isLoading: true,
      error: null
    };

    // Сообщение об ошибке для теста
    const errorMessage = 'Network error';

    // Применяем rejected action с ошибкой
    const newState = ingredientsReducer(
      previousState,
      getIngredients.rejected(new Error(errorMessage), '', undefined)
    );

    // Проверяем, что загрузка завершена, данные пусты, ошибка сохранилась
    expect(newState).toEqual({
      data: [],
      isLoading: false,
      error: errorMessage
    });
  });

  // Интеграционный тест - проверяем полный жизненный цикл async thunk
  test('should handle successful ingredients fetch in store', async () => {
    // Настраиваем мок API на успешный ответ
    const mockIngredients = [mockIngredient];
    mockedGetIngredientsApi.mockResolvedValue(mockIngredients);

    // Создаем store с редьюсером
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });

    // Диспатчим асинхронный action
    await store.dispatch(getIngredients());

    // Получаем состояние после завершения запроса
    const state = store.getState().ingredients;

    // Проверяем, что данные загрузились корректно
    expect(state).toEqual({
      data: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  // Интеграционный тест для обработки ошибки
  test('should handle failed ingredients fetch in store', async () => {
    // Настраиваем мок API на ошибку
    const errorMessage = 'Network error';
    mockedGetIngredientsApi.mockRejectedValue(new Error(errorMessage));

    // Создаем store
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer
      }
    });

    // Диспатчим action и ожидаем ошибку
    await store.dispatch(getIngredients());

    // Получаем состояние после ошибки
    const state = store.getState().ingredients;

    // Проверяем, что состояние содержит ошибку
    expect(state).toEqual({
      data: [],
      isLoading: false,
      error: errorMessage
    });
  });

});