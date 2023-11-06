# bloglist-frontend

bloglist-frontend is the result of completing assignments from Full Stack Open. 
It is a full stack web application with tests.

## Cypress - end to end tests

Cypress frontend tests are in the `bloglist-frontend/cypress/e2e/blog_app.cy.js`

### Run Cypress Tests

1. If necessary, download and install [Cypress](https://www.cypress.io/).
2. Launch the backend with a CLI. Navigate to `/backend` and type `npm run start:test` to run the server with the testing router available.
3. From `bloglist-frontend`, enter `npm run dev` to run the frontend locally.
4. With both backend and frontend running, enter `npm run cypress:open` from `bloglist-frontend` to open Cypress.
4. Choose end-to-end.
5. Select a browser (I use Chrome).
6. In the browser, execute blog_app.cy.js
7. Wait for tests to execute, and view the results.

## Testing-Library with Jest - component testing
Find component tests for the Blog and BlogForm components in `bloglist-frontend/src/components`.

### Run Component Tests
Type `npm run test -- src/components` in a command line interface from `blog-list/frontend` to execute component tests.

## Jest - backend unit testing
Unit tests for server route responses are located in `backend/tests`. 

### Run unit tests
Type `npm run test -- backend/tests` in a command line interface from `blog-list/frontend` to execute unit tests on the backend.