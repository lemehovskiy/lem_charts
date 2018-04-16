/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/lem_charts
 */



var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {

    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    var LemCharts = function () {
        function LemCharts(element, options) {
            _classCallCheck(this, LemCharts);

            var self = this;

            //extend by function call
            self.settings = $.extend(true, {

                pies: [{
                    percent: 25,
                    radius: 100
                }, {
                    percent: 10,
                    radius: 200
                }, {
                    percent: 10,
                    radius: 150
                }, {
                    percent: 10,
                    radius: 50
                }]

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('lem-charts');
            self.settings = $.extend(true, self.settings, self.data_options);

            self.canvas = null;
            self.context = null;
            self.FPS = 30;

            self.pies = [];

            self.init();
        }

        _createClass(LemCharts, [{
            key: 'init',
            value: function init() {

                var self = this;

                window.requestAnimFrame = function () {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                        window.setTimeout(callback, 1000 / FPS);
                    };
                }();

                var body = document.querySelector('body');

                self.canvas = document.createElement('canvas');

                self.$element.append(self.canvas);

                self.canvas.style.position = 'absolute';
                self.canvas.style.top = 0;
                self.canvas.style.bottom = 0;
                self.canvas.style.left = 0;
                self.canvas.style.right = 0;
                self.canvas.style.zIndex = 2;
                self.canvas.style.cursor = 'pointer';

                self.context = self.canvas.getContext('2d');

                self.canvas.width = self.$element.outerWidth();
                self.canvas.height = self.$element.outerHeight();

                window.onresize = self.on_resize;

                self.create_pies();
                self.loop();
            }
        }, {
            key: 'create_pies',
            value: function create_pies() {

                var self = this;

                var angle_offset = 0;

                self.settings.pies.forEach(function (pie) {

                    console.log(angle_offset);

                    self.pies.push({
                        percent: pie.percent,
                        radius: pie.radius,
                        start_angle: angle_offset,
                        end_angle: angle_offset + 360 / 100 * pie.percent,
                        current_start_angle: 0,
                        current_end_angle: 0
                    });

                    angle_offset = angle_offset + 360 / 100 * pie.percent;
                });

                console.log(self.pies);
            }
        }, {
            key: 'on_resize',
            value: function on_resize() {}
        }, {
            key: 'update',
            value: function update() {
                var self = this;

                self.pies.forEach(function (pie, index) {

                    //update start_angle for sticky effect
                    if (index > 0) {
                        pie.current_start_angle = self.pies[index - 1].current_end_angle;
                    }

                    TweenMax.to(pie, 1, { current_end_angle: pie.end_angle });
                    // TweenMax.to(pie, 5, {radius: 150});
                });
            }
        }, {
            key: 'clear',
            value: function clear() {
                var self = this;

                self.context.clearRect(0, 0, innerWidth, innerHeight);
            }
        }, {
            key: 'render',
            value: function render() {

                var self = this;

                var canvas_center_x = self.canvas.width / 2;
                var canvas_center_y = self.canvas.height / 2;

                self.pies.forEach(function (pie) {

                    // let start_angle = 0;
                    // let end_angle = 360 / 100 * pie.percent;


                    self.context.beginPath();

                    self.context.moveTo(canvas_center_x, canvas_center_y);

                    self.context.lineTo(Math.cos(Math.radians(pie.current_start_angle - 90)) * pie.radius + canvas_center_x, Math.sin(Math.radians(pie.current_start_angle - 90)) * pie.radius + canvas_center_y);

                    self.context.arc(canvas_center_x, canvas_center_y, pie.radius, Math.radians(pie.current_start_angle - 90), Math.radians(pie.current_end_angle - 90));

                    self.context.lineTo(canvas_center_x, canvas_center_y);

                    self.context.stroke();
                });
            }
        }, {
            key: 'loop',
            value: function loop() {

                var self = this;

                self.clear();
                self.update();
                self.render();

                window.requestAnimFrame(function () {
                    self.loop();
                });
            }
        }]);

        return LemCharts;
    }();

    $.fn.lemCharts = function () {
        var $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i = void 0,
            ret = void 0;
        for (i = 0; i < length; i++) {
            if ((typeof opt === 'undefined' ? 'undefined' : _typeof(opt)) == 'object' || typeof opt == 'undefined') $this[i].lem_charts = new LemCharts($this[i], opt);else ret = $this[i].lem_charts[opt].apply($this[i].lem_charts, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };
})(jQuery);

/***/ })
/******/ ]);