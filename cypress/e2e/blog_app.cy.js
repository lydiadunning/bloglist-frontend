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
          cy.createBlog({ 
            title: 'Busses Everyday', 
            author: 'Jerry Burlywood', 
            url: 'www.busses.com' 
          })
          cy.visit('http://localhost:5173')
          cy.contains('view').click()
             
        })
    
        it('it can be liked by its creator', function() {
          cy.contains('likes: 0')
          cy.contains('like').click()
          cy.contains('likes: 1')
        })

        it('a blog can be deleted by its creator', function() {
          cy.contains('remove').click()
          cy.get('.message').contains('Busses Everyday removed')
          cy.get('html').should('not.contain', 'Busses Everyday - Jerry Burlywood')
        })

        describe('When no user is logged in', function() {
          beforeEach(function() {
            localStorage.removeItem('loggedBlogappUser')
            cy.visit('http://localhost:5173')
            cy.contains('view').click()
          })

          it('a blog can be liked', function() {
            cy.contains('likes: 0')
            cy.contains('like').click()
            cy.contains('likes: 1')
          })

          it('a blog can not be deleted', function() {
            cy.get('#expanded').should('not.contain', 'remove')
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

          it('a blog can not be deleted', function() {
            cy.get('#expanded').should('not.contain', 'remove')
          })
        })
        
        describe('when several blogs have been added', function() {
          beforeEach(function() {
            cy.createBlog({
              title: 'blog 1',
              author: 'Erica Zeal',
              url: 'www.therealhank.com'
            }).then(blog => {
              cy.likeBlog(blog.body, 5)
            })
            cy.createBlog({
              title: 'blog 2',
              author: 'Jim x',
              url: 'www.finallytherealhank.com'
            }).then(blog => {
              cy.likeBlog(blog.body, 1)
            })
            cy.createBlog({
              title: 'blog 3',
              author: 'Melinda Hab',
              url: 'www.thethirdblog.com'
            }).then(blog => {
              cy.likeBlog(blog.body, 10)
            })
            cy.visit('http://localhost:5173')
            cy.contains('view').click()
          })

          it.only('blogs show in order of likes', function() {
            cy.get('.blog').eq(0).should('contain', 'blog 3')
            cy.get('.blog').eq(1).should('contain', 'blog 1')
            cy.get('.blog').eq(2).should('contain', 'blog 2')
            cy.get('.blog').eq(3).should('contain', 'Busses Everyday')

          }) 
        })
      })
    })
  })
})

