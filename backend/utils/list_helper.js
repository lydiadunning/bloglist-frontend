// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((a, c) => {
    return a + c.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return -1

  return blogs.reduce((a, c) => {
    return c.likes > a.likes 
      ? {
        title: c.title,
        author: c.author,
        likes: c.likes
      }
      : a
  }, {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes
  })

}

// returns the author with the most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return -1

  const counts = blogs.reduce((a, c) => {
    const index = a.findIndex(x => x.author === c.author)

    if (index >= 0) {
      return a.toSpliced(index, 1, {
        author: c.author,
        blogs: a[index].blogs + 1
      })
    } else {
      return  [...a, {
        author: c.author,
        blogs: 1
      }]
    }
  }, [])

  return counts.reduce((a, c) => {
    return c.blogs > a.blogs ? c : a
  }, {
    author: 'default',
    blogs: 0
  })
}

// returns the author whose blogs have the most likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) return -1

  const likes = blogs.reduce((a, c) => {
    const index = a.findIndex(x => x.author === c.author)

    if (index >= 0) {
      return a.toSpliced(index, 1, {
        author: c.author,
        likes: a[index].likes + c.likes
      })
    } else {
      return  [...a, {
        author: c.author,
        likes: c.likes
      }]
    }
  }, [])

  return likes.reduce((a, c) => {
    return c.likes > a.likes ? c : a
  }, {
    author: 'default',
    likes: 0
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}