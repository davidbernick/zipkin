/*
 * Copyright 2012 Twitter Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var Zipkin = Zipkin || {};
Zipkin.Application = Zipkin.Application || {};
Zipkin.Application.Models = (function() {
  var Service = Backbone.Model.extend();
  var ServiceList = Backbone.Collection.extend({
    model: Service,
    url: function() {
      return "/api/services";
    }
  });

  var Span = Backbone.Model.extend();

  /*
   * @param serviceName: string
   */
  var SpanList = Backbone.Collection.extend({
    model: Span,

    initialize: function(models, options) {
      this.serviceName = options.serviceName;
    },

    url: function() {
      return "/api/spans?serviceName=" + this.serviceName;
    }
  });

  /*
   * @param serviceName: string
   * @param endTime: string
   * @param limit: int
   */
  var Query = Backbone.Model.extend({
    execute: function() {
      var params = this.params();
      var results = new (QueryResults.extend({
        url: function() {
          return "/api/query?" + $.param(params)
        }
      }));
      results.fetch();
      return results;
    },

    params: function() {
      return {
        serviceName: this.get("serviceName"),
        endDatetime: this.get("endDatetime"),
        limit: this.get("limit")
      };
    }
  });

  /*
   * @param spanName: string
   */
  var SpanQuery = Query.extend({
    params: function() {
      return $.extend({}, SpanQuery.__super__.params.apply(this), {
        spanName: this.get("spanName")
      });
    }
  });

  /*
   * @param timeAnnotation: string
   */
  var AnnotationQuery = Query.extend({
    params: function() {
      return $.extend({}, AnnotationQuery.__super__.params.apply(this), {
        timeAnnotation: this.get("timeAnnotation")
      });
    }
  });

  /*
   * @param annotationKey: string
   * @param annotationValue: string
   */
  var KeyValueQuery = Query.extend({
    params: function() {
      return $.extend({}, KeyValueQuery.__super__.params.apply(this), {
        annotationKey: this.get("annotationKey"),
        annotationValue: this.get("annotationValue")
      });
    }
  });

  var TraceSummary = Backbone.Model.extend();
  var QueryResults = Backbone.Collection.extend({
    model: TraceSummary
  });

  return {
    Service: Service,
    ServiceList: ServiceList,

    Span: Span,
    SpanList: SpanList,

    Query: Query,
    SpanQuery: SpanQuery,
    AnnotationQuery: AnnotationQuery,
    KeyValueQuery: KeyValueQuery
  }
})();