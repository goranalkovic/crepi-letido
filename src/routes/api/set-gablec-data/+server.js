// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		// The user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}

	const data = await request.json();

	const { data: returnData, reqError } = await supabase
		.from('selections')
		.upsert({ email: session?.user?.email, selections: data });

	if (reqError) {
		throw error(500, reqError);
	}

	return json(returnData);
};
