function getLoginForms() {
	return getFormsByRegex(rules.loginForm.regexMap);
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