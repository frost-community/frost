/// <reference path="./@types/vue.d.ts" />

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/app.vue';
import routes from './routes';

console.log('frost');

const router = new VueRouter({
	mode: 'history',
	routes: routes
});

Vue.use(VueRouter);
new Vue({
	el: '#app',
	router,
	data() {
		return {
		};
	},
	components: { App },
	template: '<App />'
});
