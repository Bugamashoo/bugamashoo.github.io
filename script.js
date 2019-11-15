var tPoints = 0; //storage for total points - should start at zero
var cPoints = 0; //points for correct
var iPoints = -100; //points for incorrect
var ssound = 0;
var rSound = 0;
var soundImport = 0;
var soundPicker = 0;
var soundTemp = 0;
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
  loadSounds();
  myMusic = new sound("0.mp3");
  trivia.loadGoogleSheet(googleSheetLink).then(displayWelcome);
  $(".submitt").on("click", function(e) {
    e.preventDefault();
    var jqxhr = $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      data: $form.serialize()
                       })
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
  $("#question-screen").show();
  $("#correctAnswer").removeClass("highlight");
  $("#feedback").hide();
  trivia.insertQuestionInfo();
  trivia.shuffleAnswers();
}

function displayThankyou() {
  $(".screen").hide();
  $("#thankyou-screen").show();
  $("#game-results").html("YOUR FINAL SCORE IS: " + tPoints + "POINTS!");
}

function onClickedAnswer(isCorrect) {
  if (isCorrect) {
    tPoints = cPoints * 50 + tPoints + 100;
    cSound();
    $("#feedback")
      .html("Correct! +" + (cPoints + 100) + " points! Keep it up!")
      .show();
    cPoints = cPoints++;
  } else {
    (tPoints = iPoints + tPoints), (cPoints = 0);
    iSound();
    $("#feedback")
      .html("Incorrect! " + iPoints + " points! Streak reset!")
      .show();
  }
  $("#correctAnswer").addClass("highlight"); //highlight right answer
  setTimeout(trivia.gotoNextQuestion, 2000); //wait 3 secs...next question
}

function onClickedStart() {
  (points = 0), (iPoints = -100), (cPoints = 0);
  displayQuestion();
  var myMusic;
  myMusic = new sound("0.mp3");
  myMusic.play();
}
var $form = $("form#test-form"),
  url =
    "https://script.google.com/macros/s/AKfycbzvwiUH1wQsqqJiLDFwRmdXysiPFVnMBEaPxgtJVNSiXE_L0qPo/exec";
function iSound() {
  ssound = Math.ceil(Math.random() * 9);
  rSound = String("i" + ssound);
  soundTemp = rSound;
  soundTemp.play();
}
function cSound() {
  ssound = Math.ceil(Math.random() * 7);
  rSound = String("c" + ssound);
  soundTemp = rSound;
  soundTemp.play();
}
function loadSounds() {
//  soundImport = 0;
    var i1 = new sound("i1.mp3");
    var i2 = new sound("i2.mp3");
    var i3 = new sound("i3.mp3");
    var i4 = new sound("i4.mp3");
    var i5 = new sound("i5.mp3");
    var i6 = new sound("i6.mp3");
    var i7 = new sound("i7.mp3");
    var i8 = new sound("i8.mp3");
    var i9 = new sound("i9.mp3");
    var c1 = new sound("c1.mp3");
    var c2 = new sound("c2.mp3");
    var c3 = new sound("c3.mp3");
    var c4 = new sound("c4.mp3");
    var c5 = new sound("c5.mp3");
    var c6 = new sound("c6.mp3");
    var c7 = new sound("c7.mp3");
}
//  var i;
//  for (i = 0; i < 7; i++) {
//    soundImport++;
//    soundPicker = "c" + soundImport + ".mp3";
//    soundTemp = new sound(String(soundPicker));
//  }
//  soundImport = 0;
//  for (i = 0; i < 9; i++) {
//    soundImport++;
//    soundPicker = "i" + soundImport + ".mp3";
//    soundTemp = new sound(String(soundPicker));
//  }

