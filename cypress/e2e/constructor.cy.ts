/// <reference types="cypress" />

describe('Тесты конструктора бургера:', () => {
  // Созданы моковые данные для ингредиентов (например, в файле ingredients.json);
  // Настроен перехват запроса на эндпоинт 'api/ingredients’, в ответе на который возвращаются созданные ранее моковые данные.
  beforeEach(() => {
    // Подставляем fixture
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    // Подставляем токены
    cy.fixture('user.json').then((user) => {
      cy.setCookie('accessToken', 'test-access-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  // Протестировано добавление ингредиента из списка в конструктор. Минимальные требования — добавление одного ингредиента, в идеале — добавление булок и добавление начинок.
  describe('Добавление ингредиентов', () => {
    it('Добавление булок в конструктор', () => {
      cy.get('[data-cy=constructor-items-add]').first().find('button').click();
      cy.get('[data-cy=constructor-items-bun-top]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-items-bun-bottom]').should('contain', 'Краторная булка N-200i');
    });
  });

  // Протестирована работа модальных окон:
  // открытие модального окна ингредиента;

  // закрытие по клику на крестик;

  // закрытие по клику на оверлей (желательно);


  // Создание заказа:
  // Созданы моковые данные ответа на запрос данных пользователя.

  // Созданы моковые данные ответа на запрос создания заказа.

  // Подставляются моковые токены авторизации.

  // Собирается бургер.

  // Вызывается клик по кнопке «Оформить заказ».

  // Проверяется, что модальное окно открылось и номер заказа верный.

  // Закрывается модальное окно и проверяется успешность закрытия.

  // Проверяется, что конструктор пуст.

  afterEach(() => {
    // Явная очистка токенов после каждого теста
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

});
