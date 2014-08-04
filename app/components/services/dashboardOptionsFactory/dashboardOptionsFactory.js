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

angular.module('app.components.services.dashboardOptionsFactory', [
  'app.components.services.defaultWidgetSettings'
])
.factory('dashboardOptionsFactory', function(defaultSettingsModalOptions, defaultOnSettingsClose) {
    var dashboardOptionsFactory;
    dashboardOptionsFactory = function(o) {
      var defaults;
      if (!o) {
        o = {};
      }
      defaults = {
        storage: localStorage,
        settingsModalOptions: defaultSettingsModalOptions,
        onSettingsClose: defaultOnSettingsClose,
        widgetButtons: true
      };
      return angular.extend(this, angular.copy(defaults), o);
    };
    return dashboardOptionsFactory;
  }
);