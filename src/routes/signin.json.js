import { nanoid } from 'nanoid'
import { add } from 'date-fns'
import { db } from '$lib/db'
import { sendMagicLink } from '$lib/magicLinks'

export async function post({ request }) {
	const body = await request.formData()
	const email = body.get('email')
	let user = await db.user.findUnique({ where: { email } })

	if (user) {
		user = await db.user.update({
			where: { id: user.id },
			data: {
				code: nanoid(),
				codeUsedAt: null,
				codeExpiresAt: add(new Date(), { minutes: 15 })
			}
		})

		await sendMagicLink(user, 'signin')
	}

	return {
		status: 200,
		body: {
			message: 'sent'
		}
	}
}
