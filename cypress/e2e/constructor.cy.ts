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
  describe('Модальные окна', () => {
    // открытие модального окна ингредиента;
    it('Открыть', () => {
      cy.get('[data-cy=constructor-items-add]').first().click();
      cy.get('[data-cy=modal]', { timeout: 1000 })
        .should('be.visible')
        .and('contain', 'Краторная булка N-200i');
    });

    // закрытие по клику на крестик;
    it('Закрыть', () => {
      cy.get('[data-cy=constructor-items-add]').first().click();
      cy.get('[data-cy=btn-close-modal]', { timeout: 1000 }).click();

      cy.visit('/');
      cy.get('[data-cy=modal]').should('not.exist');
    });
  });


  // Создание заказа:
  describe('Создание заказа', () => {
    // Собирается бургер.
    it('Собирается бургер', () => {
      cy.get('[data-cy=constructor-items-add]', { timeout: 5000 }).first().find('button').click();
      cy.get('[data-cy=constructor-items-add]', { timeout: 5000 }).contains('p', 'Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      cy.get('[data-cy=constructor-items-bun-top]').should('contain', 'Краторная булка N-200i');
      cy.get('[data-cy=constructor-items-ingredient]').should('contain', 'Биокотлета из марсианской Магнолии');

      // Вызывается клик по кнопке «Оформить заказ».
      cy.get('[data-cy=btn-order]').click();
      cy.wait('@createOrder');

      // Проверяется, что модальное окно открылось и номер заказа верный.
      cy.get('[data-cy=modal]').should('exist');
      cy.get('[data-cy=order-number]').should('contain', '102680');

      // Закрывается модальное окно и проверяется успешность закрытия.
      cy.get('[data-cy=btn-close-modal]', { timeout: 1000 }).click();

      cy.visit('/');
      cy.get('[data-cy=modal]').should('not.exist');

      // Проверяется, что конструктор пуст.
      cy.get('[data-cy=constructor-items-bun-top]').should('not.exist');
      cy.get('[data-cy=constructor-items-ingredient]').should('not.contain', 'Биокотлета из марсианской Магнолии');
    });
  });

  afterEach(() => {
    // Очистка токенов
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

});
