export default interface IWebAppConfig {
	apiBaseUrl: string;
	hostToken: {
		accessToken: string;
	};
	clientToken: {
		scopes: string[];
	};
}
