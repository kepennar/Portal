exports.config = {
		
	allScriptsTimeout: 11000,
	seleniumAddress: 'http://localhost:4444/wd/hub',
	baseUrl: 'http://localhost:9001/',
	//capabilities: {
	//	'browserName': 'chrome'
	//},

	specs: [
    	'e2e/*.js'
  	],

  	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};