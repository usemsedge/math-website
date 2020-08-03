"use strict";

var num_1 = 24;
var num_2 = 26;

var tries = 3;


//document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString();

function factorize() {


    var correct_ans = num_1 * num_2;

    var ans = parseInt(document.getElementById("ans").value, 10);

    //check if the answer is just whitespace
    if (ans === '') {
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
        document.getElementById("correct").innerText = `Your last answer of ${ans} was Correct ☺️`;
        document.getElementById("table_correct").innerHTML = `<td>${ans}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_correct").innerHTML}`;
        tries = 3;
        update_stats(document.getElementById('username').innerText, 'square5', 1);
    }

    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = `Your last answer of ${ans} was Incorrect ☹`;
        document.getElementById("table_incorrect").innerHTML = `<td>${ans}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_incorrect").innerHTML}`;

        document.getElementById("ans").value = "";
        tries -= 1;
        update_stats(document.getElementById('username').innerText, 'square5', 0);
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }
    get_score(document.getElementById('username').innerText, 'square5');

    document.getElementById("ans").value = "";

    var multiple_5 = parseInt((Math.random() * 10), 10) * 10 + 5;
    var change = parseInt((Math.random() * 5) + 1, 10);

    num_1 = multiple_5 - change;
    num_2 = multiple_5 + change;

    document.getElementById("question").innerText = `What is ${num_1} * ${num_2}?`;

}