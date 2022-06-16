import Chance from 'chance'

const chance = new Chance()

describe('New Project', () => {
  it("creates a new project and navigates to project's page", async () => {
    cy.createUser()

    const title = chance.word({ length: 3 })

    cy.getByTestId('new-project').click()
    cy.location("pathname").should("equal", "/projects/new");

    cy.getByTestId('title').clear().type(title)
    cy.getByTestId('submit').click()

    cy.location('pathname').should('match', /\/projects\/\d+/)
    cy.contains(title)

    // For good measure, assert that the created project
    // is listed on the projects page
    cy.visit('/projects')
    cy.contains(title).should('be.visible')
  })
})
