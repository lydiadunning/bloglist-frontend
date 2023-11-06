/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const supertest = require('supertest')
const mongoose = require('mongoose')

// const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const { createUsers, getAllUsers, loginUser, getUserId } = require('./blogHelper')
const loginRouter = require('../controllers/login')

let users = []

beforeAll(async () => {
  await createUsers()
  users = await getAllUsers()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const initialBlogs = [
    {
      'title': 'Learn to Lean from a Pro',
      'author': 'Pitch Jiminez',
      'url': 'www.learntolean.pro',
      'likes': 5,
      'user': users[0].id
    },
    {
      'title': 'Get Worse at Life',
      'author': 'Victoria Sway',
      'url': 'www.fail.now',
      'likes': 8,
      'user': users[1].id
    }
  ]
  
  const blogObjects = initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('returns the correct number of blogs', async () => {
  const response = await api.get('/api/blogs').expect(200)
  expect(response.body).toHaveLength(2)
})

test('returns a blog with a propery named \'id\'', async () => {
  const response = await api.get('/api/blogs').expect(200)
  expect(response.body[0].id).toBeDefined()
})

test('a new blog can be added correctly', async () => {
  const userToken = await loginUser(users[0])

  const newBlog = {
    'title': 'Onion Championships',
    'author': 'Enoki Morel',
    'url': 'www.dirtguy.com',
    'likes': 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', userToken)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsFromDB = await Blog.find({})
  const blogs = blogsFromDB.map(blog => blog.toJSON())

  const expectedBlogCount = 3

  expect(blogs).toHaveLength(expectedBlogCount)

  const blogsNoId = blogs.map(x => {
    return {
      'title': x.title, 
      'author': x.author, 
      'url': x.url, 
      'likes': x.likes
    }
  })
  expect(blogsNoId).toContainEqual(
    newBlog
  )
}) 

test('a new blog will not be added without a user token', async () => {
  const newBlog = {
    'title': 'Onion Championships',
    'author': 'Enoki Morel',
    'url': 'www.dirtguy.com',
    'likes': 1
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
  expect(result.body.error).toContain('jwt must be provided')

  const blogsFromDB = await Blog.find({})
  const blogs = blogsFromDB.map(blog => blog.toJSON())

  const expectedBlogCount = 2
  expect(blogs).toHaveLength(expectedBlogCount)
}) 

test('a new blog will not be added with an incorrect token', async () => {
  const newBlog = {
    'title': 'Onion Championships',
    'author': 'Enoki Morel',
    'url': 'www.dirtguy.com',
    'likes': 1
  }

  const result = await api
    .post('/api/blogs')
    .set('Authorization', 'userToken')
    .send(newBlog)
    .expect(401)

  const blogsFromDB = await Blog.find({})
  const blogs = blogsFromDB.map(blog => blog.toJSON())

  const expectedBlogCount = 2
  expect(blogs).toHaveLength(expectedBlogCount)
}) 


test('a new blog with no likes will default to 0 likes', async () => {
  const userToken = await loginUser(users[0])

  const newBlog = {
    'title': 'Onion Championships',
    'author': 'Enoki Morel',
    'url': 'www.dirtguy.com',
  }

  await api
    .post('/api/blogs')
    .set('Authorization', userToken)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsFromDB = await Blog.find({})
  const blogs = blogsFromDB.map(blog => blog.toJSON())
  const postedBlog = blogs.reduce((a, c) => {
    if (c.title === newBlog.title) {
      return c
    }
  })
  expect(postedBlog.likes).toEqual(0)
}) 

test('a new blog with no title or url will return the status code 400 Bad Request', async () => {
  const userToken = await loginUser(users[0])

  const newBlog = {
    'title': 'Onion Championships',
    'author': 'Enoki Morel',
    'url': 'www.dirtguy.com',
    'likes': 0
  }
  const {title, ...noTitle} = newBlog
  const {url, ...noUrl} = newBlog

  await api
    .post('/api/blogs')
    .set('Authorization', userToken)
    .send(noTitle)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', userToken)
    .send(noUrl)
    .expect(400)
}) 

test('deleting a blog will remove the blog from the database', async () => {
  const userToken = await loginUser(users[0])

  const blogsAtStart = await Blog.find({})
  const blogs = blogsAtStart.map(blog => blog.toJSON())
  const blogToDelete = blogs[0]
 
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', userToken)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  const endBlogs = blogsAtEnd.map(blog => blog.toJSON())
  expect(endBlogs).not.toContain(blogToDelete)
})

test('updating a blog will change the blog as requested', async () => {
  const response = await api.get('/api/blogs')
  const updatedBlog = response.body[0]
  const user = updatedBlog.user
  updatedBlog.title += 1
  updatedBlog.author += 1
  updatedBlog.url += 1
  updatedBlog.likes += 1
  updatedBlog.user = user.id
  await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)
    .expect(updatedBlog)
  const allBlogs = await api.get('/api/blogs')
  const newBlog = allBlogs.body.reduce((a, c) => {
    return c.id === updatedBlog.id ? c.id : a
  })
  updatedBlog.user = user
  expect(newBlog).toEqual(updatedBlog)
})

afterAll(async () => {
  await mongoose.connection.close()
})