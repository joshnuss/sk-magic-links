import { db } from '$lib/db'

export async function get({ url }) {
	const { action, code } = decodeState(url.searchParams.get('state'))

	if (action == 'signup') {
		const registration = await db.registration.findUnique({
			where: { code }
		})

		if (!registration) {
			return {
				status: 401,
				body: { message: "Unknown code" }
			}
		}

		if ( registration.usedAt || registration.expiresAt < new Date()) {
			return {
				status: 406,
				body: { message: "Link is expired or has already been used." }
			}
		}

		await db.registration.update({
			where: { id: registration.id },
			data: { usedAt: new Date() }
		})

		const user = await db.user.create({
			data: {
				name: registration.name,
				email: registration.email,
				registeredAt: registration.createdAt
			}
		})

		return {
			status: 303,
			headers: {
				location: `/?message=user.created`
			}
		}
	} else if ( action == 'signin' ) {
		const user = await db.user.findUnique({
			where: { code }
		})

		if (!user) {
			return {
				status: 401,
				body: { message: "Unknown code" }
			}
		}

		if ( user.codeUsedAt || user.codeExpiresAt < new Date()) {
			return {
				status: 406,
				body: { message: "Link is expired or has already been used." }
			}
		}

		await db.user.update({
			where: { id: user.id },
			data: { codeUsedAt: new Date() }
		})

		return {
			status: 303,
			headers: {
				location: `/?message=user.signin`
			}
		}

	} else {
		return {
			status: 406,
			body: {
				message: "Unknown action"
			}
		}
	}
}

function decodeState(encoded) {
	const text = atob(encoded)

	return JSON.parse(text)
}
