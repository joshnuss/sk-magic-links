import { nanoid } from 'nanoid'
import { add } from 'date-fns'
import { db } from '$lib/db'
import { sendMagicLink } from '$lib/magicLinks'

export async function post({ request }) {
	const body = await request.formData()
	const name = body.get('name')
	const email = body.get('email')
	const user = await db.user.findUnique({ where: { email } })

	if (user) {
		return {
			status: 422,
			body: { message: 'User already exists' }
		}
	}

	const registration = await db.registration.create({
		data: {
			name,
			email,
			code: nanoid(),
			expiresAt: add(new Date(), { minutes: 15 })
		}
	})

	await sendMagicLink(registration, 'signup')

	return {
		status: 200,
		body: {
			message: 'sent'
		}
	}
}
