var tPoints = 0; //storage for total points - should start at zero
var cPoints = 100; //points for correct
var iPoints = -50; //points for incorrect
function setup() {
    var googleSheetLink = "1NVjO-sR4fXAIAsNsjt5FzexCc0eMbvMmKqnarKYAt54";
    trivia.loadGoogleSheet(googleSheetLink).then(displayWelcome);
    $('.submitt').on('click', function (e) {
        e.preventDefault();
        var jqxhr = $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: $form.serialize()
        }).success(
            // do something
        )
    })
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
    $("#feedback").hide()
    trivia.insertQuestionInfo();
    trivia.shuffleAnswers();
}

function displayThankyou() {
    $(".screen").hide();
    $("#thankyou-screen").show();
    $("#game-results").html('You got ${trivia.totalCorrect} of ${trivia.totalAnswered} correct and scored' + tPoints + 'points!');
}

function onClickedAnswer(isCorrect) {
    if (isCorrect) {
        tPoints = cPoints + tPoints;
        $("#feedback").html('Epic choice, my dude!').show();
    } else {
        tPoints = iPoints + tPoints;
        $("#feedback").html('Haha, you are bad lmao!').show();
    }
    $("#correctAnswer").addClass("highlight"); //highlight right answer
    setTimeout(trivia.gotoNextQuestion, 3000); //wait 3 secs...next question
}


function onClickedStart() {
    var points = 0;
    displayQuestion();
}
var $form = $('form#test-form'),
    url = 'https://script.google.com/macros/s/AKfycbzvwiUH1wQsqqJiLDFwRmdXysiPFVnMBEaPxgtJVNSiXE_L0qPo/exec'
