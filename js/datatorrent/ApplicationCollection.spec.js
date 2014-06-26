/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
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

var Collection = require('./ApplicationCollection');
describe('ApplicationCollection.js', function() {
    
	var sandbox;

	beforeEach(function() {
	    sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
	    sandbox.restore();
	});

	it('should set the dataSource if provided in the options', function() {
		var dataSource = {};
	    var c = new Collection([], { dataSource: dataSource });
	    expect(c.dataSource).to.equal(dataSource);
	});

	it('should fetch from the server if the number of running applications has changed.', function() {
	    sandbox.stub(Collection.prototype, 'fetch');

	    var c = new Collection([
		    { id: 'app1', state: 'RUNNING' },
		    { id: 'app2', state: 'RUNNING' },
		    { id: 'app3', state: 'FAILED' }
	    ], { dataSource: {} });

	    c.setRunning([
		    { id: 'app1', state: 'RUNNING' },
		    { id: 'app2', state: 'FAILED' },
		    { id: 'app3', state: 'FAILED' }
	    ]);

	    expect(Collection.prototype.fetch).to.have.been.calledOnce;
	});

	describe('the fetch method', function() {

		var dataSource, c;

		beforeEach(function() {
		    dataSource = {};
	    	c = new Collection([], { dataSource: dataSource });
		});

	    it('should pass the option data.states=RUNNING,SUBMITTED,ACCEPTED by default', function() {
	   		sandbox.stub($, 'ajax', function(options) {
	   			expect(options).to.have.property('data');
	   			expect(options.data).to.eql({ states: 'RUNNING,SUBMITTED,ACCEPTED' });
	   		});
	   		c.fetch();
	    });

	    it('should add the option data.states=RUNNING,SUBMITTED,ACCEPTED to an existing options that gets passed', function() {
	    	sandbox.stub($, 'ajax', function(options) {
	   			expect(options).to.have.property('data');
	   			expect(options.data).to.eql({ states: 'RUNNING,SUBMITTED,ACCEPTED' });
	   			expect(options.async).to.equal(false);
	   		});
	   		c.fetch({
	   			async: false
	   		});
	    });

	    it('should not add the option data.states=RUNNING to an existing options that gets passed if data is already set', function() {
	    	sandbox.stub($, 'ajax', function(options) {
	   			expect(options).to.have.property('data');
	   			expect(options.data).to.eql({ param: 'value' });
	   		});
	   		c.fetch({
	   			data: {
	   				param: 'value'
	   			}
	   		});
	    });
	});

});