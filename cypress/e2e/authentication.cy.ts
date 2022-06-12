import Chance from 'chance'

const chance = new Chance()

describe('User authentication flow', () => {
  it('should redirect unauthenticated user to signin page', () => {
    cy.visit('/')
    cy.location("pathname").should("equal", "/login");
  })

  it("should allow visitor to create account, login with password, and logout", () => {
    const username = chance.name()
    const email = chance.email()
    const password = chance.word({ length: 5 })

    /**
     * On login page should exists a link that redirects to
     * the sign-up page.
     */
    cy.visit('/login')
    cy.getByTestId('go-to-signup').click()
    cy.location("pathname").should("equal", "/signup");


    cy.createUser(username, email, password)
    cy.location("pathname").should("equal", "/projects");
    cy.contains(username)

    cy.logout()
    cy.location("pathname").should("equal", "/login");

    cy.loginWithPassword(email, password)
    cy.location("pathname").should("equal", "/projects");
    cy.contains(username)
  })

  it.only('can login with username instead of email', () => {
    const username = chance.name()
    const email = chance.email()
    const password = chance.word({ length: 5 })

    cy.createUser(username, email, password)
    cy.logout()

    cy.loginWithPassword(username, password)
    cy.location("pathname").should("equal", "/projects");
  })

  it("should display login errors", () => {
    const username = chance.name()
    const email = chance.email()
    const password = chance.word({ length: 5 })

    cy.createUser(username, email, password)
    cy.logout()
    cy.location("pathname").should("equal", "/login");

    cy.getByTestId("email").clear().type('invalid@email.com')
    cy.getByTestId("password").clear().type('wrongpasword')
    cy.getByTestId('submit').click()

    cy.contains('This email does\'nt exists.')

    cy.getByTestId("email").clear().type(email)
    cy.getByTestId("password").clear().type('wrongpasword')
    cy.getByTestId('submit').click()

    cy.contains('Incorrect password, try again.')
  });

  it("should display sign-up errors", () => {
    const username = chance.name()
    const email = chance.email()
    const password = chance.word({ length: 5 })

    cy.createUser(username, email, password)
    cy.logout()
    cy.visit('/signup')

    cy.getByTestId("username").clear().type('foo')
    cy.getByTestId("email").clear().type('email@asd.com')
    cy.getByTestId("password").clear().type('123')
    cy.getByTestId("passwordConfirm").clear().type('1')
    cy.getByTestId('submit').click()

    cy.contains('Passwords must match.')
    cy.getByTestId("passwordConfirm").clear().type('123')
    cy.getByTestId('submit').click()

    cy.contains('The username must contain at least 4 characters.')
    cy.contains('The password must contain at least 4 characters.')

    cy.getByTestId("username").clear().type(username)
    cy.getByTestId("email").clear().type(email)
    cy.getByTestId("password").clear().type(password)
    cy.getByTestId("passwordConfirm").clear().type(password)
    cy.getByTestId('submit').click()

    cy.contains('This username already exists.')
    cy.contains('This email is already in use.')
  });

})
