<template>
<div class="login-form">
	<h1>アカウントにログイン</h1>
	<h2>username</h2>
	<div><input type="text" /></div>
	<h2>password</h2>
	<div><input type="password" /></div>
	<div class="login-button-outer"><button @click="login">ログイン</button></div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ })
export default class extends Vue {
/*
	@Prop(String)
	titleText!: string;

	number: number = this.random();

	random(): number {
		return Math.round(Math.random() * 100);
	}
*/

	login() {
		console.log('login requested');
	}

}
</script>

<style lang="scss" scoped>
.login-form {
	margin: 3.5rem;

	h1 {
		font-size: 2.3rem;
	}

	h2 {
		font-size: 2.1rem;
		margin-bottom: 0.5rem;
	}

	input {
		font-size: 1.6rem;
	}

	.login-button-outer {
		display: flex;

		button {
			margin-left: auto;
		}
	}
}
</style>
