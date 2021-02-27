import { Request, Response } from 'express';
import { resolve } from 'path'
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';

import sendMailService from '../services/sendMailService'

import { AppError } from '../helpers/Errors';
import { sendMailSchema } from '../helpers/schemas';
import { validateSchema } from '../helpers/Validations';

class SendMailController {

	async exec(request: Request, response: Response) {

		await validateSchema(sendMailSchema, request.body)
		const {
			email,
			survey_id
		} = request.body

		const userRepository = getCustomRepository(UsersRepository)
		const surveyRepository = getCustomRepository(SurveysRepository)
		const surveyUserRepository = getCustomRepository(SurveysUsersRepository)

		const user = await userRepository.findOne({email})
		if(!user) {
			throw new AppError('User does not exists!')
		}
		const survey = await surveyRepository.findOne({id: survey_id})
		if(!survey) {
			throw new AppError('Survey does not exists!')
		}

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')
		const mailInfo = {
			name: user.name,
			id: '',
			title: survey.title,
			description: survey.description,
			subject: survey.title,
			link: process.env.URL_MAIL
		}

		const surveyUserAlreadyExists = await surveyUserRepository.findOne({
			where:
				[{
					user_id: user.id,
					survey_id,
					value: null
				}],
			relations: ['user', 'survey']
		})

		if(surveyUserAlreadyExists) {
			mailInfo.id = surveyUserAlreadyExists.id
			await sendMailService.exec(email, mailInfo, npsPath)
			return response.json(surveyUserAlreadyExists)
		}

		const surveyUser = await surveyUserRepository.create({user_id: user.id,survey_id})

		await surveyUserRepository.save(surveyUser)


		mailInfo.id = surveyUser.id
		await sendMailService.exec(email, mailInfo, npsPath)

		return response.status(201).json(surveyUser)
	}
}

export { SendMailController }