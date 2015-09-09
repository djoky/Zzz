var casper = require('casper').create();
casper.start("http://docs.seleniumhq.org/download/");

casper.viewport(1364, 768).then(function() {
	this.wait(15000);
	
    this.click('#mainContent>p>a');
});

casper.wait(10000);

casper.then(function() {
    this.capture("searched.png");
});

casper.run();
