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

angular.module('app.components.resources.PhysicalOperatorModel', [
  'app.components.resources.BaseModel'
])
.factory('PhysicalOperatorModel', function(BaseModel) {

  var PhysicalOperatorModel = BaseModel.extend({
    debugName: 'Physical Operator',
    urlKey: 'PhysicalOperator',
    topicKey: 'PhysicalOperators',
    transformResponse: function(raw, type) {
      switch (type) {

        case 'subscribe':
          var id = this.data.id;
          return _.find(raw.operators, function(o){
            return o.id === id;
          });

        default:
          return raw;
      }
    }

  });

  return PhysicalOperatorModel;

});