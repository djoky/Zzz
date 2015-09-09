/*
 Author: Prateek
 Description:    This is a casperjs automated test script for showning that, The cell numbers are not displayed
 *  for any cell of the notebook
 */

//Test begins
casper.test.begin(" Checking cell numbers are visible or not", 8, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var i;
    var errors = [];

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

    //add new cell
    functions.addnewcell(casper);

    //add new cell
    functions.addnewcell(casper);

    //add new cell
    functions.addnewcell(casper);

	//Settings div is open or not
    casper.then(function(){
        if (this.visible('.form-control-ext')) {
            console.log('Settings div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $(' .panel-heading').click();
            });
            this.echo("Opened Settings div");
        }
    });

    casper.wait(3000);

    casper.then(function(){
        if(this.test.assertVisible({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div/div[2]/div[1]/span[4]"}))
        {
            console.log('cell numbers are visible so clicking on ckeck box to hide cell numbers');
            this.click({type:'xpath', path:'/html/body/div[3]/div/div[1]/div[1]/div/div/div[3]/div[2]/div/div/div/div[3]/label/span'});
        }else
        {
            console.log('cell numbers are not visible');
        }
    });

	casper.wait(4000);
     
    casper.then(function(){
		 if(test.assertDoesntExist({type:'xpath', path:"span.left-indicator:nth-child(4)"},'chcking for the cell numbers'))
		{
			console.log('cell numbers are not visible');
		}else{
			console.log('cell numbers are visible');
		}
		this.click({type:'xpath', path:'/html/body/div[3]/div/div[1]/div[1]/div/div/div[3]/div[2]/div/div/div/div[3]/label/span'});
	});
		 
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






