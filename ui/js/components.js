Vue.component('light-input', {
	'props': [ 'min', 'max' ],
	'template': `<input type="text" class="light-input" spellcheck="false" autcomplete="off" v-on:input="adjustWidth($el.value)">`,
	'data': function() {
		// FIXME: Not working well (it does the job but has a few quirks)

		let canvas = document.createElement('canvas'),
			ctx = canvas.getContext('2d');

		canvas.font = '12px Arial';

		return { ctx };
	},  
	'methods': {
		'adjustWidth': function(text) {
			let elem = this.$el,
				len = this.ctx.measureText(text).width + 8;
			
			len = len < this.min ? this.min : len;
			len = len > this.max ? this.max : len;

			elem.style.width = len + 'px';
		}
	},
	'ready': function() {
		this.adjustWidth(this.$el.value);
	}
});

Vue.component('tray', {
	'props': [ 'data' ],
	'data': function() {
		return {
			'editing': false,
			'savepoint': null
		};
	},
	'template': `
		<li class="vault-tray segmented"> 
			<div v-on:click="!editing && $emit('insert', data)" class="segment fill" :class="{ clickable: !editing }">
				<div class="tray-thumbnail">
					<div class="thumbnail-overlay" v-on:click.stop="toggleEdit" :title="editing ? 'Save' : 'Edit'">
						<i class="fa fa-pencil" v-if="!editing"></i>
						<i class="fa fa-check" v-if="editing"></i>
					</div>

					<img :src="data.props.other.thumbnail"></img>
				</div>

				<div class="tray-info">
					<input type="text" class="tray-name edit-name" v-model="data.name" v-if="editing" />

					<span class="tray-name" v-if="!editing">{{ data.name }}</span>
					<span class="tray-username" v-if="data.props.credentials.username && !editing">{{ data.props.credentials.username }}</span>
				</div>
			</div>

			<div class="segment segment-button square clickable" v-if="!editing" title="Copy password" v-on:click="copyPassword">
				<i class="fa fa-copy"></i>
			</div>

			<div class="segment segment-button square clickable" v-if="editing" title="Undo recent changes" v-on:click="undoChanges">
				<i class="fa fa-undo"></i>
			</div>

			<div class="segment segment-button danger square clickable" v-if="editing" title="Delete" v-on:click="$emit('delete', data)">
				<i class="fa fa-trash-o"></i>
			</div>

			<div class="tray-editor" v-if="editing">
				<div class="tray-editor-section" v-for="(name, prop) in data.props">
					<h3>{{ name }}</h3>
					
					<dl class="section-content">
						<div v-for="(key, val) in prop" class="key-value-pair" v-on:click.stop="focusInput">  
							<dd>{{ key }}:</dd>
							<dt>
								<light-input v-model="prop[key]" :min="10" :max="130">
							</dt>
						</div>
					</dl>
				</div>
			</div>
		</li>
	`,
	'methods': {
		'toggleEdit': function() {
			if(!this.editing)
				this.createSavepoint();
			else if(this.editing) {
				// The save button was presed
				this.$emit('save');
				this.savepoint = null;
			}

			this.editing = !this.editing;
		},
		'createSavepoint': function() {
			this.savepoint = JSON.parse(JSON.stringify(this.data));
		},
		'undoChanges': function() {
			// FIXME: When resetting the data, the width of the input is not set appropriately 

			Object.assign(this.data, this.savepoint);
			this.createSavepoint();
		},
		'copyPassword': function() {
			let input = document.createElement('input');

			input.value = this.data.props.credentials.password;
			input.style.position = 'absolute';
			input.style.top = '-1000px';
			input.style.left = '-1000px';
			input.style.opacity = '0';
		
			document.body.appendChild(input);

			input.select();

			document.execCommand('copy');
			document.body.removeChild(input);
		},
		'focusInput': function(e) {
			let elem = e.target,
				input = elem.querySelector('input');

			if(!input)
				return;

			input.focus();
		}
	},
	'ready': function() {
		if(this.data.new) {
			this.data.new = false;
			this.toggleEdit();

			this.$el.scrollIntoView();
		}
	}
});
