declare module 'handlebars-async-helpers' {
	import type Handlebars from 'handlebars';

	const fn: (hb: typeof Handlebars) => typeof Handlebars;
	export = fn;
}
