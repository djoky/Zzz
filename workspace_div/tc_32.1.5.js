/*
Auther : Tejas
Description:    This is a casperjs automated test script for showing that workspace div will display updated variable values
*/

//Begin test
casper.test.begin("Display updated variable value in workspace div", 8, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;//to get the notebook id
	var input_content_1="a<-12"; // numeric variable initialisation
	var input_content_2="a<-95"; // updated numeric value
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
    
    casper.then(function(){
		functions.create_notebook(casper); 
		this.wait(5000);		
    });
    
    // Initialising the numeric variable
    casper.then(function(){
		this.wait(15000);
		console.log("adding new cell");
		functions.addnewcell(casper);
		this.wait(10000);
	});
	
	casper.then(function(){
		console.log("initialising the variable and executing the cell");
		functions.addcontentstocell(casper, input_content_1);
    	this.wait(5000);
	});
	casper.then(function(){
		casper.evaluate(function () {
                $('#accordion-right .icon-sun').click();
        });	
        this.wait(10000);
        this.then( function () {
			this.test.assertSelectorHasText({ type: 'css', path: '#enviewer-body > table:nth-child(1) > tr:nth-child(2) > td:nth-child(3)'},"12");
        });
        console.log("Initial value is 12");
	});
	
	// Updatting the variable value
	casper.then(function(){
		functions.addnewcell(casper); //adding new cell
		this.wait(15000);
	  });
	  
	  casper.then(function(){
		this.sendKeys('div.ace_editor.ace-chrome:nth-child(1) > textarea:nth-child(1)', input_content_2 );
		this.wait(15000);
      });  
    
    casper.then(function(){    
        //this.mouse.click("#part2\.R > div:nth-child(1) > div:nth-child(1) > table:nth-child(1) > td:nth-child(3) > span:nth-child(1) > i:nth-child(1)");
		//this.wait(10000);
		functions.runall(casper);
		
	});
	
	casper.then(function(){
		this.wait(15000);
		this.test.assertSelectorHasText({ type: 'css', path: '#enviewer-body > table:nth-child(1) > tr:nth-child(2) > td:nth-child(3)'},"95","Initial value is updated with the new one"); 
        console.log("Initial value is updated and now it is 95");  
	}); 
	casper.run(function () {
        test.done();
    });
});
