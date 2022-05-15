const express = require('express');
const { basicRPC } = require('../../');

const app = express();

let users = []
let id = 0

app.use("/", basicRPC({
	users: {
		__index() {
			return [200, { count: users.length, users: users.slice(-10), nextId: id + 1 }]
		},
		create({ username, password }) {
			if (!username || !password) {
				return [400, { status: "Error", error: "username and password are required" }]
			}

			const user = { id: id++, username, password }
			users.push(user)

			return [200, { status: "Success", user }]
		},
		get({ id }) {
			if (id === undefined) {
				return [400, { status: "Error", error: "id is required" }]
			}

			id = parseInt(id)
			const user = users.find(user => user.id === id)
			if (!user) {
				return [404, { status: "Error", error: "User not found" }]
			}

			return [200, { status: "Success", user }]
		},
	}
}))

app.listen(3000, () => console.log("Listening on port 3000"))
