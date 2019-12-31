<template>
	<div>
		<p>entrance</p>
		<input type="text" placeholder="username" v-model="username">
		<input type="password" placeholder="password" v-model="password">
		<button @click="login()">login</button>
		<button @click="register()">register</button>
	</div>
</template>

<script lang="ts">
import callApi from '../misc/callApi';
import Vue from 'vue';

export default Vue.extend({
	data() {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		async register() {
			const res = await callApi('/session/register', {
				screenName: this.username,
				password: this.password
			});
			console.log(res);
		},
		async login() {
			const res = await callApi('/session', {
				screenName: this.username,
				password: this.password
			});
			console.log(res);
		}
	}
});
</script>

<style lang="scss" scoped>

</style>
