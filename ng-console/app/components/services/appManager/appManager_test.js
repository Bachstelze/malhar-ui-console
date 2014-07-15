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

'use strict';

describe('Service: appManager', function () {

  var $q, openDeferred, confirm = function(option) {
    openDeferred = $q.defer();
    return openDeferred.promise;
  };

  // load the service's module
  beforeEach(module('app.components.services.appManager', function($provide) {
    $provide.value('confirm', confirm);
  }));

  // instantiate service
  var appManager;
  beforeEach(inject(function (_$q_, _appManager_) {
    
    // Store $q
    $q = _$q_;

    // store the actual service
    appManager = _appManager_;

  }));

  var $httpBackend;

  beforeEach(inject(function(_$httpBackend_) {
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be an object', function() {
    expect(typeof appManager).toEqual('object');
  });

  describe('the endApp method', function() {

    it('should issue a post request with id of app object passed to it if the modal promise is resolved', inject(function(getUri) {
      var expected = getUri.action('killApp', { appId: 'application_101010101_0001' })
      $httpBackend.whenPOST(expected).respond({});
      $httpBackend.expectPOST(expected);
      appManager.endApp('kill', { id: 'application_101010101_0001' });
      openDeferred.resolve();
      $httpBackend.flush();
    }));

    it('should do nothing if modal promise is rejected', inject(function(getUri) {
      var expected = getUri.action('killApp', { appId: 'application_101010101_0001' })
      appManager.endApp('kill', { id: 'application_101010101_0001' });
      openDeferred.reject();
      $httpBackend.verifyNoOutstandingRequest();
    }));

  });


});