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

angular.module('app.components.filters.camel2spaces', [])
/**
 * Converts camel- and pascal- case strings to
 * space-separated words. 
 *   e.g. PascalCase => Pascal Case
 *        camelCase  => camel Case
 */
.filter('camel2spaces', function() {
  return function(str) {
    return $.trim(str.replace(/([A-Z])(?=[a-z])/g, ' $1'));
  };
});