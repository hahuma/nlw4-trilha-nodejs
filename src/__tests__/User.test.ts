import request from 'supertest'
import faker from 'faker'
import { app } from '../app'
import createConnection from '../database'

describe('Users', () => {
	let user: any

	beforeAll(async () => {
		const connection = await createConnection()
		await connection.runMigrations()

		user = {
			email: faker.internet.email(),
			name: faker.name.firstName()
		}
	})

	it('Should create a new user with given email and name', async () => {
		const response = await
			request(app)
				.post('/users')
				.send(user)

		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty('name')
		expect(response.body).toHaveProperty('email')
		expect(response.body).toHaveProperty('id')
		expect(response.body).toHaveProperty('created_at')
	})

	it('Should not create a user with the same email', async () => {
		const response = await
			request(app)
				.post('/users')
				.send(user)

		expect(response.status).toBe(400)
		expect(response.body.error).toBe('User already exists!')
	})
})