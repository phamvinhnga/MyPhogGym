(function () {
    'use strict';

    angular
        .module('theme.xyz')
        .controller('IndexXyzControler', ['$scope', IndexXyzControler]);

    /** @ngInject */
    function IndexXyzControler($scope) {
        var vm = this;

        //TODO convert to angular library
        $scope.$on('$viewContentLoaded', function (event) {
            //MENU
            menu();

            // MOBILE MENU //
            mobile_menu();

            // SHOW/HIDE SCROLL UP
            show_hide_scroll_top();

            // SCROLL UP //
            scroll_up();

            // WINDOW SCROLL //
            $(window).scroll(function () {
                show_hide_scroll_top();
            });

            // WINDOW RESIZE //
            $(window).resize(function () {
                mobile_menu();
            });
        });

        // MENU //
        function menu() {
            if (typeof $.fn.superfish !== 'undefined') {
                $(".menu:not('.sf-js-enabled')").superfish({
                    delay: 500,
                    animation: {
                        opacity: 'show',
                        height: 'show'
                    },
                    speed: 'fast',
                    autoArrows: true
                });
            }
        }

        // MOBILE MENU //
        function mobile_menu() {
            if ($(window).width() < 992) {
                if ($("#menu").length > 0) {
                    if ($("#mobile-menu").length < 1) {
                        $("#menu").clone().attr({
                            id: "mobile-menu",
                            class: ""
                        }).insertAfter("#header");

                        $("#mobile-menu .megamenu > a").on("click", function (e) {
                            e.preventDefault();

                            $(this).toggleClass("open").next("div").slideToggle(300);
                        });

                        $("#mobile-menu .dropdown > a").on("click", function (e) {
                            e.preventDefault();

                            $(this).toggleClass("open").next("ul").slideToggle(300);
                        });
                    }
                }
            } else {
                $("#mobile-menu").hide();
            }
        }

        // SHOW/HIDE SCROLL UP //
        function show_hide_scroll_top() {
            if ($(window).scrollTop() > $(window).height() / 2) {
                $("#scroll-up").fadeIn(300);
            } else {
                $("#scroll-up").fadeOut(300);
            }
        }

        // SCROLL UP //
        function scroll_up() {
            $("#scroll-up").on("click", function () {
                $("html, body").animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
        }
    }
})();
