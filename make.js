/*
 * MIT License
 *
 * Copyright (c) 2019 FrostDevelop
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/

const os = require('os');
const fs = require('fs').promises;
const path = require('path');

const projects = [
	'core',
	'server',
	'component-base',
	'frontend-basic'
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
