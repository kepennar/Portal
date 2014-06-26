describe('Portal homepage', function() {
	browser.get('');

	it('sould redirect to /home when location hash/fragment is empty', function() {
		expect(browser.getLocationAbsUrl()).toMatch("/home");
	});

	describe('home', function() {

		beforeEach(function() {
			browser.get('index.html#/home');
		});


		it('should display link in top menu', function() {
			expect(element.all(by.css('.navbar-top-links')).first().getText()).
			toMatch(/partial for view 1/);
		});

	});
});