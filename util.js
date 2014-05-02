/*
 * Copyright (c) 2013 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// Walks a directory and gets an array of filenames
function walk (dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

/**
 * PRECOMPILE TEMPLATE FILES
 * 
 * Scans the js folder for all html files, 
 * then compiles them into template functions
 * and stores them in js/precompiled-templates.js.
 */
function precompileTemplates() {
	var result = 'var _ = require(\'underscore\'); exports = module.exports = {';
	// Walk the js directory
	walk('./js', function(err, res) {

		// filter for only html files
		var html_files = _.filter(res, function(filename) {
			return /\.html$/.test(filename);
		});

		_.each( html_files, function(path) {

			// Get the contents
			var html = fs.readFileSync(path, 'utf8');

			// Remove the ./js prefix, so that the 
			// path is relative to start.dev.js
			var key = path.replace(/^\.\/js/, '');

			// Create the function string
			var fn_string = _.template(html).source;

			// Append to result
			result += '"' + key + '": ' + fn_string + ',';

		});

		result = result.replace(/,$/, '');
		result += '};';

		fs.writeFileSync(path.normalize(__dirname + '/js/precompiled-templates.js'), result);

	});
}
exports.precompileTemplates = precompileTemplates;


/**
 * ADD LICENSE HEADERS
 * 
 * Scans js folders for all js files without the proper license
 * headers.
 */
function addLicenseHeaders(options) {
    var include = options.include;
    var exclude = options.exclude;
    var year = (new Date()).getFullYear();
	var license_re = require('./bin/license_regex');
    var license_string = require('./bin/license_header')();

	function doneFn (err, list) {

		if (err) {
			console.log('An error occurred');
		} else {
			var included = _.filter(list, function(item) {
				    
                // Only test js files
                if (!/\.js$/.test(item)) {
                    return false;
                }

                // Filter result variable
                var include = true;

                // Perform exclusions
                exclude.forEach(function(ex) {

                    // Test for regex excludes
                    if (ex instanceof RegExp) {
                        if (ex.test(item)) {
                            include = false;
                            return;
                        }
                    }
                    // Test for string excludes
                    else {
                        if (ex === item) {
                            include = false;
                            return;   
                        }
                    }
                });

                return include;

			});
			var already = 0;
			_.each(included, function(filepath) {
				var contents = fs.readFileSync(filepath);
                var match = license_re.exec(contents);
				if (!match) {
					fs.writeFileSync(filepath, license_string + contents);
					console.log('added license headers to: ' + filepath);
                } else if (match[1] != year) {
                    console.log('updating year: ' + filepath);
                    fs.writeFileSync(contents.replace(license_re, license_string));
				} else {
					already++;
				}
			});

			console.log(already + ' files already had license headers');
		}

	}

    include.forEach(function(incl) {
        walk(path.normalize(__dirname + incl), doneFn);
    });
}
exports.addLicenseHeaders = addLicenseHeaders;