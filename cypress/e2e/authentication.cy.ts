describe('User authentication flow', () => {
  beforeEach(() => {
    cy.exec('npm run schema:drop')
    cy.exec('npm run schema:sync')
  })

  it('should redirect unauthenticated user to signin page', () => {
    cy.visit('/')
    cy.location("pathname").should("equal", "/login");
  })

  it("should allow visitor to create account, login with password, and logout", () => {
    const username = "bobross"
    const email = "painterjoy90@gmail.com"
    const password = "s3cret"

    /**
     * On login page should exists a link that redirects to
     * the sign-up page.
     */
    cy.visit('/login')
    cy.getByTestId('go-to-signup').click()
    cy.location("pathname").should("equal", "/signup");


    cy.createUser(username, email, password)
    cy.location("pathname").should("equal", "/");
    cy.contains(username)

    cy.logout()
    cy.location("pathname").should("equal", "/login");

    cy.loginWithPassword(email, password)
    cy.location("pathname").should("equal", "/");
    cy.contains(username)
  })

  it("should display login errors", () => {
    const username = "bobross"
    const email = "painterjoy90@gmail.com"
    const password = "s3cret"

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
    const username = "bobross"
    const email = "painterjoy90@gmail.com"
    const password = "s3cret"

    cy.createUser(username, email, password)
    cy.logout()
    cy.visit('/signup')

    cy.getByTestId("username").clear().type('foo')
    cy.getByTestId("email").clear().type('email@asd.com')
    cy.getByTestId("password").clear().type('123')
    cy.getByTestId('submit').click()

    cy.contains('The username must contain at least 4 characters.')
    cy.contains('The password must contain at least 4 characters.')

    cy.getByTestId("username").clear().type(username)
    cy.getByTestId("email").clear().type(email)
    cy.getByTestId("password").clear().type(password)
    cy.getByTestId('submit').click()

    cy.contains('This username already exists.')
    cy.contains('This email is already in use.')
  });

})
