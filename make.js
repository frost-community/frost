const os = require('os');
const fs = require('fs').promises;
const path = require('path');

const projects = [
	'core',
	'server',
	'component-base'
];

async function entry() {
	let cmd;

	const isWindows = (os.type().indexOf('Windows') != -1);

	if (isWindows) {
		// install
		cmd = '';
		for (let dirname of projects) {
			cmd += `cd "${dirname}" && npm install && cd ".."\r\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'install.bat'), cmd);

		// clean
		cmd = '';
		for (let dirname of projects) {
			let dirpath = path.join(dirname, 'built');
			cmd += `rmdir /s /q "${dirpath}"\r\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'clean.bat'), cmd);

		// build
		cmd = '';
		for (let dirname of projects) {
			cmd += `cd "${dirname}" && npm run build && cd ".."\r\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'build.bat'), cmd);

		// rebuild
		cmd = '';
		for (let dirname of projects) {
			cmd += `cd "${dirname}" && npm run build && cd ".."\r\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'build.bat'), cmd);
	}
	else {
		// install
		cmd = '';
		for (let dirname of projects) {
			cmd += `cd "${dirname}" && npm install && cd ".."\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'install.sh'), cmd);

		// clean
		cmd = '';
		for (let dirname of projects) {
			let dirpath = path.join(dirname, 'built');
			cmd += `rm -rf "${dirpath}"\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'clean.sh'), cmd);

		// build
		cmd = '';
		for (let dirname of projects) {
			cmd += `cd "${dirname}" && npm run build && cd ".."\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'build.sh'), cmd);

		// rebuild
		cmd = '';
		for (let dirname of projects) {
			cmd += `cd "${dirname}" && npm run build && cd ".."\n`;
		}
		await fs.writeFile(path.resolve(__dirname, 'build.sh'), cmd);
	}
}
entry()
.catch(err => {
	console.log('error:', err);
});
