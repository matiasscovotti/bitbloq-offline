'use strict';
angular.module('bitbloqOffline')
  .directive('scrollbar', function() {
    return {
      restrict: 'E',
      templateUrl: 'file://' + __dirname + '/views/components/scrollbar.html',
      scope: {
        type: '=',
        target: '@',
        container: '@'
      },
      controller: function($scope, $element, $attrs, $window, _) {

        const TOOLBOXWIDTHPLUSMARGIN = 280;

        function initialize() {
          $target = angular.element($scope.target);
          $container = angular.element($scope.container);
          $scroll = angular.element($element);
          $innerScroll = $scroll.find('.scrollbar--inner');

          switch ($scope.type) {
            case 'horizontal':
              targetSize = returnLargestWidth();
              containerSize = $container.width();
              break;
            case 'vertical':
              targetSize = returnLargestHeight();
              containerSize = $container.height();
              break;
            default:
              throw 'Not an orientation';
          }
          if (targetSize > containerSize - TOOLBOXWIDTHPLUSMARGIN) {
            $scope.showScroll = true;
            setScrollsDimension($scope.type);
          } else {
            $scope.showScroll = false;
          }
        }

        function returnLargestWidth() {
          return Math.max.apply(null, $target.map(function() {
            return this.scrollWidth;
          }));
        }

        function returnLargestHeight() {
          return Math.max.apply(null, $target.map(function() {
            return this.scrollHeight;
          }));
        }

        function setScrollsDimension() {
          if ($scope.type === 'horizontal') {
            // $scroll.css('max-width', containerSize);
            $innerScroll.width(targetSize + 100);
          } else {
            $innerScroll.height(targetSize);
          }
        }

        function scrollFieldH(evt) {
          $scroll.scrollLeft(evt.currentTarget.scrollLeft);
        }

        function scrollContainerH(evt) {
          $container.scrollLeft(evt.currentTarget.scrollLeft);
        }

        function scrollFieldV(evt) {
          $scroll.scrollTop(evt.currentTarget.scrollTop);
        }

        function scrollContainerV(evt) {
          $target.scrollTop(evt.currentTarget.scrollTop);
        }

        var $target = angular.element($scope.target),
          $container = angular.element($scope.container),
          $scroll = angular.element($element),
          $innerScroll = $scroll.find('.scrollbar--inner'),
          targetSize,
          containerSize;

        initialize();

        if ($scope.type === 'horizontal') {

          $container.on('scroll', _.throttle(scrollFieldH, 250));
          $element.on('scroll', _.throttle(scrollContainerH, 250));
        } else {
          $target.on('scroll', _.throttle(scrollFieldV, 250));
          $scroll.on('scroll', _.throttle(scrollContainerV, 250));
        }

        $window.addEventListener('bloqs:bloqremoved', _.throttle(initialize, 250));
        $window.addEventListener('bloqs:dragend', _.throttle(initialize, 250));
      }
    };
  });