const express = require("express")
const welcomeRouter = require("./welcome/welcome-router")
const postsRouter = require("./posts/posts-router")

const server = express()
const port = 3050

server.use(express.json())
server.use(welcomeRouter)
server.use(postsRouter)

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
