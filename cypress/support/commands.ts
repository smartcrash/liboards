/// <reference types="cypress" />

Cypress.Commands.add("getByTestId", (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

Cypress.Commands.add("createUser", (username, email, password) => {
  cy.location("pathname").then((currentPath) => {
    if (currentPath !== '/signup') {
      cy.visit('/signup');
    }
  });

  cy.getByTestId("username").type(username);
  cy.getByTestId("email").type(email);
  cy.getByTestId("password").type(password);
  cy.getByTestId("submit").click();
});

Cypress.Commands.add("loginWithPassword", (email, password) => {
  cy.location("pathname").then((currentPath) => {
    if (currentPath !== '/login') {
      cy.visit('/login');
    }
  });

  cy.getByTestId("email").type(email);
  cy.getByTestId("password").type(password);
  cy.getByTestId("submit").click();
});


Cypress.Commands.add("logout", () => {
  cy.getByTestId("logout").click();
});

declare namespace Cypress {
  interface Chainable {
    createUser(username: string, email: string, password: string): void
    loginWithPassword(email: string, password: string): void
    logout(): void

    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('greeting')
     */
    getByTestId(dataTestIdAttribute: string, args?: any): Chainable<JQuery<HTMLElement>>;

  }
}
