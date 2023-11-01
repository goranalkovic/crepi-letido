// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request, locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		// The user is not signed in
		throw error(401, { message: 'Unauthorized' });
	}

	const data = await request.json();

	const date = new Date();
	const currentYear = date.getFullYear();
	const currentDay = date.getDate().toString().padStart(2, '0');
	const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
	const currentDate = `${currentYear}-${currentMonth}-${currentDay}`;

	const email = session?.user?.email;

	const { data: currentData } = await supabase
		.from('selections')
		.select()
		.eq('created_at', currentDate)
		.eq('email', email);

	if (currentData?.length > 0) {
		const { data: reqData, error: reqError } = await supabase
			.from('selections')
			.update({ selections: data })
			.eq('email', email)
			.eq('created_at', currentDate)
			.select();

		if (reqError) {
			throw error(500, reqError);
		}

		return json(reqData);
	} else {
		const { data: reqData, error: reqError } = await supabase
			.from('selections')
			.insert({
				email: email,
				selections: data,
				'created_at': currentDate,
			})
			.select();

		if (reqError) {
			throw error(500, reqError);
		}

		return json(reqData);
	}
};
