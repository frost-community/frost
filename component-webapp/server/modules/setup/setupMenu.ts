import $ from 'cafy';
import uid from 'uid2';
import { MongoProvider, ConsoleMenu, inputLine, ActiveConfigManager, getDataVersionState, DataVersionState } from 'frost-core';
import { Migrator } from 'frost-migration';
import migration from './migration';
import log from '../log';
import IWebAppConfig from '../IWebAppConfig';
import verifyWebAppConfig from '../verifyWebAppConfig';

const question = async (str: string) => (await inputLine(str)).toLowerCase().indexOf('y') === 0;

export default async function(db: MongoProvider, targetDataVersion: number) {
	const activeConfigManager = new ActiveConfigManager(db);

	let config: IWebAppConfig | undefined;
	let dataVersionState: DataVersionState;
	const refreshMenu = async () => {
		dataVersionState = await getDataVersionState(db, targetDataVersion, 'webapp.meta', []);

		config = {
			apiBaseUrl: await activeConfigManager.getItem('webapp', 'apiBaseUrl'),
			hostToken: {
				accessToken: await activeConfigManager.getItem('webapp', 'hostToken.accessToken')
			},
			clientToken: {
				scopes: await activeConfigManager.getItem('webapp', 'clientToken.scopes')
			},
			recaptcha: {
				enable: await activeConfigManager.getItem('webapp', 'recaptcha.enable'),
				siteKey: await activeConfigManager.getItem('webapp', 'recaptcha.siteKey'),
				secretKey: await activeConfigManager.getItem('webapp', 'recaptcha.secretKey')
			}
		};
		try {
			verifyWebAppConfig(config);
		}
		catch {
			// if config is invalid, set undefined
			config = undefined;
		}
	};
	await refreshMenu();

	const menu = new ConsoleMenu('WebApp Setup Menu');
	menu.add('exit setup', () => true, (ctx) => {
		ctx.closeMenu();
	});
	menu.add('initialize', () => true, async (ctx) => {
		if (dataVersionState != DataVersionState.needInitialization) {
			const allowClear = await question('(!) are you sure you want to REMOVE ALL COLLECTIONS and ALL DOCUMENTS in target database? (y/n) > ');
			if (!allowClear) {
				return;
			}

			async function clean(collection: string) {
				await db.remove(collection, {});
				log(`cleaned ${collection} collection.`);
			}

			await clean('webapp.config');
		}

		const apiBaseUrl = await inputLine('please input apiBaseUrl > ');
		const hostAccessToken = await inputLine('please input host accessToken > ');
		const clientScopes = ['user.read', 'user.write', 'user.account.read', 'user.account.write', 'post.read', 'post.write', 'storage.read', 'storage.write'];
		const enableRecaptcha = await question('do you want to enable reCAPTCHA? (y/n) > ');

		let recaptchaSiteKey: string | undefined;
		let recaptchaSecretKey: string | undefined;
		if (enableRecaptcha) {
			recaptchaSiteKey = await inputLine('please input reCAPTCHA siteKey > ');
			recaptchaSecretKey = await inputLine('please input reCAPTCHA secretKey > ');
		}

		await activeConfigManager.setItem('webapp', 'apiBaseUrl', apiBaseUrl);
		log('apiBaseUrl configured.');

		await activeConfigManager.setItem('webapp', 'hostToken.accessToken', hostAccessToken);
		log('hostToken.accessToken configured.');

		await activeConfigManager.setItem('webapp', 'clientToken.scopes', clientScopes);
		log('clientToken.scopes configured.');

		await activeConfigManager.setItem('webapp', 'recaptcha.enable', enableRecaptcha);
		await activeConfigManager.setItem('webapp', 'recaptcha.siteKey', recaptchaSiteKey);
		await activeConfigManager.setItem('webapp', 'recaptcha.secretKey', recaptchaSecretKey);
		log('recaptcha configured.');

		await db.create('webapp.meta', { type: 'dataFormat', value: targetDataVersion });

		await refreshMenu();
	});
	menu.add('migrate from old data formats', () => (dataVersionState == DataVersionState.needMigration), async (ctx) => {
		let dataVersion = await db.find('webapp.meta', { type: 'dataFormat' });
		const migrator = await Migrator.FromPatchFunc(migration, db);
		await migrator.migrate(dataVersion.value, targetDataVersion);

		await refreshMenu();
	});

	return menu;
}
