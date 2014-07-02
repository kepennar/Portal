exports.config = {
		
	config.sauceUser = process.env.SAUCE_USERNAME;
	config.sauceKey = process.env.SAUCE_ACCESS_KEY;
	config.capabilities = {
		'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
		'build': process.env.TRAVIS_BUILD_NUMBER
	}
	allScriptsTimeout: 11000,
	baseUrl: 'http://localhost:9001/app/',
	capabilities: {
		'browserName': 'firefox'
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