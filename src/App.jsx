import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState(null)

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
    } catch (exception) {
      console.log('Wrong Credentials')
      // setErrorMessage('Wrong credentials')
      // setTimeout(() => {
      //   setErrorMessage(null)
      // }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser', '')
    setUser(null)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
      
    try {
      const addedBlog = await blogService.create({
        'title': title,
        'author': author,
        'url': url
      })
      setBlogs(blogs.concat(addedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.log('Adding Blog failed')
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

  return (
    <div>
      {!user && loginForm()}
      {user && <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p><button onClick={handleLogout}>log out</button>
        <h2>Create new</h2>
        <form onSubmit={handleAddBlog}>
        <div>
          title
            <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
            <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
            <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>      
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>}
    </div>
  ) 
}

export default App