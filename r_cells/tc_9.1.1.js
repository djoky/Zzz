/* 
 Author: Prateek
 Description: Check whether code can be written in  R cell
 */

//Begin Tests

casper.test.begin("To write a code in the R cell ", 6, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var input_code = "a<-50+50\n a";
    var expectedresult = "100"

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
    functions.addcontentstocell(casper,input_code);
    
    casper.then(function () {
		this.wait(3000);
		this.test.assertSelectorHasText({type:'xpath' , path:'/html/body/div[3]/div/div[2]/div/div[1]/div/div[3]/div[2]'}, expectedresult, 'Code is written in the R cell');
	});
	
	casper.run(function () {
        test.done();
    });
});
    
