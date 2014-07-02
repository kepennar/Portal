exports.config = {
	
	// Run e2e tests on sauce lab when project is build on Travis
	if (process.env.TRAVIS) {	
		sauceUser = process.env.SAUCE_USERNAME;
		sauceKey = process.env.SAUCE_ACCESS_KEY;
		capabilities = {
			'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER
			'build': process.env.TRAVIS_BUILD_NUMBER
		}
	}
	allScriptsTimeout: 11000,
	baseUrl: 'http://localhost:9001/app/',
	capabilities.browserName: 'firefox'
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