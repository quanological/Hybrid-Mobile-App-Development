'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;


        $scope.showMenu = false;
        $scope.message = "Loading...";

        //data is now being accessed from server, change this code
        //$scope.dishes= menuFactory.getDishes();

        //query is equivalent to http GET
        //return all dishes
        menuFactory.getDishes().query(
            function (response) {                 //success
                $scope.dishes = response;       //response is actual data
                $scope.showMenu = true;
            },
            function (response) {                //failure
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

        //no longer needed. retrieved by code above

        //response - returns dish data to empty dishes object
        // menuFactory.getDishes()
        //     .then(
        //         function(response) {
        //             $scope.dishes = response.data;
        //             $scope.showMenu = true;
        //         },
        //         function(response) {
        //             $scope.message = "Error: "+response.status + " " + response.statusText;
        //         }
        //     );

        $scope.select = function (setTab) {
            $scope.tab = setTab;

            if (setTab === 2) {
                $scope.filtText = "appetizer";
            }
            else if (setTab === 3) {
                $scope.filtText = "mains";
            }
            else if (setTab === 4) {
                $scope.filtText = "dessert";
            }
            else {
                $scope.filtText = "";
            }
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('ContactController', ['$scope', function ($scope) {

        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

        var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', function ($scope) {

        $scope.sendFeedback = function () {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
                $scope.feedback.mychannel = "";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])


    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function ($scope, $stateParams, menuFactory) {

        //change this to an empty javascript object
        //$scope.dish = dish;

        //new code for server
        $scope.dish = {};
        $scope.showDish = false;
        $scope.message = "Loading...";   //shows this until response is sent back
        $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
            .$promise.then(
                function (response) {
                    $scope.dish = response; // response is the actual data of the dish
                    $scope.showDish = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            )
        ;


        //called after the dish object is initialized
        //this is a call to the server through menuFactory
        // menuFactory.getDish(parseInt($stateParams.id, 10));

    }])
    .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) { //menuFac so that we can make use of the getDishes function to push the comments

        $scope.comments = {rating: 5, comment: "", author: "", date: ""};

        $scope.submitComment = function () {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);

            $scope.dish.comments.push($scope.mycomment);

            menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);

            //resets form
            $scope.commentForm.$setPristine();
    //MADE CHANGE DELETED THIS BECAUSE I THINK IT IS RESETTING THE AMOUNT OF COMMENTS TO 0?
            //$scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
        };
    }])

    // implement the IndexController and About Controller here

    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {


        $scope.getExecutiveChef = corporateFactory.getLeader(3);
        //server code requires dish object

        $scope.showDish = false;
        //error message
        $scope.message = "Loading...";
        //retrieve dish from server, if success input data to empty dishes object above
        $scope.dish = menuFactory.getDishes().get({id: 0})
            .$promise.then(
                function (response) {
                    $scope.dish = response;
                    $scope.showDish = true;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        //retrieve promotion
        $scope.getPromotion = menuFactory.getPromotion(0);


    }])

    .controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

        $scope.leaders = corporateFactory.getLeaders();


    }])


;
