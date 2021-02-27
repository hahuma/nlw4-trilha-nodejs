import * as yup from 'yup'

const userSchema = yup.object().shape({
	name: yup.string().required(),
	email: yup.string().required()
})

const surveySchema = yup.object().shape({
	title: yup.string().required(),
	description: yup.string().required()
})

const sendMailSchema = yup.object().shape({
	email: yup.string().required(),
	survey_id: yup.string().required()
})

export {
	userSchema,
	surveySchema,
	sendMailSchema
 }