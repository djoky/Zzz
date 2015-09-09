/*
 Author: Prateek
 Description:On clicking the 'x' option beside the asset name in the Asset div, the asset should get removed from the notebook. 
 */

//Begin Test
casper.test.begin("Deleting an Assets div", 4, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var asset_name = 'NEW_ASSET.R';

    casper.start(rcloud_url, function () {
        casper.page.injectJs('jquery-1.10.2.js');
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
    });

	//Create a new Notebook.
    functions.create_notebook(casper);
    
    casper.then(function () {
        var url = this.getCurrentUrl();
        this.thenOpen(url);
        this.wait(3000);
    });

    casper.then(function () {
        console.log('Clicking on new asset to create an new asset');
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Choose a filename for your asset") {
                return asset_name;
            }
        });
        this.click("#new-asset>a");
        this.echo("Creating a new asset");
        this.wait(2000);
    });
    
    casper.then(function () {
		this.exists('.active>a>span');
		console.log('Newly created asset exists');
	});
	
	//Deleting a created asset
	casper.then(function () {
		this.click({type:'css', path:"li.active > a:nth-child(1) > span:nth-child(2) > i:nth-child(1)"});
		console.log('clicking on delete icon');
		this.test.assertSelectorDoesntHaveText({type:'xpath', path:".//*[@id='asset-list']"}, asset_name, "Newly created asset gets deleted");
	});
	
	casper.run(function () {
        test.done();
    });
});

