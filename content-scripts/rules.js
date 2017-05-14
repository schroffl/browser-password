const rules = (function() {
	const usernameRegex = /(username|name|user|pseudo)/gi;
	const passwordRegex = /(password|pass)/gi;
	const emailRegex = /(email|mail)/gi;
	const confirmationRegex = /conf/gi

	function reward(regex, score) {
		return [ regex, score ];
	}

	return {
		'inputs': {
			'username': {
				'regexMap': {
					'id': [ reward(usernameRegex, 3) ],
					'name': [ reward(usernameRegex, 3) ],
					'className': [ reward(usernameRegex, 2) ]
				},
				'type': [ 'text', 'email' ]
			},
			'password': {
				'regexMap': {
					'id': [ reward(passwordRegex, 3) ],
					'name': [ reward(passwordRegex, 3), reward(confirmationRegex, -2) ],
					'className': [ reward(passwordRegex, 2) ],
					'type': [ reward(passwordRegex, 5) ]
				},
				'type': [ 'password', 'text' ],
				'maxAmount': 2
			},
			'email': {
				'regexMap': {
					'id': [ reward(emailRegex, 3) ],
					'name': [ reward(emailRegex, 3), reward(confirmationRegex, -2) ],
					'className': [ reward(emailRegex, 2) ],
					'type': [ reward(emailRegex, 5) ]
				},
				'type': [ 'email', 'text' ],
				'maxAmount': 2
			}
		}
	};
})();