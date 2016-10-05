var Jasmine = require('jasmine');
var jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: "tests",
    spec_files: [
        "specs/**/*.js"
    ],
    helpers: [
        "helpers/**/*.js"
    ],
    stopSpecOnExpectationFailure: false,
    random: false
});

jasmine.execute();
