import { MongoProvider, ConsoleMenu } from 'frost-component';
import getDataFormatState, { DataFormatState } from '../getDataFormatState';
import readLine from 'readline';
import UserService from '../../services/UserService';
import AppService from '../../services/AppService';
import TokenService from '../../services/TokenService';
import IApiConfig from '../IApiConfig';
import { AuthScopes } from '../authScope';
import migrate from './migrate';
import log from '../log';

function read(message: string): Promise<string> {
	return new Promise<string>((resolve) => {
		const rl = readLine.createInterface(process.stdin, process.stdout);
		rl.question(message, (ans) => {
			resolve(ans);
			rl.close();
		});
	});
}

const q = async (str: string) => (await read(str)).toLowerCase().indexOf('y') === 0;

export default async function(db: MongoProvider, config: IApiConfig, currentDataVersion: number) {

	// services
	const userService = new UserService(db);
	const appService = new AppService(db, config);
	const tokenService = new TokenService(db);

	let dataFormatState: DataFormatState;
	const refreshMenu = async () => {
		dataFormatState = await getDataFormatState(db, currentDataVersion);
	};
	await refreshMenu();

	const menu = new ConsoleMenu('API Setup Menu');
	menu.add('exit setup', () => true, (ctx) => {
		ctx.closeMenu();
	});
	menu.add('initialize (register root app and root user)', () => true, async (ctx) => {
		if (dataFormatState != DataFormatState.needInitialization) {
			const allowClear = await q('(!) are you sure you want to REMOVE ALL COLLECTIONS and ALL DOCUMENTS in target database? (y/n) > ');
			if (!allowClear) {
				return;
			}

			const clean = async (collection: string) => {
				await db.remove(collection, {});
				log(`cleaned ${collection} collection.`);
			};

			await clean('meta');
			await clean('api.apps');
			await clean('api.tokens');
			await clean('api.users');
			await clean('api.userRelations');
			await clean('api.postings');
			await clean('api.storageFiles');
		}

		let appName = await read('app name(default: Frost Web) > ');
		if (appName == '') appName = 'Frost Web';

		const userDoc = await userService.create('frost', null, 'Frost公式', 'オープンソースSNS Frostです。', { root: true });
		log('root user created.');

		await appService.create(appName, userDoc, userDoc.description, AuthScopes.toArray().map(s => s.id), { root: true });
		log('root app created.');

		await db.create('meta', { type: 'dataFormat', value: currentDataVersion });

		await refreshMenu();
	});
	menu.add('generate or get token for authorization host', () => (dataFormatState == DataFormatState.ready), async (ctx) => {
		const rootUser = await db.find('api.users', { root: true });
		let rootApp = await db.find('api.apps', { root: true });
		if (rootApp) {
			let hostToken = await db.find('api.tokens', { host: true });

			if (!hostToken) {
				const scopes = config.hostToken.scopes;

				hostToken = await tokenService.create(rootApp, rootUser, scopes, true);
				log('host token created:', hostToken);
			}
			else {
				log('host token found:', hostToken);
			}
		}

		await refreshMenu();
	});
	menu.add('migrate from old data formats', () => (dataFormatState == DataFormatState.needMigration), async (ctx) => {

		const dataFormat = await db.find('meta', { type: 'dataFormat' });
		if (!dataFormat) {
			if (await migrate('empty->1')) {
				log('migration to v1 has completed.');
			}
			else {
				log('migration to v1 has failed.');
			}
		}
		else {
			log('failed to migration: unknown dataFormat');
		}

		await refreshMenu();
	});

	return menu;
}
