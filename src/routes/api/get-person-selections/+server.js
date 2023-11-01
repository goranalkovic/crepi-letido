// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		// The user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}

	const date = new Date();
	const currentYear = date.getFullYear();
	const currentDay = date.getDate().toString().padStart(2, '0');
	const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
	const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

	const { data, reqError } = await supabase
		.from('selections')
		.select()
		.eq('email', session?.user?.email)
		.eq('created_at', currentDate)
		.limit(1)
		.maybeSingle();

	if (reqError) {
		throw error(500, reqError);
	}

	return json(data);

};
