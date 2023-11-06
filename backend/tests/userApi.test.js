/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const supertest = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcryptjs')


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ name: 'Jeff Jefferson', username: 'root', password: passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    let users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())
    
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    users = await User.find({})
    const usersAtEnd = users.map(u => u.toJSON())
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    let users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    users = await User.find({})
    const usersAtEnd = users.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if the username is too short', async () => {
    let users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())
    
    const newUser = {
      username: 'Po',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('user validation failed: username: Path `username` (`Po`) is shorter than the minimum allowed length (3).')

    users = await User.find({})
    const usersAtEnd = users.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if the password is too short', async () => {
    let users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())
    console.log('usersAtStart', usersAtStart)

    const newUser = {
      username: 'Poblerone',
      name: 'Superuser',
      password: 'hi',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long' )

    users = await User.find({})
    const usersAtEnd = users.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails without a username', async () => {
    let users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())

    const newUser = {
      name: 'Superuser',
      password: 'password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('user validation failed: username: Path `username` is required.')

    users = await User.find({})
    const usersAtEnd = users.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails without a password', async () => {
    let users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())

    const newUser = {
      username: 'megaJeff',
      name: 'Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is required')

    users = await User.find({})
    const usersAtEnd = users.map(u => u.toJSON())
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})