import Chance from 'chance'

const chance = new Chance()
let user: [string, string]

describe('Project CRUD operations', () => {
  before(() => {
    cy.createUser().then(([email, pwd]) => user = [email, pwd])
    cy.logout()
  })

  beforeEach(() => cy.loginWithPassword(...user))

  it("should be able to create new projects", async () => {
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
    cy.getByTestId('projects-list').within(() => {
      cy.getByTestId('project-item')
        .first()
        .should('be.visible')
        .should('contain.text', title)
    })
  })


  context('with existing project', () => {
    let title: string

    beforeEach(() => {
      title = chance.sentence({ words: 2 })

      cy.visit("/projects/new")
      cy.getByTestId('title').clear().type(title)
      cy.getByTestId('submit').click()
    })

    it('should allow to edit the project\'s `title`', () => {
      const title = chance.sentence({ words: 2 })

      cy.getByTestId('title')
        .parent()
        .click()
        .clear()
        .type(`${title}{enter}`)

      // Force reload the page to ensure that changes are persisted
      cy.reload(true)
      cy.contains(title)
    })
  })


  it('should be able to soft-delete a project', () => {
    const title = chance.sentence({ words: 2 })

    // Create a new project
    cy.visit("/projects/new")
    cy.getByTestId('title').clear().type(title)
    cy.getByTestId('submit').click()

    cy.getByTestId('delete-project').click({ force: true })
    cy.location('pathname').should('equal', '/projects')

    // Assert that only exists in the list of deleted
    cy.getByTestId('projects-list').contains(title).should('not.exist')

    // The deleted project should appear on the deleted list
    // and be the first element as well.
    cy.getByTestId('deleted-projects-list').within(() => {
      cy.getByTestId('deleted-project-item')
        .first()
        .should('contain.text', title)
    })
  })

  context('with deleted project', () => {
    let title: string

    beforeEach(() => {
      title = chance.sentence({ words: 2 })

      cy.visit("/projects/new")
      cy.getByTestId('title').clear().type(title)
      cy.getByTestId('submit').click()
      cy.getByTestId('delete-project').click({ force: true })

      cy.location('pathname').should('equal', '/projects')
    })

    it("should be able to restore a project", () => {
      // Click the project's restore button
      cy.getByTestId('deleted-project-item')
        .first()
        .within(() => {
          cy.getByTestId('restore-project')
            .click({ force: true })
        })

      // The project should be visible now that is restored
      cy.getByTestId('projects-list').contains(title).should('be.visible')
      cy.getByTestId('deleted-projects-list').contains(title).should('not.exist')

    })

    it('should be able to force-delete a project', () => {
      cy.getByTestId('deleted-project-item')
        .first()
        .should('contain.text', title)
        .within(() => {
          cy.getByTestId('force-delete-project')
            .click({ force: true })
        })

      // The project should be visible now that is restored
      cy.getByTestId('projects-list').contains(title).should('not.exist')
      cy.getByTestId('deleted-projects-list').contains(title).should('not.exist')

    })
  })
})
