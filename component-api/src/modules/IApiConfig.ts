export default interface IApiConfig {
	appSecretKey: string;
	hostToken: {
		scopes: string[];
	};
}
