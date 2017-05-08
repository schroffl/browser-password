'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		'less': {
			'production': {
				'options': {
					'compress': true
				},
				'files': {
					'ui/css/popup.css': 'ui/less/popup.less'
				}
			}
		},
		'crx': {
			'publicExtension': {
				'src': [ 'manifest.json', 'LICENSE', 'content-script.js', 'background/**', 'ui/**', '!ui/less'  ],
				'dest': 'dist/public.zip'
			},
			'signedExtension': {
				'src': [ 'manifest.json', 'LICENSE', 'content-script.js', 'background/**', 'ui/**', '!ui/less' ],
				'dest': 'dist/signed.crx',
				'options': {
					'privateKey': 'private_key.pem'
				}
			}
		}
	});
	

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-crx');

	grunt.registerTask('default', [ 'less', 'crx' ]);
};
