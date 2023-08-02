// @ts-nocheck

import { json, fail, error as skError } from '@sveltejs/kit';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://yxnciwyqkkxjpixhaalc.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bmNpd3lxa2t4anBpeGhhYWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwMDUwNjIsImV4cCI6MjAwNjU4MTA2Mn0.djnee0zhdOT3D43sijLQtgy8nSnrCOl0YHWLTW7ZXmQ')

const tableName = 'selections';

export async function POST({ request }) {
	const data = await request.json();

	const { data: returnData, error } = await supabase
		.from(tableName)
		.upsert({ name: data.name, selections: data.selections })
		.select();

	if (error) {
		throw error;
	}

	return json(returnData);
}

export async function GET({ fetch }) {
	const restResponse = await fetch('/get-gableci');
	const restData = await restResponse.json();

	const { data, error } = await supabase
		.from(tableName)
		.select();

	if (error) {
		throw error;
	}

	return json({
		dbData: data,
		restData: restData,
	});
}