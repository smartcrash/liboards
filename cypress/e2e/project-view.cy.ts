import Chance from "chance"

const chance = new Chance()

describe('Project View', () => {
  before(() => cy.createUser())

  // Create a fresh project for each test
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

  it('can add a new column', () => {
    const newColumn = 'Column 1'

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.contains(newColumn).should('be.visible')
    cy.reload(true)
    cy.contains(newColumn).should('be.visible')
  })

  it.only('always appends new columns at the end', () => {
    const newColumns = ['Column 1', 'Column 2', 'Column 3']

    newColumns.forEach(newColumn => {
      cy.getByTestId('add-column').click()
      cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)
      cy.get('[data-testid^="column"]:last').contains(newColumn)
    })
  })

  it('can add a cards to columns', () => {
    const newColumn = 'Column 1'
    const newCard = 'Card 1'

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.getByTestId('column-0').then(column => {
      cy.wrap(column).getByTestId('add-card').click()
      cy.wrap(column).getByTestId('card-form').get('input[type="text"]').type(`${newCard}{enter}`)
    })

    cy.contains(newCard).should('be.visible')
    cy.reload(true)
    cy.contains(newCard).should('be.visible')
  })

  it('always place new cards at the bottom of the column', () => {
    const newColumn = 'Column 1'
    const newCards = ['Card 1', 'Card 2', 'Card 3']

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.getByTestId('column-0').then(column => {
      newCards.forEach(newCard => {
        cy.wrap(column).getByTestId('add-card').click()
        cy.wrap(column).getByTestId('card-form').get('input[type="text"]').type(`${newCard}{enter}`)
        cy.wrap(column).get('[data-testid^="card"]:last').contains(newCard)
      })
    })
  })
})

