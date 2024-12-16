declare module 'promised-handlebars' {
	import type Handlebars from 'handlebars';

	const fn: (hb: typeof Handlebars) => typeof Handlebars;
	export = fn;
}
