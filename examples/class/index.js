const express = require('express');
const { classRPC } = require('../../');

const app = express();

class UserRPC {
	constructor() {
		this.users = []
		this.id = 0
	}

	__index() {
		return [200, { count: this.users.length, users: this.users.slice(-10), nextId: this.id + 1 }]
	}

	create({ username, password }) {
		if (!username || !password) {
			return [400, { status: "Error", error: "username and password are required" }]
		}

		const user = { id: this.id++, username, password }
		this.users.push(user)

		return [200, { status: "Success", user }]
	}

	get({ id }) {
		if (id === undefined) {
			return [400, { status: "Error", error: "id is required" }]
		}

		id = parseInt(id)
		const user = this.users.find(user => user.id === id)
		if (!user) {
			return [404, { status: "Error", error: "User not found" }]
		}

		return [200, { status: "Success", user }]
	}
}

app.use("/", classRPC({
	users: UserRPC
}))

app.listen(3000, () => console.log("Listening on port 3000"))
