import { Router } from 'express'

import { UserController } from './controllers/UsersController'
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController'
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const userController = new UserController()
const surveyController = new SurveysController()
const sendMailController = new SendMailController()
const answerController = new AnswerController()
const npsController = new NpsController()

const routes = Router()

routes.post('/users', userController.create)
routes.post('/surveys', surveyController.create)
routes.get('/surveys',surveyController.show)

routes.post('/sendMail', sendMailController.exec)
routes.get('/answers/:value', answerController.exec)

routes.get('/nps/:survey_id', npsController.exec)

export { routes }