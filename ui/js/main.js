'use strict';

Promise.all([ getVault(), onload() ]).then(result => {
	window.app = new Vue({
		'el': '#vault',
		'data': {
			'vault': result.shift(),
			'wrongPassword': false,
			'showLock': true,
			'title': 'Vault'
		},
		'methods': {
			'unlock': function(event) {
				let password = event.target.value,
					lockEl = this.$el.querySelector('.lock');

				lockEl.addEventListener('animationend', e => {
					if(e.animationName !== 'open-vault') return;

					event.target.value = '';
				});

				return this.vault.unlock(password).catch(err => this.wrongPassword = true);
			},
			'lock': function() {
				return this.vault.lock();
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
