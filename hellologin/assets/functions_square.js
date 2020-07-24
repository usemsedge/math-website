"use strict";

var num_1 = 2;

var tries = 3;


//document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString();


//do the stuff
function root() {
    var correct_ans = num_1;


    var ans = document.getElementById("ans").value;
    ans = parseInt(ans);


    //check if the answer is just whitespace
    if (ans === undefined || isNaN(ans)) {
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
    if (correct_ans == ans) {
        document.getElementById("correct").style.backgroundColor = "#cfc";
        document.getElementById("correct").style.border = "solid green";
        document.getElementById("correct").innerText = `Your last answer of '${ans}' was Correct ☺️`;
        document.getElementById("table_correct").innerHTML = `<td>${ans}}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_correct").innerHTML}`;
        tries = 3;
        update_stats(document.getElementById('username').innerText, 'square', 1);
    }
    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = `Your last answer of '${ans}' was Inorrect ☹`;
        document.getElementById("table_incorrect").innerHTML = `<td>${ans}}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_incorrect").innerHTML}`;
        document.getElementById("ans").value = "";
        update_stats(document.getElementById('username').innerText, 'square', 0);
        tries -= 1;
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }


    //document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString()

    document.getElementById("ans").value = "";
    num_1 = parseInt(Math.random() * 100, 10);
    document.getElementById("question").innerText = `What is the square root of ${(num_1 * num_1).toString()}`;

}