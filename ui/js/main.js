'use strict';

Promise.all([ getVault(), onload() ]).then(result => {
	window.app = new Vue({
		'el': '#vault',
		'data': {
			'vault': result.shift(),
			'wrongPassword': false,
			'showToolbar': false,
			'page': 'vault',
			'justUnlocked': false,
			'justLocked': false
		},
		'methods': {
			'showPage': function(page) {
				this.page = page;
			},
			'unlock': function(event) {
				let password = event.target.value;

				this.justLocked = false;	

				return this.vault.unlock(password)
					.then(() => this.justUnlocked = true)
					.catch(err => this.wrongPassword = true);
			},
			'lock': function() {
				this.justUnlocked = false;

				return this.vault.lock()
					.then(() => this.justLocked = true);
			},
			'save': function() {
				return this.vault.store();
			},
			'insertData': function(tray) {
				let data = tray.props.credentials;

				return sendMessageToActiveTab({ 'action': 'insert', data }).then(window.close);
			},
			'addTray': function() {
				return Promise.all([ sendMessageToActiveTab({ 'action': 'getFormData' }), this.vault.add() ]).then(result => {
					let data = result[0],
						tray = result[1];

					for(let key in data) {
						if(key in tray.props.credentials) 
							tray.props.credentials[key] = data[key];
					}
				});
			},
			'removeTray': function(tray) {
				this.vault.remove(tray);
			},
			'toggleToolbar': function() {
				this.showToolbar = !this.showToolbar;
			}
		},
		'ready': function() {
			let lockElem = this.$el.querySelector('.lock'),
				passwordElem = this.$el.querySelector('.lock input');

			if(!lockElem || !passwordElem)
				return;

			lockElem.addEventListener('animationend', e => {
				switch(e.animationName) {
					case 'open-vault':
						passwordElem.value = '';
						break;
				}
			});
		}
	});
});

function onload() {
	return new Promise(resolve => window.addEventListener('load', resolve, false));
}

function getVault() {
	return new Promise(resolve => chrome.runtime.getBackgroundPage(page => resolve(page.vault)));
}

function sendMessageToActiveTab(message) {
	return new Promise((resolve, reject) => {
		getActiveTab().then(tab => chrome.tabs.sendMessage(tab.id, message, resolve));
	});
}

function getActiveTab() {
	return new Promise((resolve, reject) => {
		chrome.tabs.query({ 'active': true, 'currentWindow': true }, tabs => resolve(tabs.shift()) );
	});
}
