import { Request, Response } from 'express';
import { IsNull, Not, getCustomRepository } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { AppError } from '../helpers/Errors';

class NpsController {

	async exec(request: Request, response: Response) {
		const { survey_id } = request.params

		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

		const surveysUsers = await surveysUsersRepository.find({
			survey_id,
			value : Not(IsNull())
		})

		const detractor = surveysUsers.filter(
			(survey) => survey.value >= 0 && survey.value <= 6
		).length

		const promoters = surveysUsers.filter(
			(survey) => survey.value >= 9 && survey.value <= 10
		).length

		const totalAnswers = surveysUsers.length
		const totalSum = (promoters - detractor)
		const isValidTotalSum = totalSum ? true : false

		if(!isValidTotalSum) {
			throw new AppError("Doesn't have any answered survey yet!")
		}

		const calculateNps = Number(
			(( totalSum / totalAnswers) * 100).toFixed(2)
		)

		return response.json({
			promoters,
			detractor,
			totalAnswers,
			nps: calculateNps
		})
	}
}

export { NpsController }