let _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0)
        return 0

    let likes = 0
    for(let i=0; i<blogs.length; i++){
        likes += blogs[i].likes
    }
    return likes
}

const favoriteBlog = (blogs) => {
    most_likes = Math.max.apply(Math, blogs.map(blog => blog.likes))
    result = blogs.filter(blog => blog.likes === most_likes)
    return result[0]
}

const mostBlogs = (blogs) => {
    popular = {author: '', blogs: 0}
    authors = []

    blogs.forEach(blog => {
        let found = authors.findIndex(author => author.author === blog.author)
        if(found !== -1){
            authors[found].blogs += 1
        } else {
            new_author = {
                author: blog.author,
                blogs: 1
            }
            authors= [_.cloneDeep(authors), new_author]
        }
        found = authors.findIndex(author => author.author === blog.author)
        //console.log('found:',found)

        if(authors[found].blogs > popular.blogs){
            popular = {
                author: blog.author,
                blogs: authors[found].blogs
            }
        }
        //console.log(popular)
        //console.log(authors)
    })
    return popular
}

const mostLikes = (blogs) => {
    popular = {author: '', likes: 0}
    authors = []

    blogs.forEach(blog => {
        let found = authors.findIndex(author => author.author === blog.author)
        if(found !== -1){
            authors[found].likes += blog.likes
        } else {
            new_author = {
                author: blog.author,
                likes: blog.likes
            }
            authors= [_.cloneDeep(authors), new_author]
        }
        found = authors.findIndex(author => author.author === blog.author)
        //console.log('found:',found)

        if(authors[found].likes > popular.likes){
            popular = {
                author: blog.author,
                likes: authors[found].likes
            }
        }
        //console.log(popular)
        //console.log(authors)
    })
    return popular
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}