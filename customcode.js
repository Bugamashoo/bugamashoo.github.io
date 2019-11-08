var trivia = {
    questions: [],
    currentCategory: null,
    categoriesEnabled: false,
    currentQuestion: {},
    questionIndex: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    state: "welcome",
    loadGoogleSheet: function (link) {
        return new Promise((resolve, reject) => {
            Tabletop.init({
                key: link,
                callback: data => {
                    this.questions = data.Sheet1.elements;
                    this.questions = shuffle(this.questions);
                    if (this.questions.length) this.currentQuestion = this.questions[0];
                    this.questionIndex = 0;
                    this.totalQuestions = this.questions.length;
                    this.totalCorrect = 0;
                    this.totalAnswered = 0;
                    this.state = "welcome";
                    this.startClickListeners();
                    resolve("success");
                }
            });
        });
    },
    getCategories: function () {
        var cats = [];
        this.questions.filter((q) => {
            if (!cats.includes(q.category)) cats.push(q.category);
        });
        return cats;
    },
    getUnfinishedCategories: function () {
        var cats = [];
        this.questions.filter((q) => {
            if (!cats.includes(q.category) && !q.response) cats.push(q.category);
        });
        return cats;
    },
    gotoNextQuestion: function () { //this just forwards a "deprecated function"
        displayQuestion();
    },
    insertCategoriesInfo: function () {
        var cats = this.getCategories();
        var unfcats = this.getUnfinishedCategories();
        $('#category-set').html('');
        cats.forEach((c) => {
            var $catbtn = $(`<button class="category-btn">${c}</button>`);
            if (unfcats.includes(c)) {
                $catbtn.on('click', function (e) {
                    trivia.currentCategory = c;
                    onClickedCategory();
                });
            } else $catbtn.attr("disabled", true);
            $('#category-set').append($catbtn);
        })
    },
    insertQuestionInfo: function () {
        trivia.state = "question";
        $(".answer-btn").attr("disabled", null);
        trivia.questionIndex = trivia.questions.findIndex((q) => {
            if (!this.categoriesEnabled) return !q.response;
            else return !q.response && q.category == this.currentCategory;
        });
        if (trivia.questions[trivia.questionIndex]) {
            trivia.currentQuestion = trivia.questions[trivia.questionIndex];
            for (var prop in trivia.currentQuestion) {
                $("#" + prop).html(trivia.currentQuestion[prop]);
            }
        } else {
            if (this.totalAnswered == this.totalQuestions) {
                trivia.state = "thankyou";
                displayThankyou(); //game over
            } else if (this.categoriesEnabled) {
                trivia.state = "categories";
                displayCategories();
            } else alert('Yikes');
        }
    },
    shuffleAnswers: function () {
        $("#answer-set").html(shuffle($("#answer-set").children())); //shuffle answers
    },
    startClickListeners: function () {
        //listen for answer button clicks
        $(".screen").on("click", ".answer-btn", ev => {
            $(".answer-btn").attr("disabled", "disabled"); //turn off buttons to prohibit cheating :)
            trivia.triggerAnswer($(ev.target).is("#correctAnswer"));
        });

        //listen for restart button click
        $(".screen").on("click", ".start-btn", ev => {
            this.questions.forEach(function (q) {
                delete q.response
            });
            trivia.questionIndex = 0;
            if (!this.categoriesEnabled) trivia.state = "question";
            else trivia.state = "categories";
            trivia.currentQuestion = trivia.questions[0]; //reset to the first question
            onClickedStart();
        });
    },
    triggerAnswer: function (correct) {
        $(".answer-btn").attr("disabled", "disabled");
        if (correct) {
            trivia.currentQuestion.response = "correct";
            trivia.state = "correct";
        } else {
            trivia.currentQuestion.response = "incorrect";
            trivia.state = "incorrect";
        }
        trivia.totalCorrect = trivia.questions.filter(item => {
            return item.response == "correct";
        }).length;
        trivia.totalAnswered = trivia.questions.filter(item => {
            return item.response;
        }).length;
        onClickedAnswer(trivia.currentQuestion.response == "correct");
    }
};
