// Run e2e tests on sauce lab when project is build on Travis

var capabilities = {};
capabilities['browserName'] = 'chrome';
if (process.env.TRAVIS) {	
	console.log('Set Sauce Lab properties');
	sauceUser = process.env.SAUCE_USERNAME;
	sauceKey = process.env.SAUCE_ACCESS_KEY;
	capabilities['tunnel-identifier'] = process.env.TRAVIS_JOB_NUMBER;
	capabilities['build'] = process.env.TRAVIS_BUILD_NUMBER;
}
console.log('Capabilities: ', capabilities);
exports.config = {
	auceUser: process.env.SAUCE_USERNAME,
	sauceKey: process.env.SAUCE_ACCESS_KEY,
	capabilities: capabilities,
	
	allScriptsTimeout: 11000,
	baseUrl: 'http://localhost:9001/app/',

	specs: [
		'e2e/*.js'
	],

	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};