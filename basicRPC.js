const express = require('express');

module.exports = function basicRPC(rpcObject) {
	const router = express.Router()
	router.use(express.json())
	router.use(express.urlencoded({ extended: true }))

	router.get("/", (req, res) => {
		if (Object.hasOwn(rpcObject, "__index")) {
			const args = { ...req.query, ...req.body }
			const [status, result] = rpcObject.__index(args, req, res)
			return res.status(status).json(result)
		} else {
			return res.status(200).json(Object.keys(rpcObject))
		}
	})

	router.all("/:rpcPath", (req, res) => {
		let targetProcedure = req.params.rpcPath.split(".").reduce((target, path) => target?.[path], rpcObject)
		if (!targetProcedure) return res.status(404).send({ status: "Error", error: "Procedure not found" })

		if (typeof targetProcedure === "object") {
			if (Object.hasOwn(targetProcedure, "__index")) {
				targetProcedure = targetProcedure.__index
			} else {
				return res.status(200).json(Object.keys(targetProcedure))
			}
		}

		if (typeof targetProcedure === "function") {
			const args = { ...req.query, ...req.body }
			const [status, result] = targetProcedure(args, req, res)
			return res.status(status).json(result)
		}

		res.status(404).send({ status: "Error", error: "Procedure not found" })
	})

	return router
}
