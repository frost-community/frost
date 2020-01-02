<template>
	<router-view />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { credentialModule } from '../store';

@Component
export default class extends Vue {
	mounted() {
		credentialModule.loadAccessToken();
	}
}
</script>
