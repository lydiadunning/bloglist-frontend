describe('Blog app', function() {
  this.beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:5173')
  })
  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.contains('username')
    cy.get('#username')
    cy.contains('password')
    cy.get('#password')
    cy.get('button').contains('login')
  })

  describe('Login',function() {
    this.beforeEach(function() {
      const user = {
        name: 'Carmen Saffron',
        username: 'csaffron',
        password: 'password'
      }
      cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('http://localhost:5173')
    })
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('csaffron')
      cy.get('#password').type('password')
      cy.get('button').click()
      cy.get('.message')
        .should('contain', 'csaffron logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.contains('Carmen Saffron logged in')
      cy.contains('log out')
      cy.contains('new blog')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('csaffron')
      cy.get('#password').type('wrong')
      cy.get('button').click()
      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
          username: 'csaffron', password: 'password'
        }).then(({ body }) => {
          localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
          cy.visit('http://localhost:5173')
          cy.contains('new blog').click()
        })      
      })
  
      it('A blog can be created', function() {
        cy.get('#title').type('Testing Blog')
        cy.get('#author').type('Arthur Author')
        cy.get('#url').type('www.blog.com/blog')
        cy.contains('create').click()
        cy.contains('blogs')
        cy.get('.message').contains('New Blog Testing Blog by Arthur Author added')
        cy.contains('Testing Blog - Arthur Author')
      })

      it('An empty form is rejected', function() {
        cy.contains('create').click()
        cy.get('.error')
        .should('contain', 'Error:Blog not added')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      })
    })
  })
})

