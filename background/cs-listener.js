function compareDomain(domain, match) {
	let domainArr = domain.split('.').reverse(),
		matchArr = match.split('.').reverse();

	if(matchArr.length > domainArr.length)
		return false;

	for(let i=0; i<matchArr.length; i++) {
		if(matchArr[i] !== domainArr[i])
			return false;
	}

	return true;
}

chrome.runtime.onMessage.addListener((req, sender, respond) => {
	if(sender.tab && req.action === 'get') {
		let domain = req.domain,
			entries = window.vault.entries,
			entry = entries.find(entry => compareDomain(domain, entry.props.other.domain));

		respond(entry);
	}
});
