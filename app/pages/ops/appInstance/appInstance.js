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
 * Application Instance page module
 */

angular.module('app.pages.ops.appInstance', [
  'ngRoute',
  'app.settings',
  'app.components.directives.dtPageHref',
  'app.components.services.appManager',
  'app.components.services.dashboardOptionsFactory',
  'app.components.resources.ApplicationModel',
  'app.components.widgets.PhysicalOperatorsList',
  'app.pages.ops.appInstance.widgets.AppInstanceOverview',
  'app.pages.ops.appInstance.widgets.LogicalOperatorsList',
  
  'app.pages.ops.appInstance.widgets.ContainersList',
  'app.pages.ops.appInstance.widgets.StramEvents',
  'app.pages.ops.appInstance.widgets.dag.LogicalDag',
  'app.pages.ops.appInstance.widgets.dag.PhysicalDag',
  'app.pages.ops.appInstance.widgets.metrics',
  'app.pages.ops.appInstance.widgets.LogicalStreamsList',
  'ui.widgets',
  'ui.models'
])

// Route
  .config(function ($routeProvider, settings) {
    $routeProvider
      .when(settings.pages.AppInstance, {
        controller: 'AppInstanceCtrl',
        templateUrl: 'pages/ops/ops.html',
        label: 'appInstance',
        collection: {
          label: 'apps',
          resource: 'ApplicationCollection',
          resourceParams: [],
          templateUrl: 'pages/ops/appInstance/breadcrumbTemplate.html',
          orderBy: 'name'
        }
      });
  })

// Controller
  .controller('AppInstanceCtrl', function (
    $scope,
    $routeParams,
    ApplicationModel,
    LogicalDagWidgetDefinition,
    PhysicalDagWidgetDefinition,
    AppInstanceOverviewWidgetDef,
    StramEventsWidgetDef,
    LogicalOperatorsListWidgetDef,
    PhysicalOperatorsListWidgetDef,
    ContainersListWidgetDef,
    MetricsWidgetDef,
    LogicalStreamsListWidgetDef,
    breadcrumbs,
    dashboardOptionsFactory
  ) {

    // Set appId on scope for use
    $scope.appId = $routeParams.appId;

    // Create new app instance on scope
    $scope.appInstance = new ApplicationModel({ id: $routeParams.appId });
    $scope.appInstance.fetch();
    $scope.appInstance.subscribe($scope);
    $scope.$on('$destroy', function () {
      $scope.appInstance.unsubscribe();
    });


    var widgetDefinitions = [
      new AppInstanceOverviewWidgetDef({ name: 'Application Overview', size: { width: '66%' } }),
      new StramEventsWidgetDef({ name: 'Stram Events', size: { width: '34%', 'float': 'right' } }),
      new LogicalDagWidgetDefinition({
        name: 'Logical DAG',
        dataModelArgs: { appId: $scope.appId },
        size: {
          width: '66%'
        }
      }),
      new PhysicalDagWidgetDefinition({
        name: 'Physical DAG',
        dataModelArgs: { appId: $scope.appId },
        size: {
          width: '100%'
        }
      }),
      new LogicalOperatorsListWidgetDef({ name: 'Logical Operators List' }),
      new PhysicalOperatorsListWidgetDef({ name: 'Physical Operators List' }),
      new ContainersListWidgetDef({
        name: 'Containers List',
        size: {
          width: '66%'
        }
      }),
      new LogicalStreamsListWidgetDef({ name: 'Logical Streams' }),
      new MetricsWidgetDef({
        name: 'Metrics Chart',
        size: {
          width: '60%'
        }
      })
    ];

    var logicalLayoutWidgets = _.map(['Application Overview', 'Stram Events', 'Logical DAG', 'Logical Operators List', 'Logical Streams', 'Metrics Chart'], function (name) {
      return { name: name };
    });

    var physicalLayoutWidgets = _.map(['Application Overview', 'Stram Events', 'Containers List', 'Physical Operators List', 'Metrics Chart'], function (name) {
      return { name: name };
    });

    var physicalDagViewLayoutWidgets = [
      {
        name: 'Application Overview',
        size: {
          width: '100%' //TODO if this widget is added again it will have width from widgetDefinitions
        }
      },
      { name: 'Physical DAG' }
    ];

    var metricViewLayoutWidgets = [
      {
        name: 'Application Overview',
        size: {
          width: '100%' //TODO if this widget is added again it will have width from widgetDefinitions
        }
      },
      { name: 'Metrics Chart' }
    ];

    $scope.dashboardOptions = dashboardOptionsFactory({
      storageId: 'dashboard.ops.appInstance',
      storageHash: '5s6fw21e62f',
      widgetDefinitions: widgetDefinitions,
      defaultWidgets: logicalLayoutWidgets,
      defaultLayouts: [
        { title: 'logical', active: true, defaultWidgets: logicalLayoutWidgets },
        { title: 'physical', active: false, defaultWidgets: physicalLayoutWidgets },
        { title: 'physical-dag-view', active: false, defaultWidgets: physicalDagViewLayoutWidgets },
        { title: 'metric-view', active: false, defaultWidgets: metricViewLayoutWidgets }
      ]
    });

  });