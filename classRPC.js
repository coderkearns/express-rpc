const express = require('express');

module.exports = function classRPC(rpcClasses = {}) {
	const router = express.Router()
	router.use(express.json())
	router.use(express.urlencoded({ extended: true }))

	const rpcObject = {}
	for (const [rpcName, rpcClass] of Object.entries(rpcClasses)) {
		rpcObject[rpcName] = new rpcClass()
	}

	router.get("/", (req, res) => {
		if (Object.hasOwn(rpcObject, "__index")) {
			const args = { ...req.query, ...req.body }
			const [status, result] = rpcObject.__index(args, req, res)
			return res.status(status).json(result)
		} else {
			return res.status(200).json(Object.keys(rpcObject))
		}
	})

	// Index
	router.all("/:rpcPath([A-Za-z0-9_]+)", (req, res) => {
		if (!rpcObject[req.params.rpcPath]) return res.status(404).send({ status: "Error", error: "Procedure not found" })

		if (typeof rpcObject[req.params.rpcPath].__index === "function") {
			const args = { ...req.query, ...req.body }
			const [status, result] = rpcObject[req.params.rpcPath].__index(args, req, res)
			return res.status(status).json(result)
		} else {
			return res.status(200).json(Object.keys(rpcObject[req.params.rpcPath]))
		}
	})

	// Call
	router.all("/:rpcPath", (req, res) => {
		const [rpcClass, rpcMethod] = req.params.rpcPath.split(".")
		if (!rpcObject[rpcClass]) return res.status(404).send({ status: "Error", error: "Procedure not found" })
		if (!rpcObject[rpcClass][rpcMethod]) return res.status(404).send({ status: "Error", error: "Procedure not found" })

		const args = { ...req.query, ...req.body }
		const [status, result] = rpcObject[rpcClass][rpcMethod](args, req, res)
		return res.status(status).json(result)
	})

	return router
}
