"use strict";

var num_1 = 624;

var tries = 3;

function send_scores() {
    var correct_ans = num_1;

    var ans = 1;
    var ans_array = document.getElementById("ans").value.split(' ');
    for (var i = 0; i < ans_array.length; i++) {
        ans = ans * parseInt(ans_array[i], 10);
    }

    //check if the answer is just whitespace
    if (ans === NaN || ans === undefined) {
        // no answer givennnn
        document.getElementById("correct").innerText = "No answer given";
        document.getElementById("correct").style.backgroundColor = "#ccc";
        document.getElementById("correct").style.border = "solid black";
        document.getElementById("ans").value = "";
        document.getElementById("correct").style.backgroundColor = "#888";

        setTimeout(function () {
            document.getElementById("correct").style.backgroundColor = "#ccc";
        }, 200);

        return;
    }

    //correct
    if (correct_ans === ans) {
        document.getElementById("correct").style.backgroundColor = "#cfc";
        document.getElementById("correct").style.border = "solid green";
        document.getElementById("correct").innerText = `Your last answer of ${ans_array} was Correct ☺️`;
        document.getElementById("table_correct").innerHTML = `<td>${ans}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_correct").innerHTML}`;
        tries = 3;
        update_stats(document.getElementById('username').innerText, 'square5reverse', 1);
    }

    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = `Your last answer of ${ans_array} was Incorrect ☹`;
        document.getElementById("table_incorrect").innerHTML = `<td>${ans}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_incorrect").innerHTML}`;
        document.getElementById("ans").value = "";
        tries -= 1;
        update_stats(document.getElementById('username').innerText, 'square5reverse', 0);
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }
    get_score(document.getElementById('username').innerText, 'square5reverse');

    document.getElementById("ans").value = "";

    var multiple_5 = parseInt((Math.random() * 10), 10) * 10 + 5;
    var change = parseInt((Math.random() * 5) + 1, 10);

    num_1 = (multiple_5 + change) * (multiple_5 - change);
    document.getElementById("question").innerText = `What are the closest two numbers that multiply to ${num_1}`;
}