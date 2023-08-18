// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		// The user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}

	const { data, reqError } = await supabase
		.from('selections')
		.select()
		.eq('email', session?.user?.email)
		.limit(1);

	if (reqError) {
		throw error(500, reqError);
	}

	return json(data);

};
