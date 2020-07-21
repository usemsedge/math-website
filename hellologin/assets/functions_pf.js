"use strict";


var num_1 = 2;

var tries = 3;

//document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString();




//factorize
function factorize() {


    var correct_ans = factors(num_1).sort();


    var ans = document.getElementById("ans").value;
    ans = ans.split(" ").sort();
    removeItem(ans, "");


    for (var i = 0; i < ans.length; i++) {
        ans[i] = parseInt(ans[i], 10);
    }




    //check if the answer is just whitespace
    if (list_is_whitespace(ans) || ans === [""]) {
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
    if (arraysEqual(correct_ans, ans)) {
        document.getElementById("correct").style.backgroundColor = "#cfc";
        document.getElementById("correct").style.border = "solid green";
        document.getElementById("correct").innerText = "Your last answer of '" + ans + "' was Correct ☺️";
        document.getElementById("table_correct").innerHTML = "<td>" + ans.toString() + "  " + document.getElementById("question").innerText + "</td>" + document.getElementById("table_correct").innerHTML;
        tries = 3;

        update_stats(document.getElementById('username').innerText, 'pf', 1);
    }

    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = "Your last answer of '" + ans + "' was Incorrect ☹";
        document.getElementById("table_incorrect").innerHTML = "<td>" + ans.toString() + "  " + document.getElementById("question").innerText + "</td>" + document.getElementById("table_incorrect").innerHTML;

        document.getElementById("ans").value = "";

        update_stats(document.getElementById('username').innerText, 'pf', 0);
        tries -= 1;
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }


    document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString()

    document.getElementById("ans").value = "";

    num_1 = parseInt((Math.random() * 100) + 1, 10);


    document.getElementById("question").innerText = "What is the prime factorization of " + num_1.toString();

}