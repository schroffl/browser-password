'use strict';

class Vault {
	
	constructor(id) {
		this.id = id;	

		this.storage = new EncryptedJSONStorage(chrome.storage.local);
		this.entries = [ ];

		this.key;
		this.locked = true;
	}

	add() {
		this.entries.push({
			'name': 'New Tray',
			'new': true,
			'props': {
				'credentials': {
					'username': '',
					'password': ''
				},
				'other': {
					'thumbnail': 'img/key.svg',
					'domain': ''
				}
			}
		});

		return this.store();
	}

	remove(entry) {
		let index = this.entries.indexOf(entry);

		if(index > -1) {
			this.entries.splice(index, 1);

			return this.store();
		} else
			return Promise.reject('Not found');
	}

	unlock(password) {
		return this.getKey(password)
			.then(key => this.storage.get(this.id, key))
			.then(entries => {
				this.entries = entries;
				this.locked = false;
			});
	}

	lock() {
		return this.getKey()
			.then(this.store)
			.then(this.reset);
	}

	store() {
		return this.getKey()
			.then(key => this.storage.set(this.id, this.entries, key));
	}

	reset() {
		this.entries = [ ];
		this.key = null;
		this.locked = true;
	}

	getKey(password) {
		if(!password && this.key)
			return Promise.resolve(this.key);
		else if(password)
			return WebCryptoHelper.deriveKey(password).then(key => (this.key = key, key));
		else
			return Promise.reject('No password was given and no key is stored');	
	}
}

window.vault = new Vault('test-vault');

chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if(sender.tab && req.action === 'get') {
		let domain = req.domain,
			entry = window.vault.entries.find(entry => entry.domain === domain);

		respond(entry);
	}
});
