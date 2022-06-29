import Chance from "chance"

const chance = new Chance()
let user: [string, string]

describe('Cards & columns CRUD operations', () => {
  before(() => cy.createUser().then(([email, pwd]) => user = [email, pwd]))

  // Create a fresh project for each test
  beforeEach(() => {
    cy.loginWithPassword(...user)

    cy.visit('/projects/new')
    cy.getByTestId('title').clear().type(chance.sentence({ words: 2 }))
    cy.getByTestId('submit').click()
  })

  it('can add a new column', () => {
    const newColumn = 'Column 1'

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.contains(newColumn).should('be.visible')
    cy.reload(true)
    cy.contains(newColumn).should('be.visible')
  })

  it('always appends new columns at the end', () => {
    const newColumns = ['Column 1', 'Column 2', 'Column 3']

    newColumns.forEach(newColumn => {
      cy.getByTestId('add-column').click()
      cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)
      cy.get('[data-testid^="column"]:last').contains(newColumn)
    })
  })

  it('can delete columns', () => {
    const newColumn = 'Column 1'

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.getByTestId('column-0').getByTestId('remove-column').click({ force: true })

    cy.contains(newColumn).should('not.exist')
    cy.reload(true)
    cy.contains(newColumn).should('not.exist')
  })

  it('keeps correct order when a column is removed', () => {
    const newColumns = ['Column 1', 'Column 2', 'Column 3']

    newColumns.forEach(newColumn => {
      cy.getByTestId('add-column').click()
      cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)
    })

    cy.get('[data-testid="column-1"] [data-testid="remove-column"]').click({ force: true })

    cy.get('[data-testid^="column"]:first').contains(newColumns[0])
    cy.get('[data-testid^="column"]:last').contains(newColumns[2])
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

  it('can remove a card', () => {
    const newColumn = 'Column 1'
    const newCard = 'Card 1'

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.getByTestId('column-0').then(column => {
      cy.wrap(column).getByTestId('add-card').click()
      cy.wrap(column).getByTestId('card-form').get('input[type="text"]').type(`${newCard}{enter}`)
      cy.wrap(column).getByTestId('card-0').getByTestId('remove-card').click({ force: true })
    })

    cy.contains(newCard).should('not.exist')
    cy.reload(true)
    cy.contains(newCard).should('not.exist')
  })

  it('keeps correct order when a card is removed', () => {
    const newColumn = 'Column 1'
    const newCards = ['Card 1', 'Card 2', 'Card 3']

    cy.getByTestId('add-column').click()
    cy.getByTestId('column-form').get('input[type="text"]').type(`${newColumn}{enter}`)

    cy.getByTestId('column-0').then(column => {
      newCards.forEach(newCard => {
        cy.wrap(column).getByTestId('add-card').click()
        cy.wrap(column).getByTestId('card-form').get('input[type="text"]').type(`${newCard}{enter}`)
      })

      cy.get('[data-testid="column-0"] [data-testid="card-1"] [data-testid="remove-card"]').click({ force: true })

      cy.get('[data-testid^="card"]:first').contains(newCards[0])
      cy.get('[data-testid^="card"]:last').contains(newCards[2])
    })
  })
})

