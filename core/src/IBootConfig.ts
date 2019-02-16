export default interface IBootConfig {
	cryptoKey: string;
	mongo: {
		url: string;
		dbName: string;
	};
}
