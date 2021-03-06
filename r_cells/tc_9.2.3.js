/*
    Author: Prateek
    Description: This is a casperjs automated test script for showing that,From a notebook whether user is able to 
    * delete the R cell or cells from notebook
    */
    
    //Begin Tests
    
    casper.test.begin("Checkin whether user is able to delete the cells from a notebook", 5, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input1 = "a<-100+50;a";
    var input2 = ';b<-200+50;b';
    var output;
    var output1;
    
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
    
    //add a new cell and execute its contents
    functions.addnewcell(casper);
    
    casper.then(function () {
        this.sendKeys({
            type: 'xpath',
            path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[1]/div[1]/pre/code'
        }, input1);
        console.log('adding contents to first cell');
    });
    
    functions.runall(casper);
    
    casper.then(function () {
        output = this.fetchText('.r-result-div');
        this.echo('First cells output after cell execution is : ' + output);
    });
    
    casper.wait(5000);
    
    casper.then(function () {
        var z = casper.evaluate(function () {
            $('.icon-edit').click();
        });
        console.log('Clicking on toggle edit icon to add the contents');
    });
    
        casper.then(function () {
            this.sendKeys({
                type: 'xpath',
                path: '/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[1]/div[1]/pre/code'
            }, input2);
            console.log('again adding contents to first cell after clicking on toggle icon');
        });
    
        functions.runall(casper);
    
        casper.then(function () {
            output1 = this.fetchText('.r-result-div');
            this.echo('After modifying the cell, by adding contents to it again the output is :' + output1);
        });
    
        casper.then(function () {
            if (output != output1) {
                this.test.pass('contents are added after clicking on toggle icon');
            } else {
                this.test.fail('contents are  not added');
            }
        });
    
            casper.run(function () {
                test.done();
            });
        });
    
    
    
    
