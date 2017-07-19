'use strict';

const subtle = window.crypto.subtle;

function str2ab(string) {
	let buf = new ArrayBuffer(string.length * 2),
		view = new Uint16Array(buf);

	for(let i=0; i<string.length; i++)
		view[i] = string.charCodeAt(i);

	return buf;
}

function ab2str(buf) {
	let view  = new Uint16Array(buf);

	return String.fromCharCode.apply(null, view);
}

function arr2ab(arr) {
	return new Uint16Array(arr);
}

function ab2arr(buf) {
	return Array.from(new Uint16Array(buf));
}

class Vault {

	constructor(url) {
		this.entries = [ ];
		this.locked = true;

		this.promisedKey = Promise.reject('No/Wrong password');
	}

	unlock(password) {
		let keyPromise = Vault.generateKey(password);

		return keyPromise.then(key => {
			// Decrypt data
			console.log(key);
		}).then(() => {
			// If the password was right we can set the promisedKey
			this.promisedKey = keyPromise;
		});
	}

	static generateKey(password) {
		let passwordBuf = str2ab(password);

		return subtle
			.importKey('raw', passwordBuf, { 'name': 'PBKDF2' }, false, [ 'deriveKey' ])
			.then(imported => subtle.deriveKey(
				{ 'name': 'PBKDF2', 'salt': str2ab('salt'), 'iterations': 10000, 'hash': 'SHA-512' },
				imported,
				{ 'name': 'AES-CBC', 'length': 256 },
				true,
				[ 'encrypt', 'decrypt' ]
			));

	}

	static encryptObject(key, obj) {
		let string = JSON.stringify(obj),
			stringAB = str2ab(string),
			ivAB = crypto.getRandomValues(new Uint8Array(16)),
			ivArray = Array.from(ivAB);

		return subtle
			.encrypt({ 'name': 'AES-CBC', 'iv': ivAB, 'length': 256 }, key, stringAB)
			.then(ab2arr)
			.then(cipherArray => ({ 'iv': ivArray, 'data': cipherArray }))
	}

}

let test = new Vault('https://127.0.0.1');

test.unlock('123456');