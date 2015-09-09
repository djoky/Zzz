/*
 Author: Prateek
 Description:    This is a casperjs automated test script for showning that,In the view.html page of the notebook, 
 * the cell numbers for every cell should not be displayed when 'Show Cell Numbers' option is disabled from the settings div
 */

casper.test.begin("Hide Cell numbers in view mode", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid = 'cd5e448252d0bc06f891';//to load the notebook id
    var actual_cell = 'cell 1';

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });

    casper.wait(10000);

    //login to Github and RCloud
    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
        this.wait(4000);

    });

    //Loading Notebook having FastRWeb code
    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid, function () {
        this.wait(5000);
        this.waitForSelector({type: 'css', path: '#share-link .icon-share'}, function () {
            console.log("Verified that page is loaded successfully");
        });
    });

    casper.then(function(){
        if (this.visible('.form-control-ext'))
        {
            console.log('settings div is already opened');
        }else
        {
            console.log('Opening settings div');
            this.click({type:'xpath', path:".//*[@id='accordion-left']/div[3]/div[1]/a/span"});
        }//if ends
        this.wait(2000);
        this.click({type:'xpath', path:".//*[@id='settings-body']/div[3]/label/span"});
        console.log('Clicking on Show cell numbers check box option');
    });

    casper.wait(2000);

    casper.then(function(){
        this.click({type:'xpath', path:".//*[@id='view-mode']/b"});
        console.log('clicking on shareable link drop down menu');
        this.wait(3000);
        if (this.test.assertVisible({type:'xpath', path:".//*[@id='view-type']/li[1]/a"}))
        {
            console.log('view.html is visible under drop down menu hence opening it');
        }else
        {
            console.log('view.html is not visible under drop down menu');
        }
    });

    //Now opening Notebook in view.html
    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/view.html?notebook=' + notebookid, function () {
        this.wait(10000);
    });

    casper.wait(3000);

    casper.then(function(){
        this.test.assertDoesntExist('#part1\.R > div:nth-child(1) > div:nth-child(1) > span:nth-child(4)','Cell numbers are not visible');
    });
    
    casper.thenOpen('http://127.0.0.1:8080/edit.html?notebook=' + notebookid, function () {
		this.wait(10000);
	});
	
	//MAking check box default settings so that it wont affect next test scripts
	casper.then(function(){
		this.wait(3000);
		if (this.visible('.form-control-ext'))
        {
            console.log('settings div is already opened');
        }else
        {
            console.log('Opening settings div');
            this.click({type:'xpath', path:".//*[@id='accordion-left']/div[3]/div[1]/a/span"});
        }//if ends
        this.wait(2000);
        this.click({type:'xpath', path:".//*[@id='settings-body']/div[3]/label/span"},'Clicking on Show cell numbers check box option');
    });

    casper.run(function () {
        test.done();
    });
});

