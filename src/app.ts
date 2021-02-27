import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'

import createConnection from './database'
import { routes } from './routes'

import { AppError } from './helpers/Errors';

createConnection()
const app = express()

app.use(express.json())
app.use(routes)

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
	if(err instanceof AppError) {
		return response.status(err.status).json({
			error: err.message
		})
	}else {
		return response.status(500).json({
			status: "Error",
			message: err.message
		})
	}
})


export { app }