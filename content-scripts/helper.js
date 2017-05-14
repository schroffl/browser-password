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

function formInputsObj(form, map) {
	let inputs = $(form).find('input'),
		obj = { };

	for(let name in map) {
		let typeFilter = map[name].type.map(type => `[type=${type}]`).join(','),
			regexMap = map[name].regexMap,
			nominated = inputs.filter(typeFilter), // .filter(':visible') needs some revision
			scores;

		let matches = nominated
			.get() // Convert to JavaScript Array
			.map(input => ({ 'element': input, 'score': 0 }))
			.map(input => {
				for(let prop in regexMap) {
					regexMap[prop].forEach(entry => {
						let regex = entry[0],
							score = entry[1];

						if(regex.test(input.element[prop]))
							input.score += score;
					});
				}

				return input;
			})
			.filter(input => input.score > 0)
			.sort((a, b) => b.score - a.score)
			.map(input => input.element)
			.slice(0, map[name].maxAmount || 1);
		
		obj[name] = $(matches);
	}

	return obj;
}