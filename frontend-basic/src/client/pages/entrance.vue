<template>
	<div>
		<p>entrance</p>
		<div v-if="isLoggedIn">
			<p>logged in</p>
		</div>
		<session-form v-else></session-form>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { credentialModule } from '../store';
import sessionForm from '../components/sessionForm.vue';

@Component({ components: { sessionForm } })
export default class extends Vue {
	get isLoggedIn() {
		return credentialModule.accessToken != null;
	}
}
</script>

<style lang="scss" scoped>

</style>
