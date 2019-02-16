import IPatchMeta from './IPatchMeta';
import { MongoProvider } from 'frost-core';

export default interface IPatchInfo {
	meta: IPatchMeta;
	func: (db: MongoProvider) => Promise<void> | void;
}
