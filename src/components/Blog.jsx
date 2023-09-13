import { useState } from "react"

const Blog = ({ blog, updateLikes }) => {
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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility} style={hideWhenExpanded}>view</button>
      <section style={showWhenExpanded}>
        {blog.url}
        <br/>
        likes: {likes} <button onClick={addLike}>like</button>
        <br/>
        {blog.user.name}
        <br/>
        <button onClick={toggleVisibility}>hide</button>
      </section>
    </div>  
  )
}


export default Blog