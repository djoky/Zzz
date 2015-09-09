/* 
 Author: Prateek
 Description:This is a casperjs automated test script for showing that,The user should be able to import multiple notebooks simultaneously by 
 * specifying their Notebook IDs
*/

//Begin Tests
casper.test.begin("Import External Notebooks without Prefix", 4, function suite(test) {

    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var Notebook_Name = 'Reading xls file'; //Importing notebook's name
    var Notebook_Name1 = 'slowbookJUst'; //Importing notebook's name

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

    //open the Advanced Dropdown 
    functions.open_advanceddiv(casper);

    casper.then(function () {
        this.evaluate(function () {
            $('#import_notebooks').click();
        });
        this.echo('opened import notebook dialog box');
        this.wait(2000);
        casper.evaluate(function () {
            $('#import-gists').val('9ae0235877d1152511df','\9abb01c4c0fc42bdbe8f');
        });
        this.echo('Entering notebook ID');
        this.wait(2000);
        this.evaluate(function () {
            $('#import-notebooks-dialog span.btn-primary').click();
            console.log("Clicking on import button");
        });
    });

    casper.wait(2000);

    casper.then(function () {
        for (var i = 1; i < 10; i++) {
            var text = this.fetchText({
                type: 'xpath',
                path: ".//*[@id='editor-book-tree']/ul/li[1]/ul/li[1]/ul/li[" + i + "]/div/span[1]"
            });
        }
        this.wait(5000);
        this.test.assertSelectorHasText({
            type: 'xpath',
            path: ".//*[@id='editor-book-tree']"
        }, Notebook_Name, "Imported Notebook " + Notebook_Name +" is visible under my notebook tree");
        
        //~ this.test.assertSelectorHasText({
            //~ type: 'xpath',
            //~ path: ".//*[@id='editor-book-tree']"
        //~ }, Notebook_Name1, "Imported Notebook " + Notebook_Name1 +" is visible under my notebook tree");
    });

    casper.run(function () {
        test.done();
    });
});

