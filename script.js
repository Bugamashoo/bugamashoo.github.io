var tPoints = 0; //storage for total points - should start at zero
var cPoints = 0; //points for correct
var iPoints = -250; //points for incorrect
var ssound = 0;
var i1 = new sound("i1.mp3");
var i2 = new sound("i2.mp3");
var i3 = new sound("i3.mp3");
var i4 = new sound("i4.mp3");
var i5 = new sound("i5.mp3");
var i6 = new sound("i6.mp3");
var i7 = new sound("i7.mp3");
var i8 = new sound("i8.mp3");
var i9 = new sound("i9.mp3");
var i10 = new sound("i10.mp3");
var i11 = new sound("i11.mp3");
var i12 = new sound("i12.mp3");
var i13 = new sound("i13.mp3");
var i14 = new sound("i14.mp3");
var i15 = new sound("i15.mp3");
var i16 = new sound("i16.mp3");
var i17 = new sound("i17.mp3");
var i18 = new sound("i18.mp3");
var i19 = new sound("i19.mp3");
var i20 = new sound("i20.mp3");
var i21 = new sound("i21.mp3");
var c1 = new sound("c1.mp3");
var c2 = new sound("c2.mp3");
var c3 = new sound("c3.mp3");
var c4 = new sound("c4.mp3");
var c5 = new sound("c5.mp3");
var c6 = new sound("c6.mp3");
var c7 = new sound("c7.mp3");
var c8 = new sound("c8.mp3");
var c9 = new sound("c9.mp3");
var c10 = new sound("c10.mp3");
var c11 = new sound("c11.mp3");
var c12 = new sound("c12.mp3");
var c13 = new sound("c13.mp3");
var c14 = new sound("c14.mp3");
var c15 = new sound("c15.mp3");
var c16 = new sound("c16.mp3");
var c17 = new sound("c17.mp3");
var c18 = new sound("c18.mp3");

var isPlaying = 0;

var googleSheetLink = "1NVjO-sR4fXAIAsNsjt5FzexCc0eMbvMmKqnarKYAt54";
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}
function setup() {
  $("pts").html("0");
  myMusic = new sound("0.mp3");
  trivia.loadGoogleSheet(googleSheetLink).then(displayWelcome);
  $(".submitt").on("click", function(e) {
    e.preventDefault();
    var jqxhr = $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      data: $form.serialize()
    });
    // do something
  });
}

//Loops continously for background effects and animations. (p5.js)
function draw() {
  if (trivia.state == "welcome") background("purple");
  else if (trivia.state == "question") background("purple");
  else if (trivia.state == "correct") background("green");
  else if (trivia.state == "incorrect") background("red");
  else if (trivia.state == "thankyou") background("purple");
}

function displayWelcome() {
  $(".screen").hide();
  $("#welcome-screen").show();
}

function displayQuestion() {
  $(".screen").hide();
  $("#correctAnswer").removeClass("highlight");
  $("#question-screen").show();
  $("#feedback").hide();
  trivia.insertQuestionInfo();
  trivia.shuffleAnswers();
  $(pts);
}

function displayThankyou() {
  $(".screen").hide();
  $("#thankyou-screen").show();
  $("#game-results").html("YOUR FINAL SCORE IS: " + tPoints + " POINTS!");
}

function onClickedAnswer(isCorrect) {
  if (isCorrect) {
    tPoints = cPoints * 50 + tPoints + 100;
    cSound();
    $("#feedback")
      .html("+" + (cPoints * 50 + 100) + " points!")
      .show();
    $("#pts").html(tPoints + " Points");
    cPoints++;
  } else {
    tPoints = iPoints + tPoints;
    cPoints = 0;
    iSound();
    $("#feedback")
      .html(iPoints + " points! Streak reset!")
      .show();
    $("#pts").html(tPoints + " points");
  }

  $("#correctAnswer").addClass("highlight"); //highlight right answer
  setTimeout(trivia.gotoNextQuestion, 1750); //wait 1 sec...next question
}

function onClickedStart() {
  (points = 0), (iPoints = -250), (cPoints = 0);
  displayQuestion();
  if (isPlaying == 0) {
    var myMusic;
    myMusic = new sound("0.mp3");
    myMusic.sound.setAttribute("loop", "loop");
    myMusic.play();
    isPlaying = 1;
  }
}
var $form = $("form#test-form"),
  url =
    "https://script.google.com/macros/s/AKfycbzvwiUH1wQsqqJiLDFwRmdXysiPFVnMBEaPxgtJVNSiXE_L0qPo/exec";
function iSound() {
  ssound = Math.ceil(Math.random() * 21);
  //  rSound = String("i" + ssound);
  //  soundTemp = rSound;
  //  toString(soundTemp).play();
  if (ssound == 1) {
    i1.play();
  } else if (ssound == 2) {
    i2.play();
  } else if (ssound == 3) {
    i3.play();
  } else if (ssound == 4) {
    i4.play();
  } else if (ssound == 5) {
    i5.play();
  } else if (ssound == 6) {
    i6.play();
  } else if (ssound == 7) {
    i7.play();
  } else if (ssound == 8) {
    i8.play();
  } else if (ssound == 9) {
    i9.play();
  } else if (ssound == 10) {
    i10.play();
  } else if (ssound == 11) {
    i11.play();
  } else if (ssound == 12) {
    i12.play();
  } else if (ssound == 13) {
    i13.play();
  } else if (ssound == 14) {
    i14.play();
  } else if (ssound == 15) {
    i15.play();
  } else if (ssound == 16) {
    i16.play();
  } else if (ssound == 17) {
    i17.play();
  } else if (ssound == 18) {
    i18.play();
  } else if (ssound == 19) {
    i19.play();
  } else if (ssound == 20) {
    i20.play();
  } else if (ssound == 21) {
    i21.play();
  }
}
function cSound() {
  ssound = Math.ceil(Math.random() * 18);
  //  rSound = String("c" + ssound);
  //  soundTemp = rSound;
  //  toString(soundTemp).play();
  if (ssound == 1) {
    c1.play();
  } else if (ssound == 2) {
    c2.play();
  } else if (ssound == 3) {
    c3.play();
  } else if (ssound == 4) {
    c4.play();
  } else if (ssound == 5) {
    c5.play();
  } else if (ssound == 6) {
    c6.play();
  } else if (ssound == 7) {
    c7.play();
  } else if (ssound == 8) {
    c8.play();
  } else if (ssound == 9) {
    c9.play();
  } else if (ssound == 10) {
    c10.play();
  } else if (ssound == 11) {
    c11.play();
  } else if (ssound == 12) {
    c12.play();
  } else if (ssound == 13) {
    c13.play();
  } else if (ssound == 14) {
    c14.play();
  } else if (ssound == 15) {
    c15.play();
  } else if (ssound == 16) {
    c16.play();
  } else if (ssound == 17) {
    c17.play();
  } else if (ssound == 18) {
    c18.play();
  }
}
