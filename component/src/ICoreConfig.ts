export default interface ICoreConfig {
	cryptoKey: string;
	mongo: {
		url: string;
		dbName: string;
	};
}
