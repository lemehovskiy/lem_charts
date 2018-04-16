require("./sass/style.scss");

require ("jquery");

require('../build/lem_charts.js');


import {TweenMax} from "gsap";

$(document).ready(function () {

    $('.lem-charts-demo').lemCharts();


    $('.lem-charts-demo').on('animationCompleted.lc', function(){
        TweenMax.fromTo('.lem-charts-demo li', 0.3,{scale: 0.8}, {opacity: 1, scale: 1, ease: Back.easeOut.config(1.7)});
    })

});