import { Router } from 'express'

import { UserController } from './controllers/UsersController'
import { SurveysController } from './controllers/SurveysController';

const userController = new UserController()
const surveyController = new SurveysController()

const routes = Router()

routes.post('/users', userController.create)
routes.post('/surveys', surveyController.create)
routes.get('/surveys', surveyController.show)

export { routes }