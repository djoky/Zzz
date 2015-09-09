/* 
 Author: Tejas
 Description:This is a casperjs automated test script,For the given combination, selecting Coalesce Cell option for the bottom 
 * cell results in merging of the bottom cell with the top one. The content of R cell is enclosed within "…{r}" and "…"
 */

//Begin Tests

casper.test.begin("Combination of R cell on top and Markdown cell beneath it", 6, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));

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
    //Add new notebook
    functions.create_notebook(casper); 
    
    //change the language from R to Python
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
		console.log('Markdown Language is selected from the drop down menu');
	});
	
	functions.addnewcell(casper);
	
	//change the language to R
    casper.then(function(){
		this.mouse.click({ type: 'xpath' , path: ".//*[@id='prompt-area']/div[1]/div/select"});//x path for dropdown menu
		this.echo('clicking on dropdown menu');
		this.wait(2000);
	});
	
	//selecting Python from the drop down menu
	casper.then(function(){
		this.evaluate(function() {
			var form = document.querySelector('.form-control');
			form.selectedIndex = 1;
			$(form).change();
		});
		console.log('R Language is selected from the drop down menu');
	});
	
		
    //Add new cell
    functions.addnewcell(casper);
    
    //Adding contents to the first cell
    casper.then(function(){
		this.sendKeys({type:'css', path:"div.edit-markdown > div:nth-child(3) > div:nth-child(1)"},'a<-12;b<-12;a+b');
	});
	
	//adding contents to the second cell
	casper.then(function(){
		this.click({type:'css', path:'div.edit-code > div:nth-child(3) > div:nth-child(1)'});
		this.sendKeys({type:'css', path:'div.edit-code > div:nth-child(3) > div:nth-child(1)'},'a<-12;b<-12;a=b');
	});
    
    casper.wait(2000);
    
    functions.runall(casper);
    
    casper.then(function(){
		var z = casper.evaluate(function () {
                    $('.icon-link').click();
        });
	});
    
    //Verifying and valiadting
    casper.viewport(1024, 768).then(function(){	
		this.wait(3000);
		casper.test.assertSelectorHasText({type:'xpath', path:".//*[@id='part1.md']/div[3]/div[1]/div[1]/pre/code"},'```{r}','The content of R cell is enclosed within "…{r}" and "…"');
	});
    
    casper.run(function () {
        test.done();
    });
});

