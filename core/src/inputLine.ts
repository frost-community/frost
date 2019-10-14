import readLine from 'readline';

export default function(message: string): Promise<string> {
	return new Promise<string>((resolve) => {
		const rl = readLine.createInterface(process.stdin, process.stdout);
		rl.question(message, (ans) => {
			resolve(ans);
			rl.close();
		});
	});
}
