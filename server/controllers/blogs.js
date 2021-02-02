const jwt = require('jsonwebtoken')
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
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if( !token || !decodedToken.id ) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    
    if(!('title' in blog) || !('url' in blog)){
        response.status(400).end()
    }

    if(!('likes' in blog)){
        //console.log('add likes')
        blog.likes = 0
    }

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
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if( !token || !decodedToken.id ){
        return response.status(401).json({ error: 'token missing or invalid'})
    }

    user = await User.findById(decodedToken.id)
    blog = await Blog.findById(request.params.id)

    // trying to remove wrong user's blog
    if( blog.user._id.toString() !== user._id.toString() ){
        return response.status(401).json({ error: 'trying to remove wront persons blog' })
    }

    // remove from users blogs
    user.blogs = user.blogs.filter(b => b._id.toString !== blog._id.toString())
    // remove blog
    blog.delete()

    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter