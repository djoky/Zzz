/* 
 Author: Prateek
 Description: This is a casperjs automated test script for showing that,Delete a R cell from a notebook and navigate to another notebook,
 * then navigate back, the deleted cell should remain deleted.
 */

//Begin Tests

casper.test.begin("Checking for deleted R cell, whether it is present or not after navigating from another notebook ", 9, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input1 = "a<-100+50\n a";
    var input2 = "b<-200+50\n b";
    var notebookid;
    var notebookid1;
    var title;

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
    
    //Get notebook title
    casper.then(function () {
        title = functions.notebookname(casper);
        this.echo("New Notebook title : " + title);
        this.wait(3000);
    });

    //getting Notebook ID
    casper.viewport(1024, 768).then(function () {
        var temp1 = this.getCurrentUrl();
        notebookid = temp1.substring(41);
        this.echo("The Notebook Id: " + notebookid);
    });

    //add a new cell and execute its contents
    functions.addnewcell(casper);
	
	casper.then(function () {
		this.sendKeys({type:'xpath', path:'/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[1]/div[1]/pre/code'}, input1);
		console.log('adding contents to first cell');
	});
	
	functions.addnewcell(casper);
	
	casper.then(function () {
		this.sendKeys({type:'xpath', path:'/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[2]/div/div[2]/div'}, input2);
		console.log('adding contents to second cell');
	});
	
	functions.runall(casper);
	
	casper.wait(5000);
	
	//Deleting the cells from notebook
	casper.then(function () {
		var z = casper.evaluate(function () {
                $('.icon-trash').click();
			});
		console.log('deleted R cell');
	});
	
	casper.wait(5000);
	
	//Check for the deleted cell
	casper.then(function () {
		if(this.test.assertDoesntExist('.r.hljs','Deleted cells doesnt exist'))
		{
			this.test.pass('cell is deleted');
		}else{
			this.test.fail('cell is still present');
		}
	});	
	
	//creating another new notebook
	functions.create_notebook(casper);
	
	//getting Notebook ID
    casper.viewport(1024, 768).then(function () {
        var temp2 = this.getCurrentUrl();
        notebookid1 = temp2.substring(41);
        this.echo("The Notebook Id: " + notebookid1);
    });
    
    //switch back to the previous notebook
    casper.viewport(1366, 768).then(function () {
        sharedlink = "http://127.0.0.1:8080/edit.html?notebook=" + notebookid;
        this.thenOpen(sharedlink, function () {
            this.wait(7000);
            this.echo("Opened the edit.html of the published notebook " + title);
        });
    });
	
	//Check for the deleted cell
	casper.then(function () {
		if(this.test.assertDoesntExist('.r.hljs','Deleted cells doesnt exist'))
		{
			this.test.pass('cell is deleted');
		}else{
			this.test.fail('present');
		}
		//console.log('deleted cell doesnt exists');
	});	
	
	casper.run(function () {
        test.done();
    });
});
	
		
		
		
