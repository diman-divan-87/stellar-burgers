/// <reference types="cypress" />

describe('Тесты конструктора бургера:', () => {
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

  it('Добавляет булку и начинку в конструктор 2', () => {
    console.log('test')
  })

});
