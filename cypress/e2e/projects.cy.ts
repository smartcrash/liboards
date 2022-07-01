import Chance from 'chance'
import { route } from '../../client/source/routes'
import slug from '../../source/utils/slug'

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
    cy.location("pathname").should("equal", route('projects.create'));

    cy.getByTestId('title').clear().type(title)
    cy.getByTestId('submit').click()

    cy.location('pathname').should('contain.text', slug(title))
    cy.contains(title)

    // For good measure, assert that the created project
    // is listed on the projects page
    cy.visit(route('projects.list'))
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

      cy.visit(route('projects.create'))
      cy.getByTestId('title').clear().type(title)
      cy.getByTestId('submit').click()
    })

    it('should allow to edit the project\'s `title`', () => {
      const newTitle = chance.sentence({ words: 2 })

      cy.getByTestId('title')
        .parent()
        .click()
        .clear()
        .type(`${newTitle}{enter}`)

      // The URL should have synced with the new title
      cy.location('pathname').should('contain', slug(newTitle))

      // Force reload the page to ensure that changes are persisted
      cy.reload(true)
      cy.contains(newTitle)
    })
  })


  it('should be able to soft-delete a project', () => {
    const title = chance.sentence({ words: 2 })

    // Create a new project
    cy.visit(route('projects.create'))
    cy.getByTestId('title').clear().type(title)
    cy.getByTestId('submit').click()

    cy.getByTestId('delete-project').click({ force: true })
    cy.location('pathname').should('equal', route('projects.list'))

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

      cy.visit(route('projects.create'))
      cy.getByTestId('title').clear().type(title)
      cy.getByTestId('submit').click()
      cy.getByTestId('delete-project').click({ force: true })

      cy.location('pathname').should('equal', route('projects.list'))
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
