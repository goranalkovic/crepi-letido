// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase, getSession } }) => {
	// const session = await getSession();

	// if (!session) {
	// 	// The user is not signed in
	// 	throw error(401, { message: 'Unauthorized' });
	// }

	const { data: existingData, error: reqError } = await supabase.from('users').select();

	if (reqError) {
		throw error(500, reqError);
	}

	return json(existingData);
};
