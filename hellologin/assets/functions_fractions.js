"use strict";

var num_1 = [1, 2];

var num_2 = [1, 3];

var tries = 3;


//document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString();





function add_fractions(x, y) {
    //x, y are lists of 2 numbers
    //[4, 5] is 4/5 fraction
    var least = lcm(x[1], y[1]);
    var mul_x = least / x[1];
    var mul_y = least / y[1];
    var top = x[0] * mul_x + y[0] * mul_y;
    var bottom = least;
    return [top, bottom];
}


function reduce(frac){
    var num = frac[0];
    var den = frac[1];
    var gcd = function gcd(a,b){
      return b ? gcd(b, a%b) : a;
    };
    gcd = gcd(num, den);

    return [num/gcd, den/gcd];
  }





function factorize() {


    var correct_ans = add_fractions(num_1, num_2);
    correct_ans = reduce(correct_ans);

    if (correct_ans[1] == 1) {
        correct_ans = correct_ans[0];
    }


    var ans = document.getElementById("ans").value;
    ans = ans.split("/")
    removeItem(ans, "");


    for (var i = 0; i < ans.length; i++) {
        ans[i] = parseInt(ans[i], 10);
    }

    if (ans.length == 1) {
        ans = ans[0];
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
        document.getElementById("correct").innerText = `Your last answer of ${ans[0]}/${ans[1]} was Correct ☺️`;
        document.getElementById("table_correct").innerHTML = `<td>${ans[0]}/${ans[1]}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_correct").innerHTML}`;
        tries = 3;
        update_stats(document.getElementById('username').innerText, 'fraction', 1);
    }

    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = `Your last answer of ${ans[0]}/${ans[1]} was Incorrect ☹`;
        document.getElementById("table_incorrect").innerHTML = `<td>${ans[0]}/${ans[1]}  ${document.getElementById("question").innerText}</td>${document.getElementById("table_incorrect").innerHTML}`;

        document.getElementById("ans").value = "";
        tries -= 1;
        update_stats(document.getElementById('username').innerText, 'fraction', 0);
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }
    document.getElementById("counter").innerHTML = `Correct answers: ${correct.toString()}<br>Incorrect answers: " + incorrect.toString()`;
    document.getElementById("ans").value = "";
    num_1 = [parseInt((Math.random() * 10) + 1, 10), parseInt((Math.random() * 10) + 1, 10)];
    num_2 = [parseInt((Math.random() * 10) + 1, 10), parseInt((Math.random() * 10) + 1, 10)];
    //create two random fractions


    document.getElementById("question").innerText = `What is ${num_1[0]}/${num_1[1]} + ${num_2[0]}/${num_2[1]}?`

}