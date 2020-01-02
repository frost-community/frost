import Vue from 'vue';
import Vuex from 'vuex';
import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';

Vue.use(Vuex);
const store = new Vuex.Store({ });
export default store;

@Module({ dynamic: true, store, name: "credential", namespaced: true })
class CredentialModule extends VuexModule {
	accessToken: string | null = null;

	@Mutation
	setAccessToken(value: string | null) {
		this.accessToken = value;
	}

	@Action
	saveAccessToken() {
		if (this.accessToken != null) {
			localStorage.setItem('accessToken', this.accessToken);
		}
		else {
			localStorage.removeItem('accessToken');
		}
	}

	@Action
	loadAccessToken() {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken != null) {
			console.log(accessToken);
			this.setAccessToken(accessToken);
		}
	}
}
export const credentialModule = getModule(CredentialModule);
