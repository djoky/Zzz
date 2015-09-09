/* 
 Author: Prateek
 Description:    This is a casperjs automated test script for showing that if the cursor is placed at start of the cell, 
 				 no new cell is created when cell  is split
 */

//Begin Tests

casper.test.begin("Split cell when cursor placed at the start of a cell", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var input_code1 = '"Exit"';
    var input_code2 = "  ";
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;

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
    //Add new notebook
    casper.then(function(){
		functions.create_notebook(casper); 
		this.wait(5000);
		
    });
    
    //getting Notebook ID
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });
    
    //Added a new cell 
    functions.addnewcell(casper);
	
	// Add contents to cell and execute it
    functions.addcontentstocell(casper, input_code1);
    
    //clicking on executed cell or clicking on first cell
	casper.viewport(1024, 768).then(function(){
		this.click({ type : 'xpath' , path :'/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[1]/div[2]/div/textarea'});
		this.echo("Clicking on cell");
		this.wait(7000);
	
	//clicking split icon
		var z = casper.evaluate(function () {
            $('#part1.R .icon-unlink').click();
			});
		this.test.assertDoesntExist({ type :  'xpath' , path : '/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[2]'}, 'Second cell doesnot exist after clicking on split icon');
		//this.echo('Second cell doesnot exist after clicking on split icon');
	});
			
    casper.run(function () {
        test.done();
    });
});

