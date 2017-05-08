'use strict';

const extensionSource = [ 'manifest.json', 'LICENSE', 'content-scripts/**/*', 'background/**/*', 'ui/**/*', '!ui/less/**/*'  ];

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
		}
	});
	

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-crx');

	grunt.registerTask('default', [ 'less', 'crx' ]);
};
