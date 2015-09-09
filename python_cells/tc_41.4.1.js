//Begin Test
casper.test.begin("Executing a python cell with valid python code", 5, function suite(test) {
	var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var errors = [];
    var input = 'a=5 ; b=100 ; print a+b';
    var input2 = 'v=5 ; q=100 ; print v+q';
    
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
    
    //change the language from R to Python
    casper.then(function(){
		this.mouse.click({ type: 'xpath' , path: ".//*[@id='prompt-area']/div[1]/div/select"});//x path for dropdown menu
		this.echo('clicking on dropdown menu');
		this.wait(2000);
	});
	
	//selecting Python from the drop down menu
	casper.then(function(){
		this.evaluate(function() {
			var form = document.querySelector('.form-control');
			form.selectedIndex = 2;
			$(form).change();
		});
		console.log('Python Language is selected from the drop down menu');
	});

	//create a new cell
	functions.addnewcell(casper);
	functions.addnewcell(casper);
		
	//adding python code in to the cell
	casper.then(function(){
		this.sendKeys({type:'xpath', path:".//*[@id='part2.py']/div[3]/div[1]/div[2]/div/div[2]/div"}, input);
		this.echo('Entered code in second cell');
		this.click({type:'xpath', path:".//*[@id='part1.py']/div[3]/div[1]/div[2]/div/div[2]/div"});
		this.wait(2000);
		this.echo('clicking on 1st cell');
		this.sendKeys({type:'xpath', path:".//*[@id='part2.py']/div[3]/div[1]/div[2]/div/div[2]/div"},input2);	
		this.echo('Entering code in 1st cell');	
	});
	
	//to run the code
	functions.runall(casper);
	
	casper.then(function(){
		this.wait(7000);
		this.click({type:'css', path:'/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div'});
		this.sendKeys({type:'css', path:'/html/body/div[3]/div/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[2]/div/div[2]/div'},input2);		
	});
	
	
	
	casper.run(function () {
        test.done();
    });
});
