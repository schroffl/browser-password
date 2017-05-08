'use strict';

Promise.all([ getVault(), onload() ]).then(result => {
	window.app = new Vue({
		'el': '#vault',
		'data': {
			'vault': result.shift(),
			'wrongPassword': false,
			'showToolbar': true,
			'title': 'Vault',
			'justUnlocked': false,
			'justLocked': false
		},
		'methods': {
			'unlock': function(event) {
				let password = event.target.value,
					lockEl = this.$el.querySelector('.lock');
				
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
			'insertData': function(data) {
				return sendMessageToActiveTab({ 'action': 'insert', data }).then(window.close);
			},
			'addTray': function() {
				this.vault.add();
			},
			'removeTray': function(tray) {
				this.vault.remove(tray);
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
