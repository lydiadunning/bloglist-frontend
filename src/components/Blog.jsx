import { useState } from "react"

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)

  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  const toggleVisibility = () => {
    setExpanded(!expanded)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
console.log(blog)

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility} style={hideWhenExpanded}>view</button>
      <section style={showWhenExpanded}>
        {blog.url}
        <br/>
        likes: {blog.likes} <button>like</button>
        <br/>
        {blog.user.username}
        <br/>
        <button onClick={toggleVisibility}>hide</button>
      </section>
    </div>  
  )
}


export default Blog