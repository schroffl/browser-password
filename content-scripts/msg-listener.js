const handlers = {
	'insert': (data, respond) => {
		let form = getLoginForms()[0];

		setFormData(form, data);
	},
	'getFormData': (data, respond) => {
		let loginForms = getLoginForms().filter(isFormFilled),
			signupForms = getSignupForms().filter(isFormFilled),
			form = loginForms[0] || signupForms[0];

		if(form) {
			let values = { };

			for(let prop in form) {
				let val = form[prop].val();

				if(val && val.trim())
					values[prop] = form[prop].val();
			}

			respond(values);
		} else 
			respond({ });
	}
};

chrome.runtime.onMessage.addListener((req, sender, respond) => {
	let fn = handlers[req.action];

	if(typeof fn !== 'function')
		return;
	else
		fn(req.data, respond, sender);
});