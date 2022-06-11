import Chance from "chance"

const chance = new Chance()

describe('Project View', () => {
  before(() => cy.createUser())

  beforeEach(() => {
    cy.visit("/projects/new")
    cy.getByTestId('title').clear().type(chance.sentence({ words: 2 }))
    cy.getByTestId('description').clear().type(chance.sentence({ words: 5 }))
    cy.getByTestId('submit').click()
  })

  it('should allow to edit the project\'s `title` and `description`', () => {
    const title = chance.sentence({ words: 2 })
    const desc = chance.sentence({ words: 5 })

    cy.getByTestId('title').parent().click().clear().type(title)
    cy.getByTestId('description').parent().click().clear().type(`${desc}{enter}`)

    // Force reload the page to ensure that changes are persisted
    cy.reload(true)

    cy.contains(title)
    cy.contains(desc)
  })
})
