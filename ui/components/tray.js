Vue.component('tray', {
	'props': [ 'data' ],
	'data': function() {
		return {
			'editing': false,
			'editCopy': null
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
					<input type="text" class="tray-name edit-name" v-model="editCopy.name" v-if="editing" />

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
				<div class="tray-editor-section" v-for="(name, prop) in editCopy.props">
					<h3>{{ name }}</h3>
					
					<dl class="section-content">
						<div v-for="(key, val) in prop" class="key-value-pair" v-on:click.stop="focusInput">  
							<dd>{{ key }}:</dd>
							<dt>
								<light-input v-model="prop[key]" :min="10" :max="130" :name="key">
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
				this.editCopy = JSON.parse(JSON.stringify(this.data));
			else {
				this.$emit('save');

				Object.assign(this.data, this.editCopy);

				this.editCopy = null;
			}

			this.editing = !this.editing;
		},
		'undoChanges': function() {
			this.editCopy = JSON.parse(JSON.stringify(this.data));
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