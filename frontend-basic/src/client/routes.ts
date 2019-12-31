import { RouteConfig } from 'vue-router';

import entrance from './pages/entrance.vue';
import notFound from './pages/notfound.vue';

const routes: RouteConfig[] = [
	{ path: '/', component: entrance },
	{ path: '*', component: notFound }
];
export default routes;
