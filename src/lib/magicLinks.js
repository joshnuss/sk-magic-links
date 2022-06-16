import { sendMail } from '$lib/mail'

export async function sendMagicLink(record, action) {
	const code = record.code
	const url = new URL("/magic", "http://localhost:3000")
	const state = encodeState({ action, code })

	url.searchParams.set('state', state)

	await sendMail(record.email, 'link', { url: url.toString() })
}

function encodeState(state) {
	const json = JSON.stringify(state)

	return btoa(json)
}
