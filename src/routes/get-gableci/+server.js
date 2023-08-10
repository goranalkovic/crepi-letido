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

		let output = {
			name: titleRaw?.innerText?.trim(),
			slug: titleRaw?.getAttribute('href')?.replace('https://gableci.hr/restoran', '').replaceAll('/', ''),
			meals: mealsRaw?.querySelectorAll('li.food-type')?.map((mealData) => {
				const rawPrice = mealData.querySelector('.cijena');

				if (!rawPrice) {
					return null;
				}

				const isVegetarian = mealData?.classList?.contains('food-type--vegetarijansko');
				const isVegan = mealData?.classList?.contains('food-type--vegetarijansko');

				return {
					name: mealData.querySelector('.naziv-jela')?.innerText?.trim(),
					price: rawPrice?.innerText?.trim(),
					meta: {
						isVegetarian : isVegetarian,
						isVegan: isVegan,
					}
				}
			}).filter(Boolean).filter(({ name, price }) => Boolean(name) && Boolean(price)),
			meta: {
				phone: metaRaw?.querySelector('.restoran__tel')?.innerText?.trim(),
				delivery: metaRaw?.querySelector('.restoran__delivery')?.innerText?.trim() ?? metaRaw?.querySelector('.restoran__legenda')?.innerText?.trim() ?? '',
			}
		}

		if (output.slug === 'coral-croatia') {
			output = {
				...output,
				meals: [
					...output.meals,
					{
						name: 'Nekaj z dodatne ponude',
						meta: {
							isVegetarian : false,
							isVegan: false,
						},
						isCustomItem: true,
					}
				],
				meta: {
					...output.meta,
					url: '/coral-dodatna-ponuda.pdf',
					urlType: 'additional',
				},
			};
		}

		if (output.slug === 'restoran-august') {
			output = {
				...output,
				meals: [
					...output.meals,
					{
						name: 'Nekaj z dodatne ponude',
						meta: {
							isVegetarian : false,
							isVegan: false,
						},
						isCustomItem: true,
					}
				],
				meta: {
					...output.meta,
					url: 'https://glovoapp.com/hr/hr/varazdin/restoran-august/',
					urlType: 'additional',
				},
			};
		}

		if (
			output.name?.length < 1
			|| output.slug?.length < 1
			|| output.meals?.length < 1
		) {
			return null;
		}

		return output;
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
				urlType: 'menu',
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
				urlType: 'menu',
			},
		},
	];

	return json({
		restaurants: [...restaurantData, ...additionalRestaurants].filter(Boolean),
		legend: {},
		veggieMeals: [],
	});
}
