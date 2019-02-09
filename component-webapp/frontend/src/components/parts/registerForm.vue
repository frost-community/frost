<template>
<div class="register-form">
	<h1>アカウントを登録</h1>
	<h2>username</h2>
	<div><input type="text" /></div>
	<h2>password</h2>
	<div><input type="password" /></div>
	<div class="register-button-outer"><button @click="register">登録</button></div>
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

	register() {
		console.log('register requested');
	}

}
</script>

<style lang="scss" scoped>
.register-form {
	margin: 3.5rem;

	h1 {
		font-size: 2rem;
	}

	h2 {
		font-size: 1.8rem;
		margin-bottom: 0.5rem;
	}

	input {
		font-size: 1.6rem;
	}

	.register-button-outer {
		display: flex;

		button {
			margin-left: auto;
		}
	}
}
</style>
