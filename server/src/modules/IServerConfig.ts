import { IMongoInfo } from 'frost-component';

export default interface IServerConfig {
	httpPort: number,
	mongo: IMongoInfo,
	enableApi: boolean,
	enableWebApp: boolean
}
