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

'use strict';

describe('Service: tableOptionsFactory', function () {

  // load the service's module
  beforeEach(module('app.components.services.tableOptionsFactory', function($provide){
    $provide.value('userStorage', {});
  }));

  var scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  // instantiate service
  var tableOptionsFactory;
  beforeEach(inject(function (_tableOptionsFactory_) {
    tableOptionsFactory = _tableOptionsFactory_;
  }));

  it('should be a function', function() {
    expect(typeof tableOptionsFactory).toEqual('function');
  });

  it('should extend the passed object with storage', function() {
    var result = tableOptionsFactory({
      row_limit: 23,
      arbitrary: true
    }, scope);
    expect(result.storage).toBeDefined();
    expect(result.arbitrary).toEqual(true);
    expect(result.row_limit).toEqual(23);
  });

});