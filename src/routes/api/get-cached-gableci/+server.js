// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export const GET = async ({ locals: { supabase } }) => {
	const { data: existingData, error: reqError } = await supabase.from('gablec-data').select().order('id', { ascending: false }).limit(1).maybeSingle();

	if (reqError) {
		throw error(500, reqError);
	}

	return json(existingData);
};
