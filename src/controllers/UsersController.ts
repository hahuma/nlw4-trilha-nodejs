import { Request, Response } from 'express'
import { getRepository } from 'typeorm'

import User from '../models/User'

class UserController {
	async create(request: Request, response: Response) {
		try {
			const {
				name,
				email
			} = request.body

			const userRepository = getRepository(User)

			const hasUser = await userRepository.findOne({ email })
			if(hasUser) {
				return response.status(400).json({
					error: "User already exists!"
				})
			}

			const user = userRepository.create({
				name,
				email
			})

			await userRepository.save(user)

			return response.json(user)
		} catch(error) {
			return response.status(500).json({
				error: error.message
			})
		}
	}
}

export { UserController }