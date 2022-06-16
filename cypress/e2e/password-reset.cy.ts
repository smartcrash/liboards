import Chance from 'chance'

const chance = new Chance()

const API_TOKEN = '93cd1ac23fd513acf6184add4160c5d6'
const INBOX_ID = 1016655

describe('Resetting passwords', () => {
  it('should send email with intructions to reset password and should be able to change password using the email\'s link', () => {
    const username = chance.name()
    const email = chance.email()
    const password = chance.word({ length: 5 })
    const newPassword = chance.word({ length: 8 })

    cy.createUser(username, email, password)
    cy.logout()
    cy.location("pathname").should("equal", "/login");


    cy.wait(500)
    cy.getByTestId('forgot-password').click()
    cy.location("pathname").should("equal", "/forgot-password");

    cy.getByTestId('email').clear().type(email)
    cy.getByTestId('submit').click()

    cy.getByTestId('success', { timeout: 10000 }).should('be.visible')

    /** Make a request to Mailtrap's REST API to fecth the last message sended
     * to this user and assert that indeed was sended
     */
    cy.request({
      method: 'GET',
      url: `https://mailtrap.io/api/v1/inboxes/${INBOX_ID}/messages?to_email=${email}&api_token=${API_TOKEN}`,
      headers: { 'Content-Type': 'application/json' }
    }).should((response) => {
      expect(response.body).to.length.above(0)

      const [message] = response.body
      const { to_email, html_path, sent_at } = message

      const sendAt = new Date(sent_at)
      const currentDate = new Date()
      const dateDiff = Math.abs(+currentDate - +sendAt)

      expect(to_email).to.equal(email)
      expect(html_path).to.be.a('string')
      expect(dateDiff).to.be.lessThan(1000 * 60 * 1) // 1 minute

      cy.request(`https://mailtrap.io${html_path}?api_token=${API_TOKEN}`)
        .its('body')
        .should('be.a', 'string')
        .should('not.be.empty')
        .then((html) => cy.document().invoke('write', html))
    })

    /** Visit email's reset password URL */
    cy.get('a')
      .invoke('attr', 'href')
      .then(href => cy.visit(href))

    cy.location("pathname").should("contain", "/reset-password");

    /** Enter the new password */
    cy.getByTestId('newPassword').clear().type(newPassword)
    cy.getByTestId('submit').click()
    cy.location("pathname").should("equal", "/login");

    /** User new password to login */
    cy.loginWithPassword(email, password)
    cy.contains('Incorrect password, try again.')

    cy.loginWithPassword(email, newPassword)
    cy.location("pathname").should("equal", "/projects");
  })
})
