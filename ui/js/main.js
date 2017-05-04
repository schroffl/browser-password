'use strict';

const Vault = chrome.extension.getBackgroundPage().vault; // TODO: Use chrome.runtime.getBackgroundPage (async)

window.onload = function() {
	window.app = new Vue({
		'el': '#vault',
		'data': {
			'vault': Vault,
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
};

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
