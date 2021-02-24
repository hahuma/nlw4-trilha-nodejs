import { Router } from 'express'

import { UserController } from './controllers/UsersController'

const userController = new UserController()

const routes = Router()

routes.post('/users', userController.create)

export { routes }