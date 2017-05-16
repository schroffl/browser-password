function getFormElements(form) {
	return Object.keys(form)
		.filter(key => form[key] instanceof HTMLElement)
		.map(key => form[key]);
}

function elementScore(element, regexMap) {
	let score = 0;

	for(let prop in regexMap) {
		regexMap[prop].forEach(pair => {
			let regex = pair[0],
				reward = pair[1];

			if(regex.test(element[prop]))
				score += reward;
		});
	}

	return score;
}

function getAllForms() {
	return Array.from(document.forms).map(element => {
		let inputs = formInputsObj(element, rules.inputs);

		return Object.assign({ element }, inputs);
	});
}

function getFormsByRegex(regexMap) {
	return getAllForms()
		.map(form => ({ form, 'score': elementScore(form.element, regexMap) }))
		.filter(form => form.score >= 0)
		.sort((a, b) => b.score - a.score)
		.map(form => form.form)
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

function setFormData(form, data) {
	if(!form || !data)
		return;

	for(let credential in data)
		form[credential].val(data[credential]);
}

function autofill(form) {
	let domain = getDomain();

	return getCredentials(domain)
		.then(setFormData.bind(null, form))
		.catch(console.warn);
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
			.map(input => ({ 'element': input, 'score': elementScore(input, regexMap) }))
			.filter(input => input.score > 0)
			.sort((a, b) => b.score - a.score)
			.map(input => input.element)
			.slice(0, map[name].maxAmount || 1);
		
		obj[name] = $(matches);
	}

	return obj;
}