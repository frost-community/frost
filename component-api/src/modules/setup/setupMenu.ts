import $ from 'cafy';
import uid from 'uid2';
import { MongoProvider, ConsoleMenu, inputLine, ConfigManager } from 'frost-component';
import getDataFormatState, { DataFormatState } from '../getDataFormatState';
import UserService from '../../services/UserService';
import AppService from '../../services/AppService';
import TokenService from '../../services/TokenService';
import { AuthScopes } from '../authScope';
import migrate from './migrate';
import log from '../log';
import IApiConfig from '../IApiConfig';
import verifyApiConfig from '../verifyApiConfig';

const question = async (str: string) => (await inputLine(str)).toLowerCase().indexOf('y') === 0;

export default async function(db: MongoProvider, currentDataVersion: number) {

	// services
	const userService = new UserService(db);
	const appService = new AppService(db);
	const tokenService = new TokenService(db);

	const configManager = new ConfigManager(db);

	let config: IApiConfig | undefined;
	let dataFormatState: DataFormatState;
	const refreshMenu = async () => {
		dataFormatState = await getDataFormatState(db, currentDataVersion);

		config = {
			appSecretKey: await configManager.getItem('api', 'appSecretKey'),
			hostToken: {
				scopes: await configManager.getItem('api', 'hostToken.scopes')
			}
		};
		try {
			verifyApiConfig(config);
		}
		catch {
			// if config is invalid, set undefined
			config = undefined;
		}
	};
	await refreshMenu();

	const menu = new ConsoleMenu('API Setup Menu');
	menu.add('exit setup', () => true, (ctx) => {
		ctx.closeMenu();
	});
	menu.add('initialize (register root app and root user)', () => true, async (ctx) => {
		if (dataFormatState != DataFormatState.needInitialization) {
			const allowClear = await question('(!) are you sure you want to REMOVE ALL COLLECTIONS and ALL DOCUMENTS in target database? (y/n) > ');
			if (!allowClear) {
				return;
			}

			async function clean(collection: string) {
				await db.remove(collection, {});
				log(`cleaned ${collection} collection.`);
			}

			await clean('meta');
			await clean('api.config');
			await clean('api.apps');
			await clean('api.tokens');
			await clean('api.users');
			await clean('api.userRelations');
			await clean('api.postings');
			await clean('api.storageFiles');
		}

		let appName = await inputLine('app name(default: Frost Web) > ');
		if (appName == '') appName = 'Frost Web';

		const userDoc = await userService.create('frost', null, 'Frost公式', 'オープンソースSNS Frostです。', { root: true });
		log('root user created.');

		await appService.create(appName, userDoc, userDoc.description, AuthScopes.toArray().map(s => s.id), { root: true });
		log('root app created.');

		const appSecretKey = uid(128);
		await configManager.setItem('api', 'appSecretKey', appSecretKey);
		log('appSecretKey configured:', appSecretKey);

		const hostTokenScopes = ["user.read", "app.read", "app.host", "auth.host", "user.create", "user.delete"];
		await configManager.setItem('api', 'hostToken.scopes', hostTokenScopes);
		log('hostToken.scopes configured.');

		await db.create('meta', { type: 'dataFormat', value: currentDataVersion });

		await refreshMenu();
	});
	menu.add('generate or get token for authorization host', () => (dataFormatState == DataFormatState.ready && config != null), async (ctx) => {
		const rootUser = await db.find('api.users', { root: true });
		let rootApp = await db.find('api.apps', { root: true });
		if (rootApp) {
			let hostToken = await db.find('api.tokens', { host: true });

			if (!hostToken) {
				if (!config) {
					console.log('api config is not found.');
					return;
				}
				const scopes = config!.hostToken.scopes;

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
