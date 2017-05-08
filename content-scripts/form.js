function getLoginForms() {
	let forms = Array.from(document.forms);

	return forms.map(form => {
		let passwordField = form.querySelector('input[type=password]'),
			usernameField = form.querySelector('input[type=text]');

		return { usernameField, passwordField, form };
	});
}

function setFormData(data) {
	let form = getLoginForms().shift();

	console.log(form, data);

	if(!data || !form)
		return;

	if(form.usernameField && data.username)
		form.usernameField.value = data.username;
	if(form.passwordField && data.password)
		form.passwordField.value = data.password;
}

function getDomain(url) {
	let a = document.createElement('a');

	a.href = url;

	let hostname = a.hostname.toLowerCase();

	if(hostname) {
		let parts = hostname.split('.').reverse(),
			domain = parts[1] + '.' + parts[0];

		if(hostname.indexOf('.co.uk') > -1 && parts.length > 2)
			domain = parts[2] + '.' + domain;

		return domain;
	}
}

chrome.runtime.onMessage.addListener((req, sender, respond) => {
	console.log(req);

	if(!sender.tab && req.action === 'insert')
		setFormData(req.data);
});

let domain = getDomain(location);

chrome.runtime.sendMessage({ 'action': 'get', domain }, setFormData);
