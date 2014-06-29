describe('Portal homepage', function() {
	browser.get('');

	it('sould redirect to /home when location hash/fragment is empty', function() {
		expect(browser.getLocationAbsUrl()).toMatch("/home");
	});

	describe('home', function() {

		//beforeEach(function() {
		//	browser.get('index.html#/home');
		//});

		it('should display link in top menu', function() {
			var topMenus = element.all(by.css('.navbar-top-links li'));
			expect(topMenus.count()).toBeGreaterThan(0);
		});

		it('should display link in left Menus', function() {
			var leftMenus = element.all(by.css('#side-menu li'));
			expect(leftMenus.count()).toBeGreaterThan(2);
		});
	});
});