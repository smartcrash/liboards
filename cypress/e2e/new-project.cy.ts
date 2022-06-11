import Chance from 'chance'

const chance = new Chance()

describe('New Project', () => {
  before(() => cy.createUser())

  beforeEach(() => cy.visit('/'))

  it("creates a new project and navigates to project's page", async () => {
    const title = chance.word({ length: 3 })
    const description = chance.sentence()

    cy.getByTestId('new-project').click()
    cy.location("pathname").should("equal", "/projects/new");

    cy.getByTestId('title').clear().type(title)
    cy.getByTestId('description').clear().type(description)
    cy.getByTestId('submit').click()

    cy.location('pathname').should('match', /\/projects\/\d+/)
    cy.contains(title)
    cy.contains(description)

    // For good measure, assert that the created project
    // is listed on the projects page
    cy.visit('/projects')
    cy.contains(title).should('be.visible')
    cy.contains(description).should('be.visible')
  })
})
