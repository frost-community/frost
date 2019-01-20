
export default async function(migrationId: string): Promise<boolean> {
	if (migrationId == 'empty->1') {
		console.log('migration info is not defined. please initialize in setup mode');
		return false;
	}
	else {
		console.log('unknown migration');
		return false;
	}
}
