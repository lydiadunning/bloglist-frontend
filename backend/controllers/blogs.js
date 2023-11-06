const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }) 

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    response.status(400).end()
  } 

  // eslint-disable-next-line no-undef
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  const user = request.user

  blog.user = user.id

  blog.likes = blog.likes || 0
  const result = await blog.save()

  user.blogs = user.blogs.concat(result.id)
  await user.save()
  response.status(201).json(result)
})

// verify that a token was sent with request and the token is 
// associated with the right user
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // eslint-disable-next-line no-undef
  const user = request.user 
  const blog = await Blog.findById(request.params.id)
  const blogId = blog.user.toString()
  if (user.id !== blogId) {
    return response.status(401).json({ error: 'user not authorized to delete this entry' })
  } 
  // Not thrilled by querying the database three times here.

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.delete('/all/delete', async (request, response) => {
  await Blog.deleteMany({})
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const updated = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  response.json(updated)
})



module.exports = blogsRouter