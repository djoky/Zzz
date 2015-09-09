/*
 Author: Prateek
 Description:To insert a Markdown cell with respect to a R cell i.e, insert a Markdown cell by clicking on the '+' icon
 * present on top of the R Cell and changing the language
 */


//Begin Test
casper.test.begin("Creating Markdown cells on top of existing Markdown cell ", 8, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

    var input_code = 'a<-25 ; print a';

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

    //Creating a new notebook
    functions.create_notebook(casper);

	//change the language from R to Markdown
    casper.then(function () {
        this.mouse.click({type: 'xpath', path: ".//*[@id='part2.R']/div[2]/div[2]/select"});//x path for dropdown menu
        this.echo('clicking on dropdown menu');
        this.wait(2000);
    });

    //selecting Markdown from the drop down menu
    casper.then(function () {
        this.evaluate(function () {
            var form = document.querySelector('.form-control');
            form.selectedIndex = 0;
            $(form).change();
        });
    });
    
    
    casper.then(function(){
		this.click({type:'xpath', path:'//html/body/div[3]/div/div[2]/div/div[3]/div[1]/div/span/i'});
		this.click({type:'xpath', path:'//html/body/div[3]/div/div[2]/div/div[3]/div[1]/div/span/i'});
		this.wait(3000);
		this.clcik({type:'xpath', path:'/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div'});//click on 1st cell
		this.sendKeys({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div"}, input_code);//add contents to 1st cell
		this.wait(2000);
	});
	
	functions.runall(casper);
    
    casper.then(function(){
		this.click({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[2]/div/div[2]/div"});
		this.sendKeys({type:'xpath', path:"/html/body/div[3]/div/div[2]/div/div[1]/div[2]/div[3]/div[1]/div[2]/div/div[2]/div"}, input_code);//contents to second cell
		this.wait(2000);
	});
	
	functions.runall(casper);
		
	casper.run(function () {
        test.done();
    });
});
