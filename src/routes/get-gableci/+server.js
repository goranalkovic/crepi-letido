// @ts-nocheck

import { json } from '@sveltejs/kit';
import { parse } from 'node-html-parser';

export async function GET() {
	const url = "https://gableci.hr/vz/";

	const document = await fetch(url);
	const rawDocument = await document.text();

	const root = parse(rawDocument, {
		lowerCaseTagName: false,
		comment: false,
		voidTag: {
			tags: ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'],
			closingSlash: true,
		},
		blockTextElements: {
			script: true,
			noscript: true,
			style: true,
			pre: true,
		}
	});

	const allRestaurantElements = root.querySelectorAll('.restoran');

	const restaurantData = allRestaurantElements.map((restaurant) => {
		const titleRaw = restaurant.querySelector('.main-restoran-title');
		const mealsRaw = restaurant.querySelector('ul.list-jela');
		const metaRaw = restaurant.querySelector('.restoran__meta');

		const cijenaRaw = mealData.querySelector('.cijena');

		if (!cijenaRaw) {
			return null;
		}

		const output = {
			name: titleRaw?.innerText.trim(),
			slug: titleRaw?.getAttribute('href')?.replace('https://gableci.hr/restoran', '').replaceAll('/', ''),
			meals: mealsRaw?.querySelectorAll('li.food-type').map((mealData) => {
				return {
					name: mealData.querySelector('.naziv-jela')?.innerText.trim(),
					price: cijenaRaw?.innerText.trim(),
				}
			}).filter(({ name, price }) => Boolean(name) && Boolean(price)),
			meta: {
				phone: metaRaw?.querySelector('.restoran__tel')?.innerText.trim(),
				delivery: metaRaw?.querySelector('.restoran__delivery')?.innerText?.trim() ?? metaRaw?.querySelector('.restoran__legenda')?.innerText?.trim() ?? '',
			}
		}

		if (
			output.name?.length < 1
			|| output.slug?.length < 1
			|| output.meals?.length < 1
		) {
			return null;
		}

		return output.filter(Boolean);
	});

	const additionalRestaurants = [
		{
			name: 'Restoran Bedem',
			slug: 'restoran-bedem-ext',
			meals: [
				{ name: 'Meni 1' },
				{ name: 'Meni 2' },
				{ name: 'Meni 3' },
				{ name: 'Meni 4 (ako je dostupan)' },
			],
			meta: {
				url: 'http://bedem-varazdin.com/jelovnik/',
				delivery: 'D',
			}
		},
		{
			name: 'Restoran Garestin',
			slug: 'restoran-garestin-ext',
			meals: [
				{ name: 'Meni 1' },
				{ name: 'Meni 2' },
				{ name: 'Meni 3' },
				{ name: 'Meni 4' },
			],
			meta: {
				url: 'https://gastrocom-ugostiteljstvo.com/tjedna-ponuda-restorana-garestin/',
				delivery: 'G',
			},
		},
		{
			name: 'Ke god hoćeš',
			slug: 'custom-order',
			meals: [
				{ name: 'Odaberi me' },
			],
			meta: {
				delivery: 'Kegod',
			},
		},
	];

	return json({
		restaurants: [...restaurantData, ...additionalRestaurants],
		legend: {},
		veggieMeals: [],
	});
}
