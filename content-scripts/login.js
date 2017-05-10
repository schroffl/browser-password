const allowedTypes = [ 'text', 'password', 'email' ];
const testProperties = [ 'id', 'name', 'className' ];
const scoreMap = [
	[ /username/g, 2 ],
	[ /name/g, 1 ],
	[ /search/g, -4 ],
	[ /comment/g, -2 ],
	[ /password/g, 2 ],
	[ /pass/g, 2 ],
	[ /login/g, 3 ],
	[ /logon/g, 2 ]
];

function getLoginForms() {
	return Array.from(document.forms).map(element => {
		let inputs = $(element).find('input');

		inputs = inputs.filter((i, input) => allowedTypes.includes(input.type));

		return { element, inputs };
	}).map(form => {
		let element = form.element,
			username = form.inputs.filter('[type=text], [type=email]').get(0),
			password = form.inputs.filter('[type=password]').get(0);

		return { element, username, password };
	}).map(form => calculateScore(form, scoreMap, testProperties))
	.filter(form => form.score > 0)
	.sort((a, b) => b.score - a.score);
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
