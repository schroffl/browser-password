function getFormElements(form) {
	return Object.keys(form)
		.filter(key => form[key] instanceof HTMLElement)
		.map(key => form[key]);
}

function calculateScore(form, scoreMap, testProperties) {
	let formElements = getFormElements(form);

	form.score = 0;

	scoreMap.forEach(entry => {
		let regex = entry[0],
			score = entry[1];

		formElements.forEach(element => {
			testProperties.forEach(prop => {
				form.score += regex.test(element[prop]) ? score : 0
			});
		});
	});

	return form;
}

function getDomain() {
	return location.hostname;
}

function getCredentials(domain) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({ 'action': 'get', domain }, data => {
			if(data && data.props && data.props.credentials)
				resolve(data.props.credentials);
			else
				reject('No matching entry found');
		});
	});
}

function setFormData(form, credentials) {
	if(!form || !credentials)
		return;

	for(let credential in credentials) {
		let value = credentials[credential];

		if(form[credential] && value)
			form[credential].value = value;
	}
}

function autofill(form) {
	let domain = getDomain();

	return getCredentials(domain).then(setFormData.bind(null, form));
}
