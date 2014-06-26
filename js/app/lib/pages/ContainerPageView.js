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

/**
 * Container View
*/

var _ = require('underscore');
var Notifier = DT.lib.Notifier;
var BasePageView = DT.lib.BasePageView;
var ContainerModel = DT.lib.ContainerModel;
var path = require('path');

// widgets
var CtnrInfoWidget = require('../widgets/CtnrInfoWidget');
var CtnrActionWidget = require('../widgets/CtnrActionWidget');
var CtnrOverviewWidget = require('../widgets/CtnrOverviewWidget');
var CtnrMetricsWidget = require('../widgets/CtnrMetricsWidget');
var OpListWidget = require('../widgets/PhysOpListWidget');
var GaugeWidget = require('../widgets/GaugeWidget');
var CpuGaugeModel = require('../../../datatorrent/CpuGaugeModel');

var ContainerPageView = BasePageView.extend({
    
    pageName: 'ContainerPageView',
    
    storageHash: 'sdfas098d976fasd',

    useDashMgr: true,
    
    initialize: function(options){
        BasePageView.prototype.initialize.call(this,options);
        
        // Get initial args
        var pageParams = options.pageParams;
        
        // Instantiate the container
        this.model = new ContainerModel({
            appId: pageParams.appId,
            id: pageParams.containerId
        }, {
            dataSource: this.dataSource
        });
        this.model.setOperators([]);
        this.model.fetch().then(this.onContainerFetch.bind(this));
    },

    onContainerFetch: function() {
        if (this.model.get('state') === 'ACTIVE') {
            this.model.operators.fetch();
            this.model.subscribe();
            // Define widgets
            if (!this.model.isAppMaster()) {
                this.setLocalKey(':APPMASTER');
                this.defineWidgets([
                    { name: 'info', defaultId: 'container info', view: CtnrInfoWidget, limit: 0, inject: {
                        model: this.model, 
                        nav: this.app.nav
                    }},
                    { name: 'actions', defaultId: 'actions', view: CtnrActionWidget, limit: 0, inject: {
                        model: this.model
                    }},
                    { name: 'overview', defaultId: 'overview', view: CtnrOverviewWidget, limit: 0, inject: {
                        model: this.model
                    }},
                    { name: 'cpuGauge', defaultId: 'CPU gauge', view: GaugeWidget, limit: 0, inject: {
                        label: 'CPU',
                        model: function() { return new CpuGaugeModel(null, { operators: this.model.operators }); }
                    }},
                    { name: 'operatorList', defaultId: 'operator list', view: OpListWidget, limit: 1, inject: {
                        dataSource:this.dataSource,
                        operators: this.model.operators, 
                        appId: this.model.get('appId'), 
                        nav: this.app.nav
                    }},
                    { name: 'containerMetrics', defaultId: 'metrics', view: CtnrMetricsWidget, limit: 0, inject: {
                        dataSource:this.dataSource,
                        model: this.model
                    }}
                ]);
                this.loadDashboards('default', ['master', 'killed']);
            } else {
                this.defineWidgets([
                    { name: 'info', defaultId: 'container info', view: CtnrInfoWidget, limit: 0, inject: {
                        model: this.model, 
                        nav: this.app.nav
                    }},
                    { name: 'actions', defaultId: 'actions', view: CtnrActionWidget, limit: 0, inject: {
                        model: this.model
                    }},
                    { name: 'overview', defaultId: 'overview', view: CtnrOverviewWidget, limit: 0, inject: {
                        model: this.model
                    }}
                ]);
                this.loadDashboards('master', ['default', 'killed']);
            }
        } else {
            this.setLocalKey(':KILLED');
            this.defineWidgets([
                { name: 'info', defaultId: 'container info', view: CtnrInfoWidget, limit: 0, inject: {
                    model: this.model, 
                    nav: this.app.nav
                }},
                { name: 'actions', defaultId: 'actions', view: CtnrActionWidget, limit: 0, inject: {
                    model: this.model
                }},
                { name: 'overview', defaultId: 'overview', view: CtnrOverviewWidget, limit: 0, inject: {
                    model: this.model
                }}
            ]);
            this.loadDashboards('killed', ['default', 'master']);
        }

        this.containerHasLoaded = true;
        this.render();
    },

    render: function() {
        if (!this.containerHasLoaded) {
            var html = '<div class="well" style="margin-bottom:0px">Container Loading...</div>';
            this.$el.html(html);
            return this;
        }
        return BasePageView.prototype.render.apply(this, arguments);
    },
    
    defaultDashes: [
        {
            dash_id: 'default',
            widgets: [
                { widget: 'cpuGauge', id: 'CPU gauge', width: 25.5, 'float': 'right' },
                { widget: 'info', id: 'container info', width: 54.5 },
                { widget: 'actions', id: 'actions', width: 20 },
                { widget: 'overview', id: 'overview', width: 74.5, height: 112 },
                { widget: 'operatorList', id: 'operator list'},
                { widget: 'containerMetrics', id: 'metrics'}
            ]
        },
        {
            dash_id: 'master',
            widgets: [
                { widget: 'info', id: 'container info', width: 80 },
                { widget: 'actions', id: 'actions', width: 20 },
                { widget: 'overview', id: 'overview' }
            ]
        },
        {
            dash_id: 'killed',
            widgets: [
                { widget: 'info', id: 'container info', width: 100 },
                { widget: 'overview', id: 'overview' }
            ]  
        }
    ],
    
    cleanUp: function() {
        this.model.stopListening();
        this.model.operators.stopListening();
        BasePageView.prototype.cleanUp.call(this);
    }
});

exports = module.exports = ContainerPageView