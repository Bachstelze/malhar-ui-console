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

/**
 * Operations page module
 */

angular.module('dtConsole.pages.ops', [
  'dtConsole.widgets.ClusterMetrics',
  'dtConsole.widgets.AppsList'
])

// Route
.config(function($routeProvider) {
  $routeProvider
    .when('/ops', {
      controller: 'OpsCtrl',
      templateUrl: 'pages/ops/ops.html',
      label: 'Operations'
    });
})

// Controller
.controller('OpsCtrl', function ($scope, _, ClusterMetricsWidget, AppsListWidget){
  var widgetDefinitions = [
    new ClusterMetricsWidget({ name: 'ClusterMetrics' }),
    new AppsListWidget({ name: 'AppList' })
  ];

  var defaultWidgets = _.clone(widgetDefinitions);

  $scope.dashboardOptions = {
    storage: localStorage,
    storageKey: 'dashboard.ops',
    widgetButtons: false,
    widgetDefinitions: widgetDefinitions,
    defaultWidgets: defaultWidgets,
    defaultLayouts: [
      { title: 'default', active: true , defaultWidgets: defaultWidgets },
    ]
  };

});