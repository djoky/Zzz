/*
Author: Prateek
Description:Delete a cell, navigate to another notebook, then navigate back, the deleted cell should remain deleted.
*/

//Begin Test
casper.test.begin("deleting the created markdown cell ", 8, function suite(test) {
	var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var errors = [];
    var input_code = 'a<-25 ; print a';
    var temp;// To store the URL address
    
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
    
    //create a new notebook
    functions.create_notebook(casper);
    
    //change the language from R to Markdown
    casper.then(function(){
		this.mouse.click({ type: 'xpath' , path: ".//*[@id='prompt-area']/div[1]/div/select"});//x path for dropdown menu
		this.echo('clicking on dropdown menu');
		this.wait(2000);
	});
	
	//selecting Markdown from the drop down menu
	casper.then(function(){
		this.evaluate(function() {
			var form = document.querySelector('.form-control');
			form.selectedIndex = 0;
			$(form).change();
		});
	});

	//create a new cell
	casper.then(function(){
		functions.addnewcell(casper);
		console.log('markdown Language is selected from the drop down menu');
	});
	
	//adding contents to the newly created Markdown cells
	functions.addcontentstocell(casper, input_code);
	
	//verfying the results
	casper.then(function(){
		this.test.assertVisible({type:'xpath', path:".//*[@id='part1.md']/div[3]/div[2]/p"}, 'Cell gets executed');
		console.log('Output is visible after cell gets executed');
	});
	
	//Deleting the created cell
	casper.wait(3000,function(){
		this.click({type:'xpath', path:".//*[@id='part1.md']/div[2]/div[2]/span[6]/i"});
		console.log('clicking on Delete icon');
		this.wait(2000);
		this.test.assertNotVisible({type:'xpath', path:".//*[@id='part1.md']/div[3]/div[2]/p"}, 'Cell gets deleted after clicking on Delete icon');
	});
	
	casper.then(function(){
		temp = this.getCurrentUrl();// after deleting cell, fetching the URL and storing it in a variable temp
	});
	
	// Creating a new notebook
	functions.create_notebook(casper);
	
	//Switch back to the previous notebook and verify the cell gets deleted or not
	casper.wait(5000,function(){
		this.thenOpen(temp);
		this.wait(5000);
	});
	
	casper.then(function(){
		this.test.assertNotVisible({type:'xpath', path:".//*[@id='part1.md']/div[3]/div[2]/p"}, 'The deleted cell is not visible after navigating from anothe notebook');
	});
	
		
	//Registering to the page.errors actually not required but still if there are some errors found on the page it will gives us the details
	casper.on("page.error", function(msg, trace) {
	  this.echo("Error:    " + msg, "ERROR");
	  this.echo("file:     " + trace[0].file, "WARNING");
	  this.echo("line:     " + trace[0].line, "WARNING");
	  this.echo("function: " + trace[0]["function"], "WARNING");
	  errors.push(msg);
	});
	
	casper.run(function() {
	  if (errors.length > 0) {
		this.echo(errors.length + ' Javascript errors found', "WARNING");
	  } else {
		this.echo(errors.length + ' Javascript errors found', "INFO");
	  }
	  test.done();
	});
});
	
	

	
	
