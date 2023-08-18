// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		// The user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}

	const date = new Date().toISOString().split('T')[0];

	const { data, error: reqError } = await supabase
		.from('selections')
		.delete()
		.neq('created_at', date);

	if (reqError) {
		throw error(500, reqError);
	}

	return json({ data });
};
