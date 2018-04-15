require("./sass/style.scss");

require ("jquery");

require('../build/lem_charts.js');


import {TweenMax} from "gsap";

$(document).ready(function () {

    $('.lem-charts-demo').lemCharts();

});