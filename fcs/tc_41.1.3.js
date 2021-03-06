/*
Author: Prateek
Description:  This is a casperjs automated test script for showing thatExecuting cell status shows "Computing" and non-executed cell status shows "Waiting"

*/

//Test begins
casper.test.begin(" checking second cell status", 7, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code1 = "a<-50";
    var input_code2 = "b<- a+50";
    var input_code3 = "b";
    
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
    
    //Added a new cell 
    functions.addnewcell(casper);
    
    //Adding contents to first cell
    casper.then(function(){
		this.sendKeys({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div'}, input_code1);
		console.log("Adding contents to the first cell");
		this.wait(4000);
	});	
	
	//Added a new cell 
    functions.addnewcell(casper);
    
    //Adding contents to second cell
    casper.then(function(){
		this.sendKeys({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[1]/pre/code'}, input_code2);
		console.log("Adding contents to the second cell");
		this.wait(4000);
	});	
	
	//Added a new cell 
    functions.addnewcell(casper);
    
    //Adding contents to first cell
    casper.then(function(){
		this.sendKeys({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[3]/div[3]/div[1]/div[1]/pre/code'}, input_code3);
		console.log("Adding contents to the third cell");
		this.wait(4000);
	});	
	
	//Clicking on Run all icon
	functions.runall(casper);
	console.log("Clicking on Run All icon");
	
	//Verifying the results
	casper.then(function(){
		test.assertSelectorHasText({type : 'xpath' , path: '/html/body/div[3]/div/div[2]/div/div[1]/div[3]/div[3]/div[2]'}, '100',"The notebook's cells are executed sequentially");
		this.wait(5000);
		console.log("The notebook cells are executed sequentially");
	});
	
	casper.run(function () {
        test.done();
    });
});
    
    
    
    
    
    
    
    
    
