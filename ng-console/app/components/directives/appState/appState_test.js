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

describe('Directive: appState', function () {

  var element, scope, rootScope, isoScope, compile;

  beforeEach(function() {
    // define mock objects here
  });

  // load the directive's module
  beforeEach(module('app.components.directives.appState', function($provide) {
    // Inject dependencies like this:
    // $provide.value('', mockThing);

  }));

  beforeEach(inject(function ($compile, $rootScope) {
    // Cache these for reuse    
    rootScope = $rootScope;
    compile = $compile;

    // Other setup, e.g. helper functions, etc.

    // Set up the outer scope
    scope = $rootScope.$new();

    // Define and compile the element
    element = angular.element('<span app-state="\'RUNNING\'" final-status="\'UNDEFINED\'"></span>');
    element = compile(element)(scope);
    scope.$digest();
    isoScope = element.isolateScope();
  }));

  afterEach(function() {
    // tear down here
  });

  it('should add a span with a status-* class', function() {
    expect(element.find('span.status-running').length).toEqual(1);
  });

  it('should not add a <small> with the final status if it is UNDEFINED', function() {
    expect(element.find('small').length).toEqual(0);
  });

  describe('when the state has ended and there is a final-status', function() {
    beforeEach(function() {
      // Define and compile the element
      element = angular.element('<span app-state="\'FINISHED\'" final-status="\'FAILED\'"></span>');
      element = compile(element)(scope);
      scope.$digest();
      isoScope = element.isolateScope();
    });
    it('should add a span with a status-* class', function() {
      expect(element.find('span.status-finished').length).toEqual(1);
    });
    it('should add a <small> with the final status', function() {
      expect(element.find('small').length).toEqual(1);
      expect(element.find('small').text()).toEqual('FAILED');
    });
  });

  describe('when no state is present', function() {
    beforeEach(function() {
      // Define and compile the element
      element = angular.element('<span app-state></span>');
      element = compile(element)(scope);
      scope.$digest();
      isoScope = element.isolateScope();
    });
    it('should put a hyphen in the element', function() {
      expect(element.html()).toEqual('-');
    });
  });

});