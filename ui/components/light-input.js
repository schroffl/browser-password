Vue.component('light-input', {
	'props': [ 'min', 'max' ],
	'template': `<input type="text" class="light-input" spellcheck="false" autcomplete="off" v-on:input="adjustWidth($el.value)" v-on:keydown="onkeydown">`,
	'data': function() {
		let span = document.createElement('span');

		span.style.font = '12px Arial, sans-serif';
		span.style.position = 'absolute';
		span.style.visibility = 'hidden';
		span.style.top = '-1000px';
		span.style.left = '-1000px';

		document.body.appendChild(span);

		return { span };
	},  
	'methods': {
		'adjustWidth': function(text) {
			let elem = this.$el,
				len;

			this.span.innerText = text;

			len = this.span.offsetWidth;
			len = len < this.min ? this.min : len;
			len = len > this.max ? this.max : len;

			elem.style.width = len + 'px';
		},
		'onkeydown': function(e) {
			if(e.keyCode === 13)
				this.$el.blur();
		}
	},
	'ready': function() {
		this.adjustWidth(this.$el.value);
	},
	'detached': function() {
		// We don't want any memory leaks
		document.body.removeChild(this.span);		
	}
});