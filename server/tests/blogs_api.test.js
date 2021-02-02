const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects
        .map(blog => blog.save())
    await Promise.all(promiseArray)
})


test('GET returns all blogs', async () => {
    const returned = await api.get('/api/blogs')

    expect(returned.body).toHaveLength(helper.initialBlogs.length)
})

test('returns .id and not ._id', async () => {
    const returned = await api.get('/api/blogs')
    for (let i = 0; i < returned.body.length; i++) {
        expect(returned.body[i].id).toBeDefined()
    }
})

test('adding valid blog works', async () => {
    const new_blog = {
        title: "Canonical string increase",
        author: "Edsger W. Dijkstra",
        url: "google.com",
        likes: 1,
    }
    await api
        .post('/api/blogs')
        .send(new_blog)
        .set({ Authorization: helper.token})
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('invalid blog is not added', async () => {
    const new_blog = new Blog({
        title: "Canonical string increase",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 0
    })
    await api
        .post('/api/blogs')
        .send(new_blog)
        .set({ Authorization: helper.token})
        .expect(400)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('when .likes is not given its value is 0', async () => {
    const new_blog = {
        title: "Canonical string increase",
        author: "Edsger W. Dijkstra",
        url: "google.com"
    }

    await api
        .post('/api/blogs')
        .send(new_blog)
        .set({ Authorization: helper.token})
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = await Blog.find({})
    saved_blog = blogs.find(blog => blog.title === new_blog.title)
    expect(saved_blog.likes).toBe(0)
})

test('server returnes 400 when new blog doesnt havve title OR author', async () => {
    const new_blog = new Blog({
        title: "Canonical string increase",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 0
    })
    await api
        .post('/api/blogs')
        .send(new_blog)
        .set({ Authorization: helper.token})
        .expect(400)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

test('cant add blog without correct token', async () => {
    const new_blog = new Blog({
        title: "Canonical string increase",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 0
    })
    await api
        .post('/api/blogs')
        .send(new_blog)
        .expect(401)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(() => {
    mongoose.connection.close()
})