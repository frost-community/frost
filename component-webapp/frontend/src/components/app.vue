<template>
<div>
	<EntrancePage />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EntrancePage from './pages/entrance.vue';

@Component({ components: { EntrancePage } })
export default class extends Vue {

}
</script>

<style lang="scss">
html {
	font-size: 11px;
}
body {
	background-color: hsl(218, 32%, 9%);
	color: rgba(255, 255, 255, 0.75);
}
button, input[type=text], input[type=password] {
	color: rgba(255, 255, 255, 0.75);
	background-color: hsla(0, 0%, 100%, 0);
	font-size: 1rem;
}
input[type=text], input[type=password] {
	width: 100%;
}
</style>
