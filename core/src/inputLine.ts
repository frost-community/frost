import readLine from 'readline';

export default function(message: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const rl = readLine.createInterface(process.stdin, process.stdout);
		rl.question(message, (ans) => {
			rl.close();
			resolve(ans);
		});
		rl.on('SIGINT', () => {
			console.log('');
			rl.close();
			reject('input stopped');
		});
	});
}
