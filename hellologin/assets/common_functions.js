"use strict";

const VALID_MODES = ['fractions', 'square', 'lcm', 'pf', 'square5', 'square5reverse'];
const TESTING_MODES = [];

document.getElementById("correct").style.backgroundColor = "#ccc";
document.getElementById("correct").style.border = "solid black";

function list_is_whitespace(l) {
    //check if a list is whitespace
    for (var i = 0; i < l.length; i++) {
        if (l[i] != " ") {
            return false;
        }
    }
    return true;
}

function arraysEqual(a, b) {
    //check if two
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function removeItem(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            array.splice(array.indexOf(item), 1);
            i--;
        }
    }
}

//math funcions
function gcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function factors(num) {

    var fac = [];
    while (num % 2 == 0) {
        fac.push(2);
        num = num / 2;
    }
    for (var i = 3; i < (num ** 0.5 + 1); i = i + 2) {
        while (num % i == 0) {
            fac.push(i);
            num = num / i;
        }
    }
    if (num > 2) {
        fac.push(num);
    }
    return fac;
}

function lcm(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) {
        return false;
    }
    return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}

function get_score(username, type) {
    try {
        if (VALID_MODES.indexOf(type) > -1) {
            var url = `/get_score?username=${username}&type=${type}`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/html',
                },
                body: ''
            }).then(response => {
                return response.json()
            }).then(data => {
                var correct = data['correct'];
                var incorrect = data['incorrect'];
                document.getElementById('counter').innerHTML = `Correct answers: ${correct}<br>Incorrect answers: ${incorrect}`;
            })
        }
    }
    catch (error) {
        return;
    }
}

function update_stats(username, type, correct){
    try {
        if (VALID_MODES.indexOf(type) > -1) {
            var url = `/scores?username=${username}&type=${type}&correct=${correct}`;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/html',
                },
                body: ''
            })
            
            /*
            .then(response => {
                return response.json()
            }).then(data => {
                console.log(data)
            });
            return;
            */
        }
        else if (TESTING_MODES.indexOf(type) > -1) {
            return;
        }
        else {
            console.error(`Error: ${type} is not a valid mode`);
        }
    }
    catch (error) {
        console.error(`Error: ${type} is not a valid mode`);
    }
}