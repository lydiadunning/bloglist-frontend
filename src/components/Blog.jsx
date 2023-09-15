import { useState } from "react"
import PropTypes from 'prop-types'


const Blog = ({ blog, updateLikes, deleteById, isActiveUser }) => {
  const [expanded, setExpanded] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  const toggleVisibility = () => {
    setExpanded(!expanded)
  }

  const addLike = () => {
    const currentLikes = likes + 1
    updateLikes({
      user: blog.user.id,
      likes: currentLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    })
    setLikes(currentLikes)
  }

  const deleteBlog = () => {
    const confirmation = window.confirm(`Removing ${blog.title} by ${blog.author}.`)
    if (confirmation) {
      deleteById(blog.id, blog.title)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const expandable = () => {
    return (
      <section /*style={showWhenExpanded}*/ id='expanded'>
        {blog.url}
        <br/>
        <p id='likes'>likes: {likes} <button onClick={addLike}>like</button></p>
        <br/>
        {blog.user.name}
        <br/>
        {isActiveUser && <button onClick={deleteBlog}>remove</button>}
      </section>
    )
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title + ' - '} 
      {blog.author} 
      <button onClick={toggleVisibility} style={hideWhenExpanded} id='view'>view</button>   
      <button onClick={toggleVisibility} style={showWhenExpanded} id='hide'>hide</button>
      {expanded && expandable()}

    </div>  
  )
}
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteById: PropTypes.func.isRequired
}

export default Blog