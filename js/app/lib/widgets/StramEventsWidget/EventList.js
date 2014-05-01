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
var BaseView = require('bassview');
var EventItem = require('./EventItem');
var EventList = BaseView.extend({

    initialize: function(options) {
        this.parent = options.parent;
        this.listenTo(this.collection, 'add', this.addOne);
    },

    render: function() {
        this.trigger('clean_up');
        this.collection.each(this.addOne);
    },

    addOne: function(model) {
        var itemView = new EventItem({
            model: model,
            collection: this.collection
        });
        itemView.listenTo(this, 'clean_up', itemView.remove);
        if (this.parent.viewMode === 'tail') {
            itemView.$el.css('display', 'none');
            this.$el.prepend(itemView.render().el);
            itemView.$el.slideDown('fast');
        } else {
            this.$el.prepend(itemView.render().el);
        }
    }

});
exports = module.exports = EventList;