/*
Author: Prateek
Description:    This is a casperjs automated test script for showing that, 
* Clicking on the Stop button changes it to Run-All button
*/
//Test begins
casper.test.begin("Stop icon changes to Run-all", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebook_id = "d147cf455f9b3a019d32";//slow notebook id
    var res;
    var res1;
    var actual_res = 'icon-play';
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
    
    //open mark down notebook belonging to some different user
    casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/main.html?notebook=' + notebook_id, function () {
        this.wait(10000);
        this.then(function () {
            title = functions.notebookname(casper);
            this.echo("Notebook title : " + title);
            this.wait(3000);
        });
    });
    
    functions.fork(casper);
    
    //clicking on Run-all button
    casper.then(function(){
		var x = casper.evaluate(function () {
			$('#run-notebook').click();
		});
		var x = this.getElementInfo({type:'xpath', path:'/html/body/div[2]/div/div[2]/ul[1]/li[6]/button'}).tag;
		res = x.substring(113, 122);
		console.log('button status before clicking on Run-all :' +res )
		
	});
    
    //casper.wait(2000);
    
    //Clicking on Stop button
    casper.then(function(){
		var y = this.getElementInfo({type:'xpath', path:'/html/body/div[2]/div/div[2]/ul[1]/li[6]/button'}).tag;
		res1 = y.substring(110, 119);
		console.log('button status after clicking on Stop button :' +res1 )
		
		this.evaluate(function() {
			document.querySelector('#run-notebook').click();
		});
		console.log('Clickin on Stop icon');
	});
	
	casper.wait(5000);
	
	//Verifying whether execution has been stopped or not
	casper.then(function(){
		var temp = this.getElementInfo({type:'xpath', path:'/html/body/div[2]/div/div[2]/ul[1]/li[6]/button'}).tag;
		status = temp.substring(113, 122);
		if (actual_res == status)
		{
			this.test.pass('Stop icon is changed from icon-stop to ' + status);
		}else
		{
			this.test.fail('Icon has not changed from icon-stop to icon-play');
		}
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
