import $ from 'cafy';
import uid from 'uid2';
import { MongoProvider, ConsoleMenu, inputLine, ActiveConfigManager } from 'frost-core';
import getDataFormatState, { DataFormatState } from '../getDataFormatState';
import migrate from './migrate';
import log from '../log';
import IWebAppConfig from '../IWebAppConfig';
import verifyWebAppConfig from '../verifyWebAppConfig';

const question = async (str: string) => (await inputLine(str)).toLowerCase().indexOf('y') === 0;

export default async function(db: MongoProvider, currentDataVersion: number) {
	const activeConfigManager = new ActiveConfigManager(db);

	let config: IWebAppConfig | undefined;
	let dataFormatState: DataFormatState;
	const refreshMenu = async () => {
		dataFormatState = await getDataFormatState(db, currentDataVersion);

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
		if (dataFormatState != DataFormatState.needInitialization) {
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
		const clientScopes = ["user.read", "user.write", "user.account.read", "user.account.write", "post.read", "post.write", "storage.read", "storage.write"];
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

		await db.create('meta', { type: 'dataFormat', value: currentDataVersion });

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
