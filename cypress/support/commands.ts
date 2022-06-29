/// <reference types="cypress" />

import Chance from 'chance'

const chance = new Chance()

Cypress.Commands.add("getByTestId", (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

Cypress.Commands.add("createUser", (username = chance.name(), email = chance.email(), password = chance.word({ length: 6 })) => {
  cy.visit('/signup');

  cy.getByTestId("username").clear().type(username);
  cy.getByTestId("email").clear().type(email);
  cy.getByTestId("password").clear().type(password);
  cy.getByTestId("passwordConfirm").clear().type(password);
  cy.getByTestId("submit").click();

  return cy.wrap([email, password] as [string, string])
});

Cypress.Commands.add("loginWithPassword", (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.getByTestId("email").clear().type(email);
    cy.getByTestId("password").clear().type(password);
    cy.getByTestId("submit").click();
  })

  cy.visit('/')
});


Cypress.Commands.add("logout", () => {
  cy.getByTestId("logout").click({ force: true });
});

declare global {
  namespace Cypress {
    interface Chainable {
      createUser(username?: string, email?: string, password?: string): Chainable<[string, string]>
      loginWithPassword(email: string, password: string): void
      logout(): void

      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('greeting')
       */
      getByTestId(dataTestIdAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;

    }
  }
}
