Template.dataDisplay.events({
    'click #takeQuiz': function (){
        Session.set('currentQuiz', this._id);
        Session.set('questionNumber', 0);
        Session.set('report', '');
        Router.go('/play/' + this._id);
    }
});

Template.dataDisplay.helpers({
    calculations: function () {
        var misses = [],
            numbers = [],
            questions = this.questions,
            times = [],
            totalCorrect = 0,
            totalAttempts = 0;
        _.each(questions, function (id) {
            var question = Problems.find(id).fetch()[0];
            var report = Reports.find({"problem": id}).fetch()[0];
            if (report) {
                for (var i in report.accuracy) {
                    if (report.accuracy.hasOwnProperty(i)) {
                        var incorrect = _.contains(report.accuracy[i], false);
                        if (!incorrect) {
                            totalCorrect++;
                        } else {
                            misses.push({
                                answer: question.answers,
                                number: question.number,
                                response: report.answers[i],
                                type: question.type
                            });
                        }
                    }
                    totalAttempts++;
                }
                numbers.push({number: question.number});
                times.push(report.times);
            }
        });

        return (totalAttempts != 0) ? {
            correct: totalCorrect,
            misses: misses,
            numbers: numbers,
            quiz: this.title,
            times: times,
            total: totalAttempts
        } : '';
    },
    difficulty: function () {
        console.log(this);
        return Problems.findOne(this.questions[0]).difficulty; //currently only good for Question 0
    },
    fastest: function () {
        console.log(this);
        return _.min(this.times[0]); //currently only good for Question 0
    },
    slowest: function () {
        return _.max(this.times[0]); //currently only good for Question 0
    }
});

Template.dataDisplay.onRendered(function () {
    $('.dropdown').dropdown();
    $('#accuracy').progress({
        label: 'ratio',
        text: {
            active: '{value} of {total}',
            success: 'Perfect Score! ({value} of {total})'
        }
    });
});

Template.quizReport.events({
    "click .item": function () {
        Session.set('quizSelected', Quizzes.findOne(this._id));
    }
});

Template.reporter.helpers({
    selection: function () {
        return Session.get('quizSelected');
    }
});

Template.questionsDropdown.helpers({
    number: function () {
        return Problems.findOne(this.valueOf()).number;
    }
});

Template.quizDropdown.helpers({
    quizzes: function () {
        return Quizzes.find();
    }
});

Template.quizDropdown.onRendered(function () {
    $('.dropdown').dropdown({
        onChange: function () {
            $('.dropdown').dropdown();
            $('#accuracy').progress({
                label: 'ratio',
                text: {
                    active: '{value} of {total}',
                    success: 'Perfect Score'
                }
            });
        }
    });
});
