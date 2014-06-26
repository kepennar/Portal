exports.config = {
	allScriptsTimeout: 11000,

	seleniumAddress: 'http://localhost:4444/',
	baseUrl: 'http://localhost:8000/',
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