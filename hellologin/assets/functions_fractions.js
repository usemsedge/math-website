"use strict";




function add_fractions(x, y) {
    //x, y are lists of 2 numbers
    //[4, 5] is 4/5 fraction
    var least = lcm(x[1], y[1]);
    var mul_x = least / x[1];
    var mul_y = least / y[1];
    console.log([x, y, mul_x, mul_y]);
    var top = x[0] * mul_x + y[0] * mul_y;
    var bottom = least;
    console.log([top, bottom]);
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

    setCookie("incorrect", incorrect);
    setCookie("correct", correct);


    var correct_ans = add_fractions(num_1, num_2);
    correct_ans = reduce(correct_ans);


    var ans = document.getElementById("ans").value;
    ans = ans.split("/")
    removeItem(ans, "");


    for (var i = 0; i < ans.length; i++) {
        ans[i] = parseInt(ans[i], 10);
    }

    console.log(ans);


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
        correct += 1;

        document.getElementById("table_correct").innerHTML = "<td>" + `${ans[0]}/${ans[1]}` + "  " + document.getElementById("question").innerText + "</td>" + document.getElementById("table_correct").innerHTML;
    }

    //incorrect
    else {
        document.getElementById("correct").style.backgroundColor = "#fcc";
        document.getElementById("correct").style.border = "solid red";
        document.getElementById("correct").innerText = `Your last answer of ${ans[0]}/${ans[1]} was Incorrect ☹`;
        incorrect += 1;
        document.getElementById("table_incorrect").innerHTML = "<td>" + `${ans[0]}/${ans[1]}` + "  " + document.getElementById("question").innerText + "</td>" + document.getElementById("table_incorrect").innerHTML;

        document.getElementById("ans").value = "";
        tries -= 1;
        if (tries > 0) {

            return;
        }
        else {
            tries = 3;
        }
    }



    setCookie("incorrect", incorrect);
    setCookie("correct", correct);


    document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString()

    document.getElementById("ans").value = "";

    num_1 = [parseInt((Math.random() * 20) + 1, 10), parseInt((Math.random() * 20) + 1, 10)];
    num_2 = [parseInt((Math.random() * 20) + 1, 10), parseInt((Math.random() * 20) + 1, 10)];
    //create two random fractions


    document.getElementById("question").innerText = `What is ${num_1[0]}/${num_1[1]} + ${num_2[0]}/${num_2[1]}?`

}