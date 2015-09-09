/* 
 Author: Arko
 Description:    This is a casperjs automated test script for showning that,When a text not present in any of 
 * the notebooks is entered for Text Search, an error message: "no results found" is displayed

 */

//Begin Tests

casper.test.begin(" Lowercase letters for Example: rnorm, function, print", 5, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var item = '"functi"';//item to be searched
    var title;//get notebook title
    	

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

    //function to search the entered item
    casper.viewport(1024, 768).then(function () {
        if (this.visible('#search-form')) {
            console.log('Search div is already opened');
        }
        else {
            var z = casper.evaluate(function () {
                $('.icon-search').click();
            });
            this.echo("Opened Search div");
        }
        //entering item to be searched
        casper.then(function () {
            if (this.visible('#input-text-search')) {
                console.log('Search div is already opened');
            }
            else {
                var z = casper.evaluate(function () {
                    $(' .icon-search').click();
                });
                this.echo("Opened Search div");
            }
        });
        //entering item to be searched
        casper.then(function () {
            this.sendKeys('#input-text-search', item);
            this.wait(6000);
            this.click('#search-form > div:nth-child(1) > div:nth-child(2) > button:nth-child(1)');
        });

        casper.wait(5000);

        casper.then(function () {
            this.test.assertSelectorHasText({
                type: 'xpath',
                path: ".//*[@id='search-summary']/h4"
            }, 'No Results Found', 'For empty notebook "No Results Found" text is displayed');
            this.echo("search item doesnot parse special charaters");
        });

        casper.run(function () {
            test.done();
        });
    });
});
