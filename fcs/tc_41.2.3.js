/*
Author: Prateek
Description:    This is a casperjs automated test script for showing that, Clicking on the Stop button stops the execution of the 
* executing waiting cells and show canalled status indicated by splat
*/

//Begin Tests

    casper.test.begin("Checking whether, Clicking on the Stop button stops the execution of the executing waiting cells and show canalled status indicated by splat", 4, function suite(test) {

        var x = require('casper').selectXPath;
        var github_username = casper.cli.options.username;
        var github_password = casper.cli.options.password;
        var rcloud_url = casper.cli.options.url;
        var notebook_id = "95a75c9f62f95adc2469";
		var title;
        var functions = require(fs.absolute('basicfunctions'));
        var temp;
        var temp1;

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
        
        //open notebook belonging to some different user
		casper.viewport(1366, 768).thenOpen('http://127.0.0.1:8080/main.html?notebook=' + notebook_id, function () {
        this.wait(10000);
        this.then(function () {
            title = functions.notebookname(casper);
            this.echo("Notebook title : " + title);
            this.wait(3000);
			});
		});

		//get the notebook owner's name and verify that it belongs to a different user
		casper.then(function () {
        var author = this.fetchText({type: 'css', path: '#notebook-author'});
        this.echo("Notebook author: " + author);
        this.test.assertNotEquals(author, github_username, "Confirmed that notebook belonging to different user has been opened");
		});
		
		casper.then(function() {
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});			
			console.log('Clicking on run icon of first cell');
			
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});
			//this.wait(3000);
			console.log('Clicking on run icon of second cell');
			
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});
			console.log('Clicking on run icon of third cell');
			
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});
			console.log('Clicking on run icon of fourth cell');
			
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});
			console.log('Clicking on run icon of fifth cell');
			
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});
			console.log('Clicking on run icon of sixth cell');
			
			this.click({type: 'xpath', path: '/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[2]/div[2]/span[1]/i'});
			console.log('Clicking on run icon of seventh cell');
		});
		
		
		casper.then(function(){
			this.evaluate(function() {
				document.querySelector('#run-notebook').click();
			});
			console.log('Clicking on stop icon');
		});
		
		casper.wait(5000);
		
		casper.then(function(){
			var e = this.getElementInfo({type: 'xpath', path:"/html/body/div[2]/div/div[2]/ul[1]/li[6]/button/i"}).tag;
            temp = e.substring(10,19);
            this.echo('Current icon for run all button is :' + temp);
            this.wait(2000);
        });
        
		casper.run(function () {
        test.done();
    });
});
			
		
		
		
			
		
		
		
