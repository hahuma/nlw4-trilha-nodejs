import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import { SurveysRepository } from '../repositories/SurveysRepository'
import { validateSchema } from '../helpers/Validations'
import { surveySchema } from '../helpers/schemas';

class SurveysController {
	async create(request: Request, response: Response) {

		await validateSchema(surveySchema, request.body)

		const {
			title,
			description
		} = request.body

		const surveysRepository = getCustomRepository(SurveysRepository)

		const survey = surveysRepository.create({
			title,
			description
		})

		await surveysRepository.save(survey)

		return response.status(201).json(survey)
	}

	async show(request: Request, response: Response ) {
		const surveysRepository = getCustomRepository(SurveysRepository)

		const surveys = await surveysRepository.find()

		return response.json(surveys)
	}
}

export { SurveysController }