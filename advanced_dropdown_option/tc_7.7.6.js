/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showing that given a notebook is published, the users who are not logged in,
 can load the notebook using the Shareable link of the respective notebook
 */

//Begin Tests
casper.test.begin("Notebook name of published notebook in uneditable form", 6, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var notebookid;
    var title;
    var initialtitle;//to contain title of the published notebook after it is loaded 
    var newtitle;//to contain title of the published notebook after the title modification process is carried out

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

    //Now clicking on the advanced div
    functions.open_advanceddiv(casper);

    //clicking the checkbox to publish notebook
    casper.viewport(1024, 768).then(function () {
		this.wait(2000);
        var z = casper.evaluate(function () {
            $('.icon-check-empty').click();
            this.wait(3000);
		});
		this.echo("Clicking on publish notebook");
    //logout of RCloud & Github
		this.click({type:'xpath', path:".//*[@id='rcloud-navbar-menu']/li[5]/a"});
		console.log('Logging out of RCloud');	
        this.wait(3000);
    });
	
	casper.wait(5000);
    
    casper.viewport(1366, 768).then(function () {
        this.click({type: 'xpath', path: '/html/body/div[2]/p[2]/a[2]'}, "Logged out of Github");
        console.log('Logging out of Github');
        this.wait(10000);
    });

    casper.wait(10000);
    casper.viewport(1366, 768).then(function () {
        this.click(".btn");
        console.log('logged out of Github');
        this.wait(7000);
        this.echo("The url after logging out of Github : " + this.getCurrentUrl());
        this.test.assertTextExists('GitHub', "Confirmed that successfully logged out of Github");
	});

    //load the view.html of the Published notebook
    casper.viewport(1366, 768).then(function () {
        sharedlink = "http://127.0.0.1:8080/view.html?notebook=" + notebookid;
        this.thenOpen(sharedlink, function () {
        this.wait(7000);
        this.echo("Opened the view.html of the published notebook " + title);
        });
    });

    casper.wait(15000);

    //verify that the published notebook has been loaded
    casper.then(function () {
        publishedtitle = functions.notebookname(casper);
        this.echo("Published Notebook title : " + publishedtitle);
        this.test.assertEquals(publishedtitle, title, "Confirmed that the view.html of published notebook has been loaded");
    });

    //verify that notebook title is uneditable
    casper.then(function () {
        initialtitle = functions.notebookname(casper);
        this.echo("Present title of published notebook: " + initialtitle);
        var z = casper.evaluate(function triggerKeyDownEvent() {
            jQuery("#notebook-title").text("change");
            var e = jQuery.Event("keydown");
            e.which = 13;
            e.keyCode = 13;
            jQuery("#notebook-title").trigger(e);
            return true;
        });
        this.reload();
        this.wait(8000);
    });

    casper.then(function () {
        newtitle = functions.notebookname(casper);
        this.echo(10000);
        this.test.assertEquals(newtitle, initialtitle, "Confirmed that notebook title can't be modified");
    });

    casper.run(function () {
        test.done();
    });
});
