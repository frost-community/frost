///<reference path="./vue.d.ts" />

import Vue from 'vue';
import store from './store';
import router from './router';
import App from './components/app.vue';

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});
