import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
	{ path: '/', component: () => import(/* webpackChunkName: "entrance" */ './pages/entrance.vue') },
	{ path: '/@:screenName', component: () => import(/* webpackChunkName: "user" */ './pages/user.vue') },
	{ path: '*', component: () => import(/* webpackChunkName: "notfound" */ './pages/notfound.vue') }
];

Vue.use(VueRouter);
export default new VueRouter({
	mode: 'history',
	routes: routes
});
