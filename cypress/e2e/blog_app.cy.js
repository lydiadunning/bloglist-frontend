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

      describe('When a blog has been added', function() {
        beforeEach(function() {
          cy.request({
            url: `${Cypress.env('BACKEND')}/blogs`,
            method: 'POST',
            body: { 
              title: 'Busses Everyday', 
              author: 'Jerry Burlywood', 
              url: 'www.busses.com' 
            },
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
            }
          }).then(() => {
            cy.visit('http://localhost:5173')
            cy.contains('view').click()
          })      
        })
    
        it('it can be liked by its creator', function() {
          cy.contains('likes: 0')
          cy.contains('like').click()
          cy.contains('likes: 1')
        })

        describe('When no user is logged in', function() {
          beforeEach(function() {
            localStorage.removeItem('loggedBlogappUser')
          })

          it('a blog can be liked', function() {
            cy.contains('likes: 0')
            cy.contains('like').click()
            cy.contains('likes: 1')
          })
        })
        
        describe('When another user is logged in', function() {
          this.beforeEach(function() {
            const user = {
              name: 'Joe Mike',
              username: 'King Dude',
              password: 'drowssap'
            }
            cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
            cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
              username: 'King Dude', password: 'drowssap'
            }).then(({ body }) => {
              localStorage.setItem('loggedBlogappUser', JSON.stringify(body))
              cy.visit('http://localhost:5173')
              cy.contains('view').click()
            })      
          })
          it('a blog can be liked', function() {
            cy.contains('likes: 0')
            cy.contains('like').click()
            cy.contains('likes: 1')
          })
        })
        

        // describe('When another user is signed in')
      })
    })
  })
})

