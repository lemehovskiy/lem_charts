require("./sass/style.scss");

require ("jquery");

require('../build/lem_charts.js');


import {TweenMax} from "gsap";

$(document).ready(function () {

    $('.lem-charts-demo').lemCharts();


    $('.lem-charts-demo').on('animationCompleted.lc', function(){
        TweenMax.to('.lem-charts-demo li', 0.1, {opacity: 1});
        // TweenMax.staggerTo('.lem-charts-demo li', 0.1, {opacity: 1}, 0.1);
    })

});