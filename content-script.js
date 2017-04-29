console.log('asdljwer');

window.addEventListener('load', function() { 
	let forms = Array.from(document.forms),
   		formElements = forms.map(form => Array.from(form.elements)),
		elements = Array.prototype.concat.apply([ ], formElements);
						
	console.log(elements);
}, false);
