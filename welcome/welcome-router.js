const express = require("express")
const welcome = express.Router()

welcome.get("/", (req, res) => {
	res.json({
		message: "Welcome to our API of Lord of The Rings quotes",
	})
})

module.exports = welcome