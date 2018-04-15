/*
 Version: 1.0.0
 Author: lemehovskiy
 Website: http://lemehovskiy.github.io
 Repo: https://github.com/lemehovskiy/lem_charts
 */

'use strict';

(function ($) {

    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    class LemCharts {

        constructor(element, options) {

            let self = this;

            //extend by function call
            self.settings = $.extend(true, {

                test_property: false

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

        init() {

            let self = this;

            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||

                    function (callback) {
                        window.setTimeout(callback, 1000 / FPS);
                    };
            })();

            let body = document.querySelector('body');

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

        create_pies() {

            let self = this;


            self.pies.push({
                percent: 25,
                radius: 100

            })
        }

        on_resize() {

        }


        update() {
            let self = this;
            self.pies.forEach(function(pie){
                TweenMax.to(pie, 5, {percent: 50});
                TweenMax.to(pie, 5, {radius: 150});
            })
        }

        clear() {
            let self = this;

            self.context.clearRect(0, 0, innerWidth, innerHeight);
        }


        render() {

            let self = this;

            let canvas_center_x = self.canvas.width / 2;
            let canvas_center_y = self.canvas.height / 2;


            self.pies.forEach(function(pie){

                let start_angle = 0;
                let end_angle = 360 / 100 * pie.percent;


                self.context.beginPath();


                self.context.moveTo(canvas_center_x, canvas_center_y);


                self.context.lineTo(
                    Math.cos(Math.radians(start_angle - 90)) * pie.radius + canvas_center_x,
                    Math.sin(Math.radians(start_angle - 90)) * pie.radius + canvas_center_y
                );

                self.context.arc(canvas_center_x, canvas_center_y, pie.radius, Math.radians(start_angle - 90), Math.radians(end_angle - 90));

                self.context.lineTo(
                    canvas_center_x,
                    canvas_center_y
                );

                self.context.stroke();

            })
        }

        loop() {

            let self = this;

            self.clear();
            self.update();
            self.render();

            window.requestAnimFrame(function(){
                self.loop();
            });

        }
    }


    $.fn.lemCharts = function () {
        let $this = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            length = $this.length,
            i,
            ret;
        for (i = 0; i < length; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                $this[i].lem_charts = new LemCharts($this[i], opt);
            else
                ret = $this[i].lem_charts[opt].apply($this[i].lem_charts, args);
            if (typeof ret != 'undefined') return ret;
        }
        return $this;
    };

})(jQuery);