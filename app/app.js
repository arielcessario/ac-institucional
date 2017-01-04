'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'duScroll',
    'myApp.view1',
    'acUtils',
    'acAnimate',
    'acContacts'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({redirectTo: '/'});

    $routeProvider.when("/",
        {
            templateUrl: "view1/view1.html",
            controller: "View1Ctrl",
            controllerAs: "view1Ctrl"
        }
    );
}])
    .controller('AppController', AppController)
    .directive('emitMenu', emitMenu);

AppController.$inject = ['$location', '$timeout', '$document', '$rootScope', '$scope'];
function AppController($location, $timeout, $document, $rootScope, $scope) {

    var vm = this;
    vm.hideLoader = true;
    vm.goToAnchor = goToAnchor;
    vm.selected = 'home';

    $rootScope.$on("emit-menu", function(event, args){
        vm.selected = args.nombre;
        if (!$scope.$$phase && !$scope.$root.$$phase)
            $scope.$apply();
    });



    function goToAnchor(id) {
        $location.path('/');

        vm.selected = id;
        $timeout(function () {
            var duration = 1000;
            var offset = 50; //pixels; adjust for floating menu, context etc
            //Scroll to #some-id with 30 px "padding"
            //Note: Use this in a directive, not with document.getElementById
            var someElement = angular.element(document.getElementById(id));
            $document.scrollToElement(someElement, offset, duration);
        }, 20);
    }

    function sendMail() {


    }

}
emitMenu.$inject = ['$document', '$rootScope'];
function emitMenu($document, $rootScope) {
    return {
        restrict: 'AE',
        scope: {},
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var vm = this;

            $document.bind('scroll', onScroll);


            var latestKnownScrollY = 0,
                ticking = false;

            /**
             * Función que se ejecuta efectivamente en el scroll
             */
            function onScroll() {
                latestKnownScrollY = window.scrollY;
                requestTick();
            }

            /**
             * Se fija si ya está pedido un RAF
             */
            function requestTick() {
                if (!ticking) {
                    window.requestAnimationFrame(update);
                }
                ticking = true;
            }


            /**
             * Función que contiene la lógica de ejecución
             */
            function update() {
                ticking = false;

                var currentScrollY = latestKnownScrollY;
                var rect = $element[0].getBoundingClientRect();

                var top_adentro = false;
                var bottom_adentro = false;


                $scope.correctionOut = 300;
                $scope.correctionIn = ($scope.correctionIn == undefined) ? 0 : $scope.correctionIn;

                var val = rect.top >= (0 - $scope.correctionIn) &&
                    rect.left >= 0 &&
                    rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - $scope.correctionOut) && /*or $(window).height() */
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
                /*or $(window).width() */

                var inOnce = false;


                //Me fijo si la parte de arriba es visible
                top_adentro = rect.top <= ((window.innerHeight || document.documentElement.clientHeight) - $scope.correctionOut)
                    && rect.top > 0;

                //Me fijo si la parte de abajo es visible
                bottom_adentro = (rect.bottom <= ((window.innerHeight || document.documentElement.clientHeight) - $scope.correctionIn)
                    && rect.bottom > 0) || (rect.top < 0 && rect.bottom > 0);


                if (top_adentro || bottom_adentro) {
                    $rootScope.$broadcast("emit-menu", {nombre: $element[0].id});
                }

                // if (!top_adentro && !bottom_adentro) {
                //     console.log('aden');
                // }


            }


        }],
        link: function (scope, element, attr) {

        },
        controllerAs: 'acAnimateCtrl'
    };
}
