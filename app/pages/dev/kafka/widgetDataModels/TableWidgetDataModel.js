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

angular.module('app.pages.dev.kafka.widgetDataModels.TableWidgetDataModel', [
  'app.pages.dev.kafka.widgetDataModels.KafkaWidgetDataModel'
])
  .factory('TableWidgetDataModel', function (KafkaWidgetDataModel) {
    function TableWidgetDataModel() {
    }

    TableWidgetDataModel.prototype = Object.create(KafkaWidgetDataModel.prototype);
    TableWidgetDataModel.prototype.constructor = KafkaWidgetDataModel;

    angular.extend(TableWidgetDataModel.prototype, {
      init: function () {
        this.widgetScope.gridOptions = {
          enableColumnResizing: true
        };

        KafkaWidgetDataModel.prototype.init.call(this);
      },

      updateScope: function (data) {
        if (data && data.rows && data.rows.length > 0) {
          var gridOptions = this.widgetScope.gridOptions;
          if (!gridOptions.columnDefs) {
            gridOptions.columnDefs = [];
            _.each(data.headers, function (header, index) {
              gridOptions.columnDefs.push({ field: String(index), displayName: header });
            });
          }
          gridOptions.data = data.rows;
        } else {
          this.widgetScope.gridOptions.data = [];
        }
      }
    });

    return TableWidgetDataModel;
  });