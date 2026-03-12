import {
  initialState,
  registerUserApp,
  loginUserApp,
  fetchUserApp,
  logoutUserApp,
  updateUserApp,
  checkUserAuth,
  resetErr,
  resetRegisterChecked,
  isAuthChecked,
  selectUserAuthLoading,
  selectUser,
  userReducer,
  loginUserAppSlice
} from './loginUser'; // импортируем все необходимое из файла со слайсом
import { TUser } from '@utils-types'; // импортируем тип пользователя
import { RootState } from '../store'; // импортируем тип корневого состояния
import { setCookie, getCookie } from '../../utils/cookie';

// Мокаем API функции, чтобы не отправлять реальные запросы
jest.mock('../../utils/burger-api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn()
}));

// Мокаем cookie функции
jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));

const testUser = {
  user: {
    email: 'test@test.com',
    name: 'Test User'
  } as TUser
};

const testUserState = {
  isAuthChecked: true,
  user: {
    email: 'test@test.com',
    name: 'Test User'
  } as TUser,
  loading: false,
  error: null
};

// Импортируем замоканные функции для использования в тестах
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  logoutApi,
  updateUserApi
} from '../../utils/burger-api';

// Описываем тесты для userSlice
describe('userSlice', () => {
  // Сбрасываем все моки перед каждым тестом
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Тестируем начальное состояние
  test('должен вернуть начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // Тестируем синхронное действие resetErr
  test('очистка ошибки', () => {
    const previousState = {
      ...initialState,
      error: 'some error'
    };

    expect(userReducer(previousState, resetErr())).toEqual({
      ...initialState,
      error: null
    });
  });

  // Тестируем синхронное действие resetRegisterChecked
  test('сброс isAuthChecked', () => {
    const previousState = {
      ...initialState,
      isAuthChecked: true
    };

    expect(userReducer(previousState, resetRegisterChecked())).toEqual({
      ...initialState,
      isAuthChecked: false
    });
  });

  // Тестируем registerUserApp (pending состояние)
  test('registerUserApp.pending', () => {
    const previousState = {
      ...initialState,
      error: 'some error',
      loading: false
    };

    const action = { type: registerUserApp.pending.type };
    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(true);
    expect(state.error).toEqual(null);
  });

  // Тестируем registerUserApp (fulfilled состояние)
  test('registerUserApp.fulfilled', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: registerUserApp.fulfilled.type,
      payload: testUser
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(testUser.user);
    expect(state.isAuthChecked).toEqual(true);
  });

  // Тестируем registerUserApp (rejected состояние)
  test('registerUserApp.rejected', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: registerUserApp.rejected.type,
      error: { message: 'Registration failed' }
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual('Registration failed');
  });

  // Тестируем loginUserApp (pending состояние)
  test('loginUserApp.pending', () => {
    const previousState = {
      ...initialState,
      error: 'some error',
      loading: false
    };

    const action = { type: loginUserApp.pending.type };
    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(true);
    expect(state.error).toEqual(null);
  });

  // Тестируем loginUserApp (fulfilled состояние)
  test('loginUserApp.fulfilled', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: loginUserApp.fulfilled.type,
      payload: testUser.user
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.isAuthChecked).toEqual(true);
    expect(state.user).toEqual(testUser.user);
    expect(state.error).toEqual(null);
  });

  // Тестируем loginUserApp (rejected состояние)
  test('loginUserApp.rejected', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: loginUserApp.rejected.type,
      error: { message: 'Login failed' }
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.isAuthChecked).toEqual(true);
    expect(state.error).toEqual('Login failed');
  });

  // Тестируем fetchUserApp (pending состояние)
  test('fetchUserApp.pending', () => {
    const previousState = {
      ...initialState,
      error: 'some error',
      loading: false
    };

    const action = { type: fetchUserApp.pending.type };
    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(true);
    expect(state.error).toEqual(null);
  });

  // Тестируем fetchUserApp (fulfilled состояние)
  test('fetchUserApp.fulfilled', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: fetchUserApp.fulfilled.type,
      payload: testUser.user
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.isAuthChecked).toEqual(true);
    expect(state.user).toEqual(testUser.user);
    expect(state.error).toEqual(null);
  });

  // Тестируем fetchUserApp (rejected состояние)
  test('fetchUserApp.rejected', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: fetchUserApp.rejected.type,
      error: { message: 'Login failed' }
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.isAuthChecked).toEqual(true);
    expect(state.error).toEqual('Login failed');
  });

  // Тестируем logoutUserApp (pending состояние)
  test('logoutUserApp.pending', () => {
    const previousState = {
      ...initialState,
      error: 'some error',
      loading: false
    };

    const action = { type: logoutUserApp.pending.type };
    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(true);
    expect(state.error).toEqual(null);
  });

  // Тестируем logoutUserApp (fulfilled состояние)
  test('logoutUserApp.fulfilled', () => {
    const previousState = {
      ...testUserState,
      loading: true
    };

    const action = { type: logoutUserApp.fulfilled.type };
    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.isAuthChecked).toEqual(true);
    expect(state.user).toEqual(null);
  });

  // Тестируем logoutUserApp (rejected состояние)
  test('logoutUserApp.rejected', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: logoutUserApp.rejected.type,
      error: { message: 'Logout failed' }
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual('Logout failed');
  });

  // Тестируем updateUserApp (pending состояние)
  test('updateUserApp.pending', () => {
    const previousState = {
      ...initialState,
      error: 'some error',
      loading: false
    };

    const action = { type: updateUserApp.pending.type };
    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(true);
    expect(state.error).toEqual(null);
  });

  // Тестируем updateUserApp (fulfilled состояние)
  test('updateUserApp.fulfilled', () => {
    const previousState = {
      ...testUserState,
      loading: true
    };

    const updatedUser = {
      email: 'updated@test.com',
      name: 'Updated User'
    };

    const action = {
      type: updateUserApp.fulfilled.type,
      payload: { user: updatedUser }
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.user).toEqual(updatedUser);
  });

  // Тестируем updateUserApp (rejected состояние)
  test('updateUserApp.rejected', () => {
    const previousState = {
      ...initialState,
      loading: true
    };

    const action = {
      type: updateUserApp.rejected.type,
      error: { message: 'Update failed' }
    };

    const state = userReducer(previousState, action);

    expect(state.loading).toEqual(false);
    expect(state.error).toEqual('Update failed');
  });

  // Тестируем селекторы
  describe('selectors', () => {
    const mockState = {
      loginUser: testUserState
    } as RootState;

    test('селектор isAuthChecked', () => {
      expect(isAuthChecked(mockState)).toEqual(true);
    });

    test('селектор selectUserAuthLoading', () => {
      expect(selectUserAuthLoading(mockState)).toEqual(false);
    });

    test('селектор selectUser', () => {
      expect(selectUser(mockState)).toEqual(testUser.user);
    });
  });
});