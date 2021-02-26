import { Router } from 'express'

import { UserController } from './controllers/UsersController'
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController'

const userController = new UserController()
const surveyController = new SurveysController()
const sendMailController = new SendMailController()

const routes = Router()

routes.post('/users', userController.create)
routes.post('/surveys', surveyController.create)
routes.get('/surveys', surveyController.show)

routes.post('/sendMail', sendMailController.exec)

export { routes }