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

angular.module('app.settings', [])
  .constant('settings', {
    //wsRoot: 'http://localhost:3000',
    alertUrlRoot: '/alerts',
    GATEWAY_WEBSOCKET_HOST: null,
    GATEWAY_API_VERSION: 'v1',
    maxAlertActions: 3,
    statusOrder: ['SUBMITTED','ACCEPTED','RUNNING','FAILED','FINISHED','KILLED'],
    NONENDED_APP_STATES: ['SUBMITTED','ACCEPTED','RUNNING'],
    NONENDED_CONTAINER_STATES: ['ACTIVE', 'ALLOCATED'],
    STORAGE_KEY: 'datatorrent-ui-console',
    VISIBILITY_TIMEOUT: 20000,
    urls: {

      Alert                    :'/ws/:v/applications/:appId/alerts',
      AlertTemplate            :'/ws/:v/alertTemplates',
      Application              :'/ws/:v/applications',
      AppRecordings            :'/ws/:v/applications/:appId/recordings',
      ClusterMetrics           :'/ws/:v/cluster/metrics',
      ConfigIPAddresses        :'/ws/:v/config/ipAddresses',
      ConfigIssue              :'/ws/:v/config/issues',
      ConfigProperty           :'/ws/:v/config/properties',
      Container                :'/ws/:v/applications/:appId/physicalPlan/containers',
      ContainerLog             :'/ws/:v/applications/:appId/physicalPlan/containers/:containerId/logs',
      DependencyJar            :'/ws/:v/dependencyJars',
      GatewayInfo              :'/ws/:v/about',
      GatewayRestart           :'/ws/:v/config/restart',
      HadoopLocation           :'/ws/:v/config/hadoopInstallDirectory',
      Jar                      :'/ws/:v/jars',
      JarApps                  :'/ws/:v/jars/:fileName/applications',
      JarDependencies          :'/ws/:v/jars/:fileName/dependencyJars',
      License                  :'/ws/:v/licenses/files/current',
      LicenseAgent             :'/ws/:v/licenses/agents',
      LicenseFiles             :'/ws/:v/licenses/files',
      LicenseRequest           :'/ws/:v/licenses/request',
      LicenseLastRequest       :'/ws/:v/licenses/lastRequest',
      LogicalOperator          :'/ws/:v/applications/:appId/logicalPlan/operators',
      LogicalPlan              :'/ws/:v/applications/:appId/logicalPlan',
      LogicalStream            :'/ws/:v/applications/:appId/logicalPlan',
      OpProperties             :'/ws/:v/applications/:appId/logicalPlan/operators/:operatorName/properties',
      PhysicalOperator         :'/ws/:v/applications/:appId/physicalPlan/operators',
      PhysicalPlan             :'/ws/:v/applications/:appId/physicalPlan',
      Port                     :'/ws/:v/applications/:appid/physicalPlan/operators/:operatorId/ports',
      Recording                :'/ws/:v/applications/:appId/physicalPlan/operators/:operatorId/recordings',
      RecordingTuples          :'/ws/:v/applications/:appId/physicalPlan/operators/:operatorId/recordings/:startTime/tuples',
      StramEvent               :'/ws/:v/applications/:appId/events',
      PhysicalStream           :'/ws/:v/applications/:appId/physicalPlan/streams',
      User                     :'/ws/:v/profile/user'

    },
    
    actions: {
      startOpRecording         :'/ws/:v/applications/:appId/physicalPlan/operators/:operatorId/recordings/start',
      stopOpRecording          :'/ws/:v/applications/:appId/physicalPlan/operators/:operatorId/recordings/stop',
      startPortRecording       :'/ws/:v/applications/:appId/physicalPlan/operators/:operatorId/ports/:portName/recordings/start',
      stopPortRecording        :'/ws/:v/applications/:appId/physicalPlan/operators/:operatorId/ports/:portName/recordings/stop',
      shutdownApp              :'/ws/:v/applications/:appId/shutdown',
      killApp                  :'/ws/:v/applications/:appId/kill',
      killContainer            :'/ws/:v/applications/:appId/physicalPlan/containers/:containerId/kill',
      launchApp                :'/ws/:v/jars/:fileName/applications/:appName/launch',
      specifyDepJars           :'/ws/:v/jars/:fileName/dependencyJars',
      restartGateway           :'/ws/:v/config/restart'
    },
    
    topics: {
      
      ClusterMetrics           :'cluster.metrics',
      Applications             :'applications',
      Application              :'applications.:id',
      PhysicalOperators        :'applications.:appId.physicalOperators',
      LogicalOperators         :'applications.:appId.logicalOperators',
      Containers               :'applications.:appId.containers',
      StramEvents              :'applications.:appId.events',
      TupleRecorder            :'tupleRecorder.:startTime'

    },

    // Page Routes
    // 
    // Used by routing definitions and 
    // by the dt-page-href directive.
    // This is the single source of truth
    // for routes.
    pages: {
      AppInstance              :'/ops/apps/:appId',
      LogicalOperator          :'/ops/apps/:appId/logicalPlan/operators/:operatorName',
      PhysicalOperator         :'/ops/apps/:appId/physicalPlan/operators/:operatorId',
      Port                     :'/ops/apps/:appId/physicalPlan/operators/:operatorId/ports/:portId',
      LogicalStream            :'/ops/apps/:appId/logicalPlan/streams/:streamName',
      Container                :'/ops/apps/:appId/logicalPlan/containers/:containerId',
      ContainerLog             :'/ops/apps/:appId/logicalPlan/containers/:containerId/logs/:logName'
    },

    breadcrumbs: {
      appInstance              :':appId',
      container                :':containerId',
      logicalOperator          :'Logical Operator: :operatorName',
      physicalOperator         :'Physical Operator: :operatorId',
      logicalStream            :'Stream: :streamName',
      containerLog             :'Log: :logName',
      port                     :'Port: :portId'
    },

    stramEvents: {
      INITIAL_LIMIT: 50
    },

    dag: {
      edges: {
        NONE: {
          displayName: 'NOT ASSIGNED',
          dasharray: '5,2'
        },
        THREAD_LOCAL: {
          dasharray: null
        },
        CONTAINER_LOCAL: {
          dasharray: '1,1'
        },
        NODE_LOCAL: {
          dasharray: '1,3'
        },
        RACK_LOCAL: {
          dasharray: '1,5'
        }
      }
    }
  });
