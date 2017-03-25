'use strict';

angular.module('conFusion.controllers', [])
  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {


    // Form data for the login modal
    $scope.loginData = {};


    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) { //specifying the modal as $ionicModal.fromTemplateUrl('...')
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    //Perform the login action when user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);

    };

    // Create the reserve modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.reserveform = modal;
    });

    // Triggered in the reserve modal to close it
    $scope.closeReserve = function () {
      $scope.reserveform.hide();
    };

    // Open the reserve modal
    $scope.reserve = function () {
      $scope.reserveform.show();
    };

    // Perform the reserve action when the user submits the reserve form
    $scope.doReserve = function () {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your reservation
      // code if using a server system
      $timeout(function () {
        $scope.closeReserve();
      }, 1000);
    };
  })

  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', '$ionicListDelegate',
    'baseURL', '$ionicPopup', function ($scope, menuFactory, favoriteFactory, $ionicListDelegate, baseURL, $ionicPopup) {

      $scope.baseURL = baseURL;
      $scope.tab = 1;
      $scope.filtText = '';
      $scope.showDetails = false;
      $scope.showMenu = false;
      $scope.message = "Loading ...";

      menuFactory.getDishes().query(
        function (response) {
          $scope.dishes = response;
          $scope.showMenu = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });


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


      // adds a favorite dish to My Favorites
      $scope.addFavorite = function (index) {

        // Enable this code if you want to add confirm popup when adding dishes
        // var confirmPopup = $ionicPopup.confirm({title: 'Confirm Add',
        //   template: 'Are you sure you want to add this item?'});
        //
        // confirmPopup.then(function(res) {
        //   if (res) {
        //     console.log('Ok to add');
        //     favoriteFactory.addToFavorites(index);
        //   } else {
        //     console.log('Canceled delete');
        //   }
        // });
        console.log("index is " + index);
        favoriteFactory.addToFavorites(index);
        $ionicListDelegate.closeOptionButtons();
      }
    }])

  .controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

      console.log($scope.feedback);

      if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
        $scope.invalidChannelSelection = true;
        console.log('incorrect');
      }
      else {
        $scope.invalidChannelSelection = false;
        feedbackFactory.save($scope.feedback);
        $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
        $scope.feedback.mychannel = "";
        $scope.feedbackForm.$setPristine();
        console.log($scope.feedback);
      }
    };
  }])

  .controller('DishDetailController', ['$scope', 'favoriteFactory', '$stateParams', 'menuFactory', 'baseURL', '$ionicPopover', '$ionicListDelegate', '$ionicModal', function ($scope, favoriteFactory, $stateParams, menuFactory, baseURL, $ionicPopover, $ionicListDelegate, $ionicModal) {

    $scope.baseURL = baseURL;
    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)})
      .$promise.then(
        function (response) {
          $scope.dish = response;
          $scope.showDish = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );

    // popover template
    var template = baseURL + 'templates/my-popover.html';

    $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/my-popover.html', { //change to var template
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    $scope.addToFavorites = function (index) {
      favoriteFactory.addToFavorites(index);
      console.log('Added ' + index + ' to favorites');
    };


    // comment modal

    var commentTemplate = 'templates/dish-detail-modal.html';

    $ionicModal.fromTemplateUrl(commentTemplate, {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
    };

    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    //newComment stuff

    $scope.modalComment = {rating:5, comment:"", author:"", date:""};
    $scope.submitComment = function () {
      $scope.modalComment.date = new Date().toISOString();
      console.log($scope.modalComment);
      $scope.dish.comments.push($scope.modalComment);
      menuFactory.update({id:$scope.dish.id},$scope.dish);
      $scope.modal.hide();
      $scope.modalComment = {rating:5, comment:"", author:"", date:""};
    };


  }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};

    $scope.submitComment = function () {

      $scope.mycomment.date = new Date().toISOString();
      console.log($scope.mycomment);

      $scope.dish.comments.push($scope.mycomment);
      menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);

      $scope.commentForm.$setPristine();

      $scope.mycomment = {rating: 5, comment: "", author: "", date: ""};
    }
  }])

  // implement the IndexController and About Controller here

  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'promotionFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, promotionFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.leader = corporateFactory.get({id: 3});
    $scope.showDish = false;
    $scope.message = "Loading ...";
    $scope.dish = menuFactory.get({id: 0})
      .$promise.then(
        function (response) {
          $scope.dish = response;
          $scope.showDish = true;
        },
        function (response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );
    $scope.promotion = promotionFactory.get({id: 0});

  }])

  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {
    $scope.baseURL = baseURL;
    $scope.leaders = corporateFactory.query();
    console.log($scope.leaders);

  }])

  .controller('FavoritesController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', function ($scope, menuFactory, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout) {

    $scope.baseURL = baseURL;
    $scope.shouldShowDelete = false;

    // loading
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner> Loading...'
    });

    $scope.favorites = favoriteFactory.getFavorites();

    $scope.dishes = menuFactory.query(
      function (response) {
        $scope.dishes = response;
        $timeout(function () {       // timeout for loading
          $ionicLoading.hide();
        }, 1000);
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
        $timeout(function () {
          $ionicLoading.hide();
        }, 1000);
      });
    console.log($scope.dishes, $scope.favorites);

    $scope.toggleDelete = function () {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log($scope.shouldShowDelete);
    };

    $scope.deleteFavorite = function (index) {

      //confirm the deletion
      var confirmPopup = $ionicPopup.confirm({
        title: 'Confirm Delete',
        template: 'Are you sure you want to delete this item?'
      });

      // if delete is true, then delete. Otherwise cancel the deletion
      confirmPopup.then(function (res) {
        if (res) {
          console.log('Ok to delete');
          favoriteFactory.deleteFromFavorites(index);
        } else {
          console.log('Canceled delete');
        }
      });

      $scope.shouldShowDelete = false;
    }
  }])


  //returns the favorite dishes
  .filter('favoriteFilter', function () {
    return function (dishes, favorites) {
      var out = [];
      for (var i = 0; i < favorites.length; i++) {
        for (var j = 0; j < dishes.length; j++) {
          if (dishes[j].id === favorites[i].id)
            out.push(dishes[j]);
        }
      }
      return out;

    }
  });


;
