export async function get({ url, request }) {
	const state = JSON.parse(atob(url.searchParams.get('state')))

	return {
		body: state
	}
}
