import nodemailer, { Transporter } from 'nodemailer'
import handlebars from 'handlebars'
import { readFileSync } from 'fs'

interface MailInfo {
	name: string
	title: string
	description: string
	subject: string
}

class SendMailService {
	private client: Transporter

	constructor() {
		nodemailer.createTestAccount().then(account => {
			const transporter = nodemailer.createTransport({
	        	host: account.smtp.host,
	        	port: account.smtp.port,
	        	secure: account.smtp.secure,
	        	auth: {
	            	user: account.user,
	            	pass: account.pass
	        	}
	    	});

	    	this.client = transporter
		})
	}

	async exec(to: string, mailInfo: MailInfo, path: string) {
		const templateFileContent = readFileSync(path).toString('utf-8')

		const mailTemplateParse = handlebars.compile(templateFileContent)
		const html = mailTemplateParse(mailInfo)
		const message = await this.client.sendMail({
			to,
			from: 'NPS <noreply@nps.com.br>',
			subject: mailInfo.subject,
			html
		})

		console.log('Message sent: %s', message.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
	}
}

export default new SendMailService()