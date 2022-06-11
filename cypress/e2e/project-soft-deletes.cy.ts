import Chance from "chance"

const chance = new Chance()

describe('Project Soft-Deletes', () => {
  before(() => cy.createUser())

  it('should be able to delete and restore a project', () => {
    const title = chance.sentence({ words: 2 })
    const desc = chance.sentence({ words: 5 })

    // Create a new project
    cy.visit("/projects/new")
    cy.getByTestId('title').clear().type(title)
    cy.getByTestId('description').clear().type(desc)
    cy.getByTestId('submit').click()

    cy.getByTestId('delete').click({ force: true })
    cy.location('pathname').should('equal', '/projects')

    // Should to be visible on the projects page
    // because should be inside a collapsed element
    cy.contains(title).should('not.be.visible')
    cy.contains(desc).should('not.be.visible')

    // Click the project's restore button
    cy.contains(title).parent().getByTestId('restore').click({ force: true })

    // The project should be visible now that is restored
    cy.contains(title).should('be.visible')
    cy.contains(desc).should('be.visible')
  })
})
