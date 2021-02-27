import { ObjectSchema } from 'yup'
import { Response } from 'express';
import { AppError } from '../helpers/Errors';

 async function validateSchema(schema: ObjectSchema<any>, dataToBeAnalized: any) {
	try {
		await schema.validate(dataToBeAnalized, {
			abortEarly: false
		})
	} catch(error) {
		throw new AppError(error.errors.join(', '))
	}
}


export { validateSchema }