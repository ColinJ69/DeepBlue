var q = document.getElementById('question');
var ans1 = document.getElementById('1');
var ans2 = document.getElementById('2');
var ans3 = document.getElementById('3');
var ans4 = document.getElementById('4');
var Correct_Ans;
class WeightedRandomPicker {
    constructor(arr) {
        this.arr = arr;
        this.weights = new Array(arr.length).fill(1);
    }

    pick() {
        const totalWeight = this.weights.reduce((acc, weight) => acc + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < this.weights.length; i++) {
            if (random < this.weights[i]) {
                this.weights[i] *= 0.5;
                return this.arr[i];
            }
            random -= this.weights[i];
        }
    }
}

function getQuestions() {
    const picked_question = new WeightedRandomPicker([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    var p = picked_question.pick();

    const cookie = document.cookie.slice(-32)
    console.log(cookie)
    const BASE_URL = '';

    let sent_data = { 'q': btoa(p) }
    const API_URL = BASE_URL + "/get_question";

    const request = new Request(
        API_URL,
        { headers: { 'X-CSRFToken': cookie, 'Content-Type': 'application/json' } }
    );

    fetch(request, {
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify(sent_data)
    })

        .then(response => response.json())


        .then(questions => {

            var i = atob(questions)

            getQuestionInformation(i)

        }
        )
}

function getQuestionInformation(questions) {
    var question = JSON.parse(questions)
    console.log(question)
    q.textContent = question['Question'];
    ans1.innerText = question['Ans_Choices'][0];
    ans2.innerText = question['Ans_Choices'][1];
    ans3.innerText = question['Ans_Choices'][2];
    ans4.innerText = question['Ans_Choices'][3];
    Correct_Ans = question['Correct_Ans'];
    ans1.style.color = 'black';
    ans2.style.color = 'black';
    ans3.style.color = 'black';
    ans4.style.color = 'black';
    localStorage.removeItem('correct_explanation');
    localStorage.removeItem('incorrect_explanation');
    localStorage.setItem('correct_explanation', question['Explanation1'])
    localStorage.setItem('incorrect_explanation', question['Explanation2'])

}


document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('load', function () {
        getQuestions();

        var userpoints = localStorage.getItem('points')
        console.log(userpoints)
        document.querySelector('#points').textContent = `0 points`

        if (true) {

            document.querySelector('#points').textContent = `${userpoints} points`

        }


    });
});
function onVisible(element, callback) {
    new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                callback(element);
                observer.disconnect();
            }
        });
    }).observe(element);
    if (!callback) return new Promise(r => callback = r);
}


onVisible(document.querySelector("#points"), () =>

    countIni()


);



function resetButtons() {
    const buttons = document.querySelectorAll('input');
    buttons.forEach(button => {
        button.checked = false;
        button.classList.remove('clicked');
    });
    document.querySelector('#explanation').style.display = 'none';
    document.querySelector('#questionacc').style.display = 'block';
    getQuestions();
}
var radios = document.forms["formA"].elements["q"];
var isCorrect = document.getElementById('isCorrect')
var correct = document.getElementById(Correct_Ans)
for (var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function () {
        var ans = document.getElementById(this.value);
        if (this.value == Correct_Ans) {


            ans.style.color = 'green';
            document.getElementById(this.value).textContent = 'Correct!';

            correct_explanation();
            countdown();
            setTimeout(resetButtons, 10000);
            try {

                var npoints = document.querySelector('#points').textContent
                var points = Number(npoints.replace(/\D/g, ''));


                /*document.getElementById('points').value = Number(document.getElementById('points').value.trim()) + 10*/
                try {
                    var user_points = localStorage.getItem('points');
                    console.log(user_points)
                    if (user_points == 0) {
                        user_points = localStorage.setItem('points', 10)

                    }
                    else {
                        user_points = localStorage.setItem('points', Number(user_points) + 10)

                    }
                    document.querySelector('#points').textContent = `${points + 10} points`
                }
                catch {

                }


            }
            finally {

            }




        } else {

            ans.style.color = '#e44444';
            document.getElementById(this.value).textContent = 'Incorrect';
            incorrect_explanation();
            countdown();
            setTimeout(resetButtons, 10000);

        }


    }
}
function reset() {
    window.location.reload();
}






function countdown() {
    let count = 10;
    const countdownElement = document.getElementById('countdownnum');
    const countdown = setInterval(() => {
        count--; countdownElement.textContent = count + 's';
        if (count === 0) {
            clearInterval(countdown);

        }
    }, 1000);
}
function countIni() {

    let startNum = 0,
        endNum = localStorage.getItem('points');
    nSecond = 2,
        resolutionMS = 33,
        deltaNum = (endNum - startNum) / (1000 / resolutionMS) / nSecond;
    if (endNum === 0) {
        document.querySelector('#points').textContent = 0;
    }
    var handle = setInterval(() => {

        var x = startNum.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        document.querySelector('#points').textContent = `${x} points`;

        if (startNum >= endNum) clearInterval(handle);

        startNum += deltaNum;
        startNum = Math.min(startNum, endNum);
    }, resolutionMS);
}

function correct_explanation() {
    console.log('correct')

    document.querySelector('#questionacc').style.display = 'none';

    document.querySelector('#explanation').style.display = 'block';
    document.querySelector('.explaintext').classList.add('typing-effect');
    const text = localStorage.getItem('correct_explanation');
    const typewriterElement = document.querySelector('.explaintext');
    typewriterElement.textContent = '';
    let index = 0;
    function type() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 10);
        }
    }
    type();

}
function incorrect_explanation() {
    console.log('wrong')

    document.querySelector('#questionacc').style.display = 'none';
    
    document.querySelector('#explanation').style.display = 'block';
    document.querySelector('.explaintext').classList.add('typing-effect');
    const text = localStorage.getItem('incorrect_explanation');
    const typewriterElement = document.querySelector('.explaintext');
    typewriterElement.textContent = '';
    let index = 0;
    function type() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 10);
        }
    }
    type();

}



document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.stimg');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in');
            } else {

            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll('.ndimg');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slidein');
            } else {

            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });
});


onVisible(document.querySelector('#question_divy'), () =>

    grow()

);
function grow() {
    var element = document.querySelector('#question_divy')
    element.classList.add('grow')
}