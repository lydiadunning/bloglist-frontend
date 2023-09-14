import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

//Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.

test('Can submit a new blog', async () => {
  const createBlog = jest.fn()

  const formInput = {
    title: "The Real Hank",
    author: "Laura Jones",
    url: "www.authenticallyhank.com"
  }
  
  // const container = 
  render(
    <BlogForm createBlog={createBlog} />
  )
  screen.debug()
  
  const user = userEvent.setup()
  
  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], formInput.title)
  await user.type(inputs[1], formInput.author)
  await user.type(inputs[2], formInput.url)
  
  screen.debug()

  const submitButton = screen.getByText('create')
  await user.click(submitButton)
  
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(formInput)
})