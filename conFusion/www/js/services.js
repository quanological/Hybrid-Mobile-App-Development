'use strict';

//conFusion is tied to services, ionic is dependent on ngResource
angular.module('conFusion.services', ['ngResource'])
        .constant("baseURL","http://localhost:3000/") //baseURL can be used anywhere
        .service('menuFactory', ['$resource', 'baseURL', function($resource,baseURL) {

                this.getDishes = function(){

                    return $resource(baseURL+"dishes/:id",null,  {'update':{method:'PUT' }});

                };
                this.getPromotion = function() {
                    return   $resource(baseURL+"promotions/:id");;
                }
        }])
        .factory('corporateFactory', ['$resource', 'baseURL', function($resource,baseURL) {
          return $resource(baseURL+"leadership/:id");

        }])

        .factory('feedbackFactory', ['$resource', 'baseURL', function($resource,baseURL) {
          return $resource(baseURL+"feedback/:id");
        }])
;
