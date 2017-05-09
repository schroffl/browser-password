chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if(sender.tab && req.action === 'get') {
		let domain = req.domain,
			entry = window.vault.entries.find(entry => entry.domain === domain);

		respond(entry);
	}
});
