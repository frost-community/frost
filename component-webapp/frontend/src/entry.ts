/// <reference path="index.d.ts" />

import Vue from 'vue';
import app from './components/app.vue';

new Vue({
	el: '#app',
	components: { app },
	template: '<app />'
});

function selectLang(supportedLangs: string[], defaultLang: string): string {
	const langSources: string[] = [];
	if (window.navigator.language) {
		langSources.push(window.navigator.language);
	}
	if (window.navigator.languages) {
		langSources.push(...window.navigator.languages);
	}
	const langs = langSources.map(i => i.split('-')[0]);
	let result = defaultLang;
	for (const lang of supportedLangs) {
		if (langs.indexOf(lang) != -1) {
			result = lang;
			break;
		}
	}
	return result;
}

const supportedLangs = ["ja", "en"];
console.log(selectLang(supportedLangs, 'ja'));
