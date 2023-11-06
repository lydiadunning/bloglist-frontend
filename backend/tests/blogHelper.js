const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createUsers = async () => {
  await User.deleteMany({})

  const initialUsers = [
    { 
      name: 'Jeff Jefferson', 
      username: 'root', 
      passwordHash: await bcrypt.hash('sekret', 10) 
    },
    {
      name: 'Susan Coop',
      username: 'The Susan',
      passwordHash: await bcrypt.hash('password123', 10)
    }
  ]

  const userObjects = initialUsers
    .map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  return await Promise.all(promiseArray)

}

const getAllUsers = async () => {
  const users = await User.find({})
  return users.map(user => {
    return {
      username: user.username,
      id: user._id, 
      password: user.passwordHash
    }
  })
}

const loginUser = async (user) => {
  const userForToken = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(
    userForToken,
    // eslint-disable-next-line no-undef
    process.env.SECRET,
    { expiresIn: 60*60 }
  )
  return 'Bearer ' + token
}

const getUserId = async (user) => {
  return await User.findById(user.id)
}

module.exports = {
  createUsers,
  getAllUsers,
  loginUser,
  getUserId
}