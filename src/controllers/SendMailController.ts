import { Request, Response } from 'express';
import { resolve } from 'path'
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';

import sendMailService from '../services/sendMailService'

class SendMailController {

	async exec(request: Request, response: Response) {
		const {
			email,
			survey_id
		} = request.body

		const userRepository = getCustomRepository(UsersRepository)
		const surveyRepository = getCustomRepository(SurveysRepository)
		const surveyUserRepository = getCustomRepository(SurveysUsersRepository)

		const user = await userRepository.findOne({email})
		if(!user) {
			return response.status(400).json({
				error: 'User does not exists!'
			})
		}
		const survey = await surveyRepository.findOne({id: survey_id})
		if(!survey) {
			return response.status(400).json({
				error: 'Survey does not exists!'
			})
		}

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')
		const mailInfo = {
			name: user.name,
			user_id: user.id,
			title: survey.title,
			description: survey.description,
			subject: survey.title,
			link: process.env.URL_MAIL
		}

		const surveyUserAlreadyExists = await surveyUserRepository.findOne({
			where:[{user_id: user.id}, {value: null}],
			relations: ['user', 'survey']
		})

		if(surveyUserAlreadyExists) {
			await sendMailService.exec(email, mailInfo, npsPath)
			return response.json(surveyUserAlreadyExists)
		}

		const surveyUser = await surveyUserRepository.create({user_id: user.id,survey_id})

		await surveyUserRepository.save(surveyUser)

		await sendMailService.exec(email, mailInfo, npsPath)

		return response.status(201).json(surveyUser)
	}
}

export { SendMailController }