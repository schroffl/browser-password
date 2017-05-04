const subtle = window.crypto.subtle;

class WebCryptoHelper {
	
	static encrypt(str, key) {
		let ivBuf = WebCryptoHelper.generateIV(),
			dataBuf = WebCryptoHelper.str2ab(str),
			iv = Array.from(ivBuf);

		return subtle.encrypt({ 'name': 'AES-GCM', 'iv': ivBuf, 'length': 128 }, key, dataBuf)
			.then(WebCryptoHelper.ab2arr)
			.then(ciphertext => ({ iv, ciphertext }));
	}

	static decrypt(obj, key) {
		let ivBuf = new Uint8Array(obj.iv),
			ciphertext = WebCryptoHelper.arr2ab(obj.ciphertext);

		return subtle.decrypt({ 'name': 'AES-GCM', 'iv': ivBuf, 'length': 128 }, key, ciphertext)
			.then(WebCryptoHelper.ab2str);
	}

	static deriveKey(password) {
		let passwordBuf = WebCryptoHelper.str2ab(password);

		// TODO: Don't use a fixed salt and increase iterations!!
		return subtle.importKey('raw', passwordBuf, { 'name': 'PBKDF2' }, false, [ 'deriveKey' ])
			.then(baseKey => subtle.deriveKey(
				{'name': 'PBKDF2', 'salt': WebCryptoHelper.str2ab('salt'), 'iterations': 10000, 'hash': 'SHA-512' },
				baseKey,
				{ 'name': 'AES-GCM', 'length': 128 },
				true,
				[ 'encrypt', 'decrypt' ]
			));
	}

	static generateIV() {
		let buf = new Uint8Array(16);

		window.crypto.getRandomValues(buf);

		return buf;
	}

	static str2ab(str) {
		let buf = new ArrayBuffer(str.length * 2),
			view = new Uint16Array(buf);

		for(let i=0; i<str.length; i++)
			view[i] = str.charCodeAt(i);

		return buf;
	}

	static ab2str(buf) {
		let view = new Uint16Array(buf);

		return String.fromCharCode.apply(null, view);
	}

	static arr2ab(arr) {
		return new Uint16Array(arr);
	}

	static ab2arr(buf) {
		return Array.from(new Uint16Array(buf));
	}

}
