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

angular.module('dtConsole.webSocket', ['ui.notify', 'dtConsole.visibly', 'dtConsole.settings'])
  .factory('$WebSocket', function ($window) {
    return $window.WebSocket;
  })
  .provider('webSocket', function () {

    var webSocketURL;
    var webSocketObject; // for testing only

    return {
      $get: function ($q,  $rootScope, $timeout, notificationService, $WebSocket, visibly, $log, settings, $window) {
        if (!webSocketURL && !webSocketObject) {
          throw 'WebSocket URL is not defined';
        }

        var socket = !webSocketObject ? new $WebSocket(webSocketURL) : webSocketObject;

        var deferred = $q.defer();

        socket.onopen = function () {
          deferred.resolve();
          $rootScope.$apply();

          notificationService.notify({
            title: 'WebSocket',
            text: 'WebSocket connection established.',
            type: 'success',
            delay: 2000,
            icon: false,
            history: false
          });
        };

        var webSocketError = false;

        socket.onclose = function () {
          if (!webSocketError) {
            notificationService.notify({
              title: 'WebSocket Closed',
              text: 'WebSocket connection has been closed. Try refreshing the page.',
              type: 'error',
              icon: false,
              hide: false,
              history: false
            });
          }
        };

        //TODO
        socket.onerror = function () {
          webSocketError = true;
          notificationService.notify({
            title: 'WebSocket Error',
            text: 'WebSocket error. Try refreshing the page.',
            type: 'error',
            icon: false,
            hide: false,
            history: false
          });
        };

        var topicMap = {}; // topic -> [callbacks] mapping

        var stopUpdates = false;

        socket.onmessage = function (event) {
          if (stopUpdates) { // stop updates if page is inactive
            return;
          }

          var message = JSON.parse(event.data);

          var topic = message.topic;

          if (topicMap.hasOwnProperty(topic)) {
            if ($window.WS_DEBUG) {
              $log.debug('WebSocket ', topic, ' => ', message.data);
            }
            topicMap[topic].fire(message.data);
            $rootScope.$apply();
          }
        };

        var timeoutPromise;

        visibly.onHidden(function () {
          timeoutPromise = $timeout(function () {
            stopUpdates = true;
            timeoutPromise = null;
          }, settings.VISIBILITY_TIMEOUT);
        });

        visibly.onVisible(function () {
          if (stopUpdates && !webSocketError) {
            notificationService.notify({
              title: 'Warning',
              text: 'Page has not been visible for more than 60 seconds. WebSocket real-time updates have been suspended to conserve system resources. ' +
                'Refreshing the page is recommended.',
              type: 'warning',
              icon: false,
              hide: false,
              history: false
            });
          }

          stopUpdates = false;

          if (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
          }

          $log.debug('visible');
        });

        return {
          send: function (message) {
            var msg = JSON.stringify(message);

            deferred.promise.then(function () {
              $log.debug('send ' + msg);
              socket.send(msg);
            });
          },

          subscribe: function (topic, callback, $scope) {
            var callbacks = topicMap[topic];

            if (!callbacks) {
              var message = { type: 'subscribe', topic: topic }; // subscribe message
              this.send(message);

              callbacks = $.Callbacks();
              topicMap[topic] = callbacks;
            }

            callbacks.add(callback);

            if ($scope) {
              $scope.$on('$destroy', function () {
                this.unsubscribe(topic, callback);
              }.bind(this));
            }
          },

          unsubscribe: function (topic, callback) {
            if (topicMap.hasOwnProperty(topic)) {
              var callbacks = topicMap[topic];
              callbacks.remove(callback); //TODO remove topic from topicMap if callbacks is empty
            }
          }
        };
      },

      setWebSocketURL: function (wsURL) {
        webSocketURL = wsURL;
      },

      setWebSocketObject: function (wsObject) {
        webSocketObject = wsObject;
      }
    };
  });
