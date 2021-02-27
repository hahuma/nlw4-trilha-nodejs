import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { UsersRepository } from '../repositories/UsersRepository'
import { validateSchema } from '../helpers/Validations'
import { userSchema } from '../helpers/schemas'
import { AppError } from '../helpers/Errors'

import * as yup from 'yup'

class UserController {
	async create(request: Request, response: Response) {

		await validateSchema(userSchema, request.body)

		const {
			name,
			email
		} = request.body


		const userRepository = getCustomRepository(UsersRepository)

		const hasUser = await userRepository.findOne({ email })
		if(hasUser) {
			throw new AppError("User already exists!")
		}

		const user = userRepository.create({
			name,
			email
		})

		await userRepository.save(user)

		return response.status(201).json(user)
	}
}

export { UserController }