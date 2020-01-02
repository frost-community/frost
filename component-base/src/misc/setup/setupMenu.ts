import $ from 'cafy';
import randomstring from 'randomstring';
import { MongoProvider, ConsoleMenu, inputLine, ActiveConfigManager, getDataVersionState, DataVersionState } from 'frost-core';
//import { Migrator } from 'frost-migration';
//import migration from '@/misc/setup/migration';
import log from '../log';
import { IBaseConfig, loadBaseConfig } from '../baseConfig';
//import verifyApiConfig from '@/misc/verifyApiConfig';

import UserService from '../../server/services/UserService';
import AppService from '../../server/services/AppService';
import { AuthScopes } from '../../server/api/misc/authScope';

const question = async (str: string) => (await inputLine(str)).toLowerCase().indexOf('y') === 0;

export default async function(db: MongoProvider, dataVersion: number) {

	// services
	const userService = new UserService(db);
	const appService = new AppService(db);

	const activeConfigManager = new ActiveConfigManager(db);
	let dataVersionState: DataVersionState;
	let config: IBaseConfig | undefined;
	const refreshMenu = async () => {
		dataVersionState = await getDataVersionState(activeConfigManager, dataVersion, 'base');
		config = await loadBaseConfig(activeConfigManager);
	};
	await refreshMenu();

	const menu = new ConsoleMenu('Base Setup Menu');
	menu.add('exit setup', () => true, (ctx) => {
		ctx.closeMenu();
	});
	menu.add('initialize (register root app and root user)', () => true, async (ctx) => {
		if (dataVersionState != DataVersionState.needInitialization) {
			const allowClear = await question('(!) Are you sure you want to REMOVE ALL COLLECTIONS and ALL DOCUMENTS for target component? (y/n) > ');
			if (!allowClear) {
				return;
			}

			async function clean(collection: string) {
				await db.remove(collection, {});
				log(`cleaned ${collection} collection.`);
			}

			const collectionInfos = await db.listCollections();
			const baseCollections = collectionInfos.filter(col => col.name.startsWith('base.'));
			for (const collectionInfo of baseCollections) {
				await clean(collectionInfo.name);
			}
		}

		// input: app name
		let appName = await inputLine('app name(default: Frost) > ');
		if (appName == '') appName = 'Frost';

		// input: http port
		let httpPort: number;
		while (true) {
			let httpPortStr: string;
			httpPortStr = await inputLine('port of http server(default: 3000) > ');
			if (httpPortStr == '') httpPortStr = '3000';
			if (!/^[0-9]+$/.test(httpPortStr)) {
				console.log('error: invalid input');
				continue;
			}
			httpPort = parseInt(httpPortStr);
			if ($.number.range(1, 65535).nok(httpPort)) {
				console.log('error: invalid input');
				continue;
			}
			break;
		}

		const appSecretKey = randomstring.generate({ length: 128 });

		// create documents

		const userDoc = await userService.create('frost', null, 'Frost公式', 'オープンソースSNS Frostです。', { root: true });
		log('root user was created.');

		const appDoc = await appService.create(appName, userDoc, userDoc.description, AuthScopes.toArray().map(s => s.id), { root: true });
		log('root app was created.');

		// set config

		await activeConfigManager.setItem('base', 'dataVersion', dataVersion);
		//log('dataVersion configured.');

		await activeConfigManager.setItem('base', 'httpPort', httpPort);
		log('httpPort configured.');

		await activeConfigManager.setItem('base', 'appSecretKey', appSecretKey);
		log('appSecretKey configured.');

		await activeConfigManager.setItem('base', 'clientToken.scopes', ["user.read", "user.write", "post.read", "post.write", "storage.read", "storage.write", "app.read"]);
		log('clientToken.scopes configured.');

		await activeConfigManager.setItem('base', 'recaptcha.enable', false);
		log('recaptcha.enable configured.');

		await activeConfigManager.setItem('base', 'recaptcha.siteKey', '');
		log('recaptcha.siteKey configured.');

		await activeConfigManager.setItem('base', 'recaptcha.secretKey', '');
		log('recaptcha.secretKey configured.');

		await refreshMenu();
	});

	// menu.add('generate or get token for authorization host', () => (dataVersionState == DataVersionState.ready && config != null), async (ctx) => {
	// 	const rootUser = await db.find('base.users', { root: true });
	// 	let rootApp = await db.find('base.apps', { root: true });
	// 	if (rootApp) {
	// 		let hostToken = await db.find('base.tokens', { host: true });

	// 		if (!hostToken) {
	// 			if (!config) {
	// 				console.log('api config is not found.');
	// 				return;
	// 			}
	// 			const scopes = config!.hostToken.scopes;

	// 			hostToken = await tokenService.create(rootApp, rootUser, scopes, true);
	// 			log('host token created:', hostToken);
	// 		}
	// 		else {
	// 			log('host token found:', hostToken);
	// 		}
	// 	}

	// 	await refreshMenu();
	// });

	// menu.add('migrate from old data formats', () => (dataVersionState == DataVersionState.needMigration), async (ctx) => {
	// 	//config!.dataVersion;
	// 	const migrator = await Migrator.FromPatchFunc(migration, db);
	// 	await migrator.migrate(dataVersion.value, dataVersion);

	// 	await refreshMenu();
	// });

	return menu;
}
