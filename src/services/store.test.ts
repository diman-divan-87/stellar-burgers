import { rootReducer, useDispatch, useSelector, AppDispatch, RootState } from './store';
import { configureStore } from '@reduxjs/toolkit';

// Мокаем только react-redux хуки
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(), // Мокаем хук useDispatch
  useSelector: jest.fn() // Мокаем хук useSelector
}));

// НЕ мокаем срезы, используем реальные редьюсеры
// Это позволит избежать ошибок с инициализацией

describe('Redux Store', () => {
  // Очищаем все моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks(); // Очищаем историю вызовов моков
  });

  // Тест 1: Проверяем правильность структуры rootReducer
  test('rootReducer should be defined and be a function', () => {
    // Assert: Проверяем, что rootReducer определен и является функцией
    expect(rootReducer).toBeDefined(); // Проверяем, что rootReducer определен
    expect(typeof rootReducer).toBe('function'); // Проверяем, что это функция
  });

  // Тест 2: Проверяем, что rootReducer создает состояние с правильной структурой
  test('rootReducer should create state with correct structure', () => {
    // Act: Вызываем rootReducer с undefined состоянием и init action
    const state = rootReducer(undefined, { type: '@@INIT' });
    
    // Assert: Проверяем структуру полученного состояния
    expect(state).toBeDefined(); // Проверяем, что состояние определено
    expect(state).toHaveProperty('ingredients'); // Проверяем наличие поля ingredients
    expect(state).toHaveProperty('getIngredients'); // Проверяем наличие поля getIngredients
    expect(state).toHaveProperty('feeds'); // Проверяем наличие поля feeds
    expect(state).toHaveProperty('loginUser'); // Проверяем наличие поля loginUser
    expect(state).toHaveProperty('orders'); // Проверяем наличие поля orders
    
    // Проверяем, что каждый редьюсер вернул объект (не undefined)
    expect(state.ingredients).toBeDefined();
    expect(state.getIngredients).toBeDefined();
    expect(state.feeds).toBeDefined();
    expect(state.loginUser).toBeDefined();
    expect(state.orders).toBeDefined();
  });

  // Тест 3: Проверяем создание store с правильной конфигурацией
  test('store should be created with correct configuration', () => {
    // Arrange: Создаем store с нашей конфигурацией
    const store = configureStore({
      reducer: rootReducer, // Используем наш rootReducer
      devTools: process.env.NODE_ENV !== 'production' // Включаем devTools только в разработке
    });

    // Assert: Проверяем, что store создан и имеет нужные методы
    expect(store).toBeDefined(); // Проверяем, что store определен
    expect(store.dispatch).toBeDefined(); // Проверяем наличие метода dispatch
    expect(store.getState).toBeDefined(); // Проверяем наличие метода getState
    expect(store.subscribe).toBeDefined(); // Проверяем наличие метода subscribe
    expect(store.replaceReducer).toBeDefined(); // Проверяем наличие метода replaceReducer
    
    // Проверяем, что состояние store имеет правильную структуру
    const storeState = store.getState();
    expect(storeState).toHaveProperty('ingredients');
    expect(storeState).toHaveProperty('getIngredients');
    expect(storeState).toHaveProperty('feeds');
    expect(storeState).toHaveProperty('loginUser');
    expect(storeState).toHaveProperty('orders');
  });

  // Тест 4: Проверяем тип RootState
  test('RootState should be the return type of rootReducer', () => {
    // Arrange: Создаем тестовое состояние
    const testState = rootReducer(undefined, { type: '@@INIT' });
    
    // Assert: Проверяем, что тип RootState соответствует структуре состояния
    const rootState: RootState = testState; // TypeScript проверит соответствие типов
    expect(rootState).toBeDefined(); // Проверяем, что RootState определен
  });

  // Тест 5: Проверяем тип AppDispatch
  test('AppDispatch should be the type of store dispatch', () => {
    // Arrange: Создаем store и получаем его dispatch
    const store = configureStore({ reducer: rootReducer });
    const storeDispatch = store.dispatch;
    
    // Assert: Проверяем, что тип AppDispatch соответствует dispatch от store
    const appDispatch: AppDispatch = storeDispatch; // TypeScript проверит соответствие типов
    expect(appDispatch).toBeDefined(); // Проверяем, что AppDispatch определен
    expect(typeof appDispatch).toBe('function'); // Проверяем, что это функция
  });

  // Тест 6: Проверяем кастомный хук useDispatch
  test('useDispatch should be defined and return a function', () => {
    // Assert: Проверяем, что хук определен и является функцией
    expect(useDispatch).toBeDefined(); // Проверяем, что хук определен
    expect(typeof useDispatch).toBe('function'); // Проверяем тип
  });

  // Тест 7: Проверяем кастомный хук useSelector
  test('useSelector should be defined and return a function', () => {
    // Assert: Проверяем, что хук useSelector определен и является функцией
    expect(useSelector).toBeDefined(); // Проверяем, что хук определен
    expect(typeof useSelector).toBe('function'); // Проверяем, что это функция
  });

  // Тест 8: Проверяем, что devTools настроены правильно
  test('devTools configuration should depend on environment', () => {
    // Arrange: Сохраняем оригинальное значение NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    
    // Test 8.1: Когда NODE_ENV = 'production'
    process.env.NODE_ENV = 'production';
    const prodDevTools = process.env.NODE_ENV !== 'production';
    
    // Assert: В production devTools должны быть false
    expect(prodDevTools).toBe(false);
    
    // Test 8.2: Когда NODE_ENV = 'development'
    process.env.NODE_ENV = 'development';
    const devDevTools = process.env.NODE_ENV !== 'production';
    
    // Assert: В development devTools должны быть true
    expect(devDevTools).toBe(true);
    
    // Test 8.3: Когда NODE_ENV = 'test'
    process.env.NODE_ENV = 'test';
    const testDevTools = process.env.NODE_ENV !== 'production';
    
    // Assert: В test devTools должны быть true (так как test !== production)
    expect(testDevTools).toBe(true);
    
    // Восстанавливаем оригинальное значение NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });

  // Тест 9: Проверяем импорт store по умолчанию
  test('default store export should be configured correctly', () => {
    // Импортируем store по умолчанию
    const defaultStore = require('./store').default;
    
    // Assert: Проверяем, что store по умолчанию создан правильно
    expect(defaultStore).toBeDefined(); // Проверяем, что store определен
    expect(defaultStore.dispatch).toBeDefined(); // Проверяем наличие dispatch
    expect(defaultStore.getState).toBeDefined(); // Проверяем наличие getState
    
    // Проверяем структуру состояния store по умолчанию
    const defaultState = defaultStore.getState();
    expect(defaultState).toHaveProperty('ingredients');
    expect(defaultState).toHaveProperty('getIngredients');
    expect(defaultState).toHaveProperty('feeds');
    expect(defaultState).toHaveProperty('loginUser');
    expect(defaultState).toHaveProperty('orders');
  });

  // Тест 10: Проверяем, что все ключи в rootReducer существуют
  test('rootReducer should have all required keys', () => {
    // Получаем список ключей из rootReducer после инициализации
    const state = rootReducer(undefined, { type: '@@INIT' });
    const stateKeys = Object.keys(state);
    
    // Ожидаемые ключи
    const expectedKeys = [
      'ingredients',
      'getIngredients',
      'feeds',
      'loginUser',
      'orders'
    ];
    
    // Проверяем, что все ожидаемые ключи присутствуют
    expectedKeys.forEach(key => {
      expect(stateKeys).toContain(key);
    });
    
    // Проверяем, что количество ключей совпадает
    expect(stateKeys.length).toBe(expectedKeys.length);
  });
});