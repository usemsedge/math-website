"use strict";

var num_1 = 2;
var num_2 = 1;

var tries = 3;

function send_scores() {
    var correct_ans = lcm(num_1, num_2)
    var ans = document.getElementById("ans").value;

    //check if the answer is just whitespace
    if (ans === "") {
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
    if (parseInt(ans) === correct_ans) {
        document.getElementById("correct").style.backgroundColor = "#cfc";
        document.getElementById("correct").style.border = "solid green";
        document.getElementById("correct").innerText = `Your last answer of '${ans}' was Correct`;
        document.getElementById("table_correct").innerHTML = `<td>${ans.toString()}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_correct").innerHTML}`;
        tries = 3;
        update_stats(document.getElementById('username').innerText, 'lcm', 1);
    }

    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = `Your last answer of '${ans}' was Incorrect`;
        document.getElementById("table_incorrect").innerHTML = `<td>${ans.toString()}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_incorrect").innerHTML}`;

        document.getElementById("ans").value = "";

        update_stats(document.getElementById('username').innerText, 'lcm', 0);
        tries -= 1;
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }

    get_score(document.getElementById('username').innerText, 'lcm');
    document.getElementById("ans").value = "";

    num_1 = parseInt((Math.random() * 100) + 1, 10);
    num_2 = parseInt((Math.random() * 100) + 1, 10);

    document.getElementById("question").innerText = `What is the least common multiple of ${num_1.toString()} and ${num_2.toString()}`;
}