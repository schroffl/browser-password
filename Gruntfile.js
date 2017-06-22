'use strict';

const extensionSource = [ 'temp/**/*' ];

module.exports = function(grunt) {
	grunt.initConfig({
		'copy': {
			'main': {
				'files': [
					{ 'expand': true, 'src': 'manifest.json', 'dest': 'temp' },
					{ 'expand': true, 'src': 'ui/**', 'dest': 'temp/ui' },
					{ 'expand': true, 'src': 'background/**', 'dest': 'temp/background' },
					{ 'expand': true, 'src': 'content-scripts/**', 'dest': 'temp/content-scripts' }
				]			
			}
		},
		'less': {
			'production': {
				'options': {
					'compress': true
				},
				'files': {
					'temp/ui/css/popup.css': 'temp/ui/less/popup.less'
				}
			}
		},
		'crx': {
			'publicExtension': {
				'src': extensionSource,
				'dest': 'dist/public.zip'
			},
			'signedExtension': {
				'src': extensionSource,
				'dest': 'dist/signed.crx',
				'options': {
					'privateKey': 'private_key.pem'
				}
			}
		},
		'clean': [ 'temp/' ]
	});
	

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-crx');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', [ 'copy', 'less', 'crx', 'clean' ]);
};
