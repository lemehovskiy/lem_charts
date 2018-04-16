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
                base_radius: 160,
                donut_hole_size: 35,
                donut_hole_color: '#E9B100',
                pies: [
                    {
                        percent: 18.1,
                        radius_coeff: 1.2,
                        color: '#303990'
                    },
                    {
                        percent: 10.7,
                        radius_coeff: 1.5,
                        color: '#EB8F00'
                    },
                    {
                        percent: 1.2,
                        radius_coeff: 1.85,
                        color: '#5BB446'
                    },
                    {
                        percent: 2.6,
                        radius_coeff: 1.62,
                        color: '#5CA3BC'
                    },
                    {
                        percent: 5.6,
                        radius_coeff: 1.41,
                        color: '#9E0855'
                    },
                    {
                        percent: 0.2,
                        radius_coeff: 2.22,
                        color: '#3A4232'
                    },
                    {
                        percent: 0.8,
                        radius_coeff: 1.9,
                        color: '#F9EB00'
                    },
                    {
                        percent: 6.5,
                        radius_coeff: 1.6,
                        color: '#B47CB9'
                    },
                    {
                        percent: 38.4,
                        radius_coeff: 1.2,
                        color: '#66A99B'
                    },
                    {
                        percent: 3.5,
                        radius_coeff: 1.5,
                        color: '#B5A3CA'
                    },
                    {
                        percent: 12.4,
                        radius_coeff: 1,
                        color: '#8AC7A2'
                    }
                ]

            }, options);

            self.$element = $(element);

            //extend by data options
            self.data_options = self.$element.data('lem-charts');
            self.settings = $.extend(true, self.settings, self.data_options);


            self.total_pecents = 0;
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

            self.context.lineJoin = self.context.lineCap = 'round';

            self.canvas.width = self.$element.outerWidth();
            self.canvas.height = self.$element.outerHeight();

            window.onresize = self.on_resize;


            self.create_pies();

            self.loop();

            self.animate();
        }

        create_pies() {

            let self = this;

            let angle_offset = 0;

            self.settings.pies.forEach(function (pie) {

                self.total_pecents += pie.percent;

                self.pies.push({
                    percent: pie.percent,
                    radius: self.settings.base_radius * pie.radius_coeff,
                    current_radius: self.settings.base_radius,
                    start_angle: angle_offset,
                    end_angle: angle_offset + 360 / 100 * pie.percent,
                    current_start_angle: 0,
                    current_end_angle: 0,
                    color: pie.color,
                    animation_time: 0.8 / 100 * pie.percent
                })

                angle_offset = (angle_offset + 360 / 100 * pie.percent)
            })

            if (self.total_pecents > 100) {
                console.warn('Total percents:' + self.total_pecents);
            }
        }

        on_resize() {

        }

        animate() {
            let self = this;


            let tl = new TimelineMax({
                onComplete(){
                    self.$element.trigger('animationCompleted.lc');
                }
            });


            self.pies.forEach(function (pie, index) {
                tl.to(pie, pie.animation_time, {current_end_angle: pie.end_angle, ease: Linear.easeNone});

                TweenMax.to(pie, 1.3, {
                    current_radius: pie.radius
                });
            });


        }

        update() {
            let self = this;

            self.pies.forEach(function (pie, index) {
                //update start_angle for sticky effect
                if (index > 0) {
                    pie.current_start_angle = self.pies[index - 1].current_end_angle;

                    if (pie.current_end_angle < pie.current_start_angle) {
                        pie.current_end_angle = pie.current_start_angle;
                    }
                }
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

            self.pies.forEach(function (pie) {

                let current_start_angle_cos = Math.cos(Math.radians(pie.current_start_angle - 0.2 - 90));
                let current_start_angle_sin = Math.sin(Math.radians(pie.current_start_angle - 0.2 - 90));

                self.context.fillStyle = pie.color;

                self.context.beginPath();

                self.context.moveTo(
                    canvas_center_x,
                    canvas_center_y
                );

                self.context.lineTo(
                    current_start_angle_cos * self.settings.base_radius + canvas_center_x,
                    current_start_angle_sin * self.settings.base_radius + canvas_center_y
                );

                self.context.arc(
                    canvas_center_x,
                    canvas_center_y,
                    pie.current_radius,
                    Math.radians(pie.current_start_angle - 90),
                    Math.radians(pie.current_end_angle - 90)
                );

                self.context.lineTo(
                    canvas_center_x,
                    canvas_center_y
                );

                self.context.fill();

                if (self.settings.donut_hole_size) {
                    self.context.beginPath();

                    self.context.fillStyle = self.settings.donut_hole_color;
                    self.context.arc(
                        canvas_center_x,
                        canvas_center_y,
                        self.settings.donut_hole_size,
                        0,
                        2 * Math.PI
                    );
                    self.context.fill();
                }
            })
        }

        loop() {

            let self = this;

            self.clear();
            self.update();
            self.render();

            window.requestAnimFrame(function () {
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