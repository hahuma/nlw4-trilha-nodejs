import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'

class UserController {
	async create(request: Request, response: Response) {
		try {
			const {
				name,
				email
			} = request.body

			const userRepository = getCustomRepository(UsersRepository)

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

			return response.status(201).json(user)
		} catch(error) {
			console.log(error)
			return response.status(500).json({
				error: error.message
			})
		}
	}
}

export { UserController }