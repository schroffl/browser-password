function getLoginForms() {
	let regexMap = rules.loginForm.regexMap;

	return getAllForms()
		.map(form => ({ form, 'score': elementScore(form.element, regexMap) }))
		.filter(form => form.score >= 0)
		.sort((a, b) => b.score - a.score)
		.map(form => form.form);
}

function onDomChange() {
	let form = getLoginForms()[0];

	autofill(form);
}

let observer = new MutationObserver(onDomChange);

// Find and autofill login forms after an element is added or removed (it may be a login form)
observer.observe(document.body, { 'childList': true });

// Automatically fill the form with the best score on page load
autofill(getLoginForms()[0]);
