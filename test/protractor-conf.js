exports.config = {
		
	allScriptsTimeout: 11000,
	baseUrl: 'http://localhost:9001/app/',
	capabilities: {
		'browserName': 'chrome'
	},

	specs: [
    	'e2e/*.js'
  	],

  	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};