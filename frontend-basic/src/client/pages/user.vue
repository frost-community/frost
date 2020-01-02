<template>
	<div>
		<h1>User page</h1>
		<p>Welcome. {{ $route.params.screenName }}</p>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class extends Vue {

}
</script>

<style lang="scss" scoped>

</style>
