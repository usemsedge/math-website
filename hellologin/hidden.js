"use strict";

var fs = require('fs');

function clear_all() {
    fs.writeFileSync('list.txt', '');
    fs.writeFileSync('stats_fractions.txt', '');
    fs.writeFileSync('stats_lcm.txt', '');
    fs.writeFileSync('stats_pf.txt', '');
}