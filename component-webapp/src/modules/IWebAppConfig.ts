export default interface IWebAppConfig {
	apiUrl: string;
	appId: string;
	token: {
		scopes: string[];
	};
}
