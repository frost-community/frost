<template>
<div class="container">
	<h1>Frost</h1>
	<div>
		<LoginForm />
		<RegisterForm />
	</div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LoginForm from '../parts/loginForm.vue';
import RegisterForm from '../parts/registerForm.vue';

@Component({ components: { LoginForm, RegisterForm } })
export default class extends Vue {

}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin: 0 auto;
	max-width: 34rem;

	h1 {
		margin: 1rem 2rem;
		font-size: 3.7rem;
	}

	> div {
		margin: 2rem 0;
		background-color: hsl(221, 39%, 8%);
		border-radius: 1em;
		box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.1);
	}
}
</style>
