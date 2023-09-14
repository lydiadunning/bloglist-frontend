/**Make a test, which checks that the component displaying a blog renders the blog's title and author, but does not render its URL or number of likes by default.

Add CSS classes to the component to help the testing as necessary. */
// const Blog = ({ blog, updateLikes, deleteById }) 

// imports
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// create a blog to serve as input
const blog = {
  user: 'Poster Dan',
  likes: 2,
  author: 'Blogger Dan',
  title: 'The Dan Cave',
  url: 'www.dan.com',
  id: '123456789'
}

// declare test
test('Renders Content', async () => {
// create service(?) - don't need this here, simulates user interaction

// render the blog
const container = render(<Blog blog={blog} />).container
// print to screen
screen.debug()

// title visible
const title = await screen.findByText('The Dan Cave', { exact: false })
expect(title).toBeDefined()
// author visible
const author = await screen.findByText('Blogger Dan', { exact: false })
expect(author).toBeDefined()

const url = await screen.queryByText('www.dan.com', {exact: false})
expect(url).toBeNull()
const likes = await screen.queryByText('likes: 2', {exact: false})
expect(likes).toBeNull()
})

test('clicking hide shows more content', async () => {
  const container = render(<Blog blog={blog} />).container
  // print to screen
  screen.debug()

  const user = userEvent.setup()

  const viewButton = container.querySelector('#view')
  // const hideButton = container.querySelector('#hide')

  await user.click(viewButton)

  const url = await screen.queryByText('www.dan.com', {exact: false})
  expect(url).toBeDefined()
  const likes = await screen.queryByText('likes: 2', {exact: false})
  expect(likes).toBeDefined()
})

test('like button clicks register', async () => {
  const mockHandler = jest.fn()

  render(
    <Blog blog={blog} updateLikes={mockHandler} />
  )
  screen.debug()

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  // const hideButton = container.querySelector('#hide')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})