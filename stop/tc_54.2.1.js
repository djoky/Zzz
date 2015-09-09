/*
 Author: Prateek
 Description:    This is a casperjs automated test script for showning that,In the view.html page of the notebook, the cell numbers for every cell 
 * should be displayed when 'Show Cell Numbers' option is enabled from the settings div
 */

casper.test.begin("Show cell numbers in view mode", 4, function suite(test) {

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
		var i
        //fetching the cell numbers
        for(i=1;i<=3;i++)
        {
			var z = this.fetchText({type:'xpath', path:'/html/body/div[3]/div/div/div/div[1]/div[' + i + ']/div[1]/div/span[4]'});
			this.echo('Cell numbers for the notebook are:' + z );
		}
		var cell = this.fetchText({type:'xpath', path:'/html/body/div[3]/div/div/div/div[1]/div[1]/div[1]/div/span[4]'});
		if ( cell == actual_cell )
			{
				console.log('cell numbers are visible');
			}else
			{
				console.log('Cell numbers are not visible');
			}
    });

    casper.run(function () {
        test.done();
    });
});

