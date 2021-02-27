import request from 'supertest'
import faker from 'faker'
import { app } from '../app'
import createConnection from '../database'

describe('Surveys', () => {
	beforeAll(async () => {
		const connection = await createConnection()
		await connection.runMigrations()
	})

	afterAll(async () => {
		const connection = await createConnection()
		connection.dropDatabase()
		connection.close()
	})

	it('Should create a new user with given email and name', async () => {
		const survey = {
			title: faker.lorem.sentence(),
			description: faker.lorem.sentences(2)
		}

		const response = await
			request(app)
				.post('/surveys')
				.send(survey)

		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty('id')
		expect(response.body).toHaveProperty('title')
		expect(response.body).toHaveProperty('description')
		expect(response.body).toHaveProperty('created_at')
	})

	it('Should list all surveys', async ()  => {
		const survey = {
			title: faker.lorem.sentence(),
			description: faker.lorem.sentences(2)
		}

		await request(app)
				.post('/surveys')
				.send(survey)


		const response = await request(app).get('/surveys')

		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(2)
	})
})
