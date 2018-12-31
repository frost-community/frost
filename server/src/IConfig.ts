import { MongoInfo } from '@frost/component';

export default interface IConfig {
	server: {
		httpPort: number,
		mongo: MongoInfo
	},
	api: {
		enable: boolean
	},
	webapp: {
		enable: boolean
	}
}
