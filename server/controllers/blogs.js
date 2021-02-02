const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map( blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user')
    if(blog){
        response.json(blog.toJSON())
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/', async (request, response) => {
    let blog = request.body
    
    if(!('title' in blog) || !('url' in blog)){
        response.status(400).end()
    }

    if(!('likes' in blog)){
        //console.log('add likes')
        blog.likes = 0
    }

    let user = await User.find({})
    user = user[0]
    blog.user = user._id

    blog = new Blog(blog)
    const savedBlog = await blog.save()
    console.log(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)
    console.log(user)
    await user.save()

    response.json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter