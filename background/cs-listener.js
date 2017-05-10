chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if(sender.tab && req.action === 'get') {
		let domain = req.domain,
			entries = window.vault.entries,
			entry = entries.find(entry => entry.props.other.domain === domain);

		respond(entry);
	}
});
