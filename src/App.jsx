import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import AddBlog from './components/AddBlog'
import Togglable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null) // message is an object: {text: String, isError: Boolean}

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({text: `${username} logged in`, isError: false})
      setTimeout(() => {
        setMessage(null)
      }, 5000)    
    } catch (exception) {
      setMessage({text: 'Wrong credentials', isError: true})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser', '')
    setUser(null)
    setMessage({text: `User logged out`, isError: false})
      setTimeout(() => {
        setMessage(null)
      }, 5000)  
  }

  const blogFormRef = useRef()
  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setMessage({text:`New Blog ${addedBlog.title} by ${addedBlog.author} added`, isError: false})
    } catch (exception) {
      setMessage({text: 'Error:Blog not added', isError: true})
      setTimeout(() => {
        setMessage(null)
      }, 5000)    
    }
  }

  const updateLikes = async (blogObject) => {
    console.log('blogObject', blogObject)
    try {
      const changedBlog = await blogService.update(blogObject.id, blogObject)
      console.log(changedBlog)
    } catch (exception) {
      setMessage({text: 'Error:Blog like not added', isError: true})
      setTimeout(() => {
        setMessage(null)
      }, 5000)    
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>      
    </div>
  )

  console.log('all blogs', blogs)
  return (
    <div>
      {message && <Notification message={message} />}

      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p><button onClick={handleLogout}>log out</button>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <AddBlog  createBlog={createBlog}/>
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
        )}
      </div>}
    </div>
  ) 
}

export default App