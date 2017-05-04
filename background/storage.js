'use strict';

class EncryptedJSONStorage {
	
	constructor(storage) {
		this.storage = storage;		
	}

	set(name, obj, key) {
		let str = JSON.stringify(obj);
	
		return WebCryptoHelper.encrypt(str, key)
			.then(encrypted => new Promise(resolve => {
				this.storage.set({ [name]: encrypted }, resolve);
			}));
	}

	get(name, key) {
		return new Promise(resolve => this.storage.get(name, obj => resolve(obj[name])))
			.then(obj => {
				if(!obj) 
					return Promise.reject('Not found');
				
				return obj;
			})
			.then(obj => WebCryptoHelper.decrypt(obj, key))
			.then(JSON.parse);
	}
}
