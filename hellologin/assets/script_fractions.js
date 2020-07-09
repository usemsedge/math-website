"use strict";



// the thing needs to be black since no answer given
document.getElementById("correct").style.backgroundColor = "#ccc";
document.getElementById("correct").style.border = "solid black";




//funcs to help make cookys
function setCookie(cname, cvalue) {
		document.cookie = cname + "=" + cvalue + ";"
  }
  


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
		c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie(cookie) {
  var c = getCookie(cookie);
  if (c != "") {
    return true;
  } else {
    return false;
  }
}








var num_1 = [1, 2];

var num_2 = [1, 3];

var tries = 3;


if (checkCookie("correct") == true){
	var correct = parseInt(getCookie("correct"));
}
else {
	var correct = 0;
}


if (checkCookie("incorrect") == true) {
	var incorrect = parseInt(getCookie("incorrect"));
}
else {
	var incorrect = 0;
}   


document.getElementById("counter").innerHTML = "Correct answers: " + correct.toString() + "<br>Incorrect answers: " + incorrect.toString();




