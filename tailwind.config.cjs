const flowbite = require('flowbite/plugin');
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config}*/
const config = {
	// content: ['./src/**/*.{html,js,svelte,ts}'],
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	darkMode: 'class',

	theme: {
		extend: {
			fontFamily: {
				'sans': ['Signika', ...defaultTheme.fontFamily.sans],
				'display': ['Handjet', ...defaultTheme.fontFamily.sans],
			},
			gridTemplateColumns: {
				'fill-96': 'repeat(auto-fill, minmax(24rem, 1fr))',
				// etc.
			},
			// Flowbite
			colors: {
				primary: {
					50: "#EEF2FF",
					100: "#E0E7FF",
					200: "#C7D2FE",
					300: "#A5B4FC",
					400: "#818CF8",
					500: "#6366F1",
					600: "#4F46E5",
					700: "#4338CA",
					800: "#3730A3",
					900: "#312E81",
				}
			},
		}
	},

	plugins: [flowbite]
};

module.exports = config;
