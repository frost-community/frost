<template>
	<div>
		<input type="text" placeholder="username" v-model="username">
		<input type="password" placeholder="password" v-model="password">
		<button @click="login()">login</button>
		<button @click="register()">register</button>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { credentialModule } from '../store';
import { callApi, IError, isError } from '../misc/api';
import { ISession, isSession } from '../misc/session';

@Component
export default class extends Vue {
	// data
	username = '';
	password = '';

	// methods
	async register() {
		const res = await callApi('/session/register', {
			screenName: this.username,
			password: this.password
		});
		console.log(res);
	}
	async login() {
		const res: ISession | IError = await callApi('/session', {
			screenName: this.username,
			password: this.password
		});
		if (isError(res)) {
			console.log('login error:', res.error.reason);
		}
		else if (isSession(res)) {
			console.log('login success:', res);
			credentialModule.setAccessToken(res.accessToken);
			credentialModule.saveAccessToken();
		}
		else {
			console.log('unknown response');
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
