// const http = require('http')
const config = require('./utils/config')

const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const express = require('express')
const app = express()
const mongoose = require('mongoose')

const cors = require('cors')
const logger = require('./utils/logger')
const bodyParser = require('body-parser')
const middleware = require('./utils/middleware')

mongoose
    .connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app