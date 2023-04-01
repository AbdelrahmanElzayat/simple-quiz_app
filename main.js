
let countSpan = document.querySelector(".count span");
let bulletsArea = document.querySelector(".bullets")
let BulletContainer = document.querySelector(".bullets .spans");

let question_area = document.querySelector(".quiz_area");
let answer_area = document.querySelector(".answer_area");

let submitBtn = document.querySelector(".submit-btn");

let results = document.querySelector(".results");

let countDownContainer = document.querySelector(".countdown");

let currentQuestion = 0; 
let rightAnswers = 0;
let countDownInterval;


function getQuestion() {

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let myjsObject = JSON.parse(this.responseText);
            // console.log(this.responseText);
            // console.log(myjsObject);
            
            let lenthOfQuestions = myjsObject.length;

            createBullets(lenthOfQuestions);
            
            addQuestionData(myjsObject[currentQuestion] , lenthOfQuestions);

            coundDown(90,lenthOfQuestions);
            
            submitBtn.onclick = () =>{
                
                clearInterval(countDownInterval);
                coundDown(90,lenthOfQuestions);

                let rightAnswer = myjsObject[currentQuestion].right_answer;
                // console.log(rightAnswer);
                currentQuestion++; 
                
                checkAnswer(rightAnswer , lenthOfQuestions);

                //remove previous question and add next question
                question_area.innerHTML = "";
                answer_area.innerHTML ="";
                addQuestionData(myjsObject[currentQuestion],lenthOfQuestions);

                //handle bullets class
                handleBullets();

                //show results
                showResults(lenthOfQuestions);
            }
        }

    };

    myRequest.open("GET" , "html_question.json" , true);
    myRequest.send();
}

getQuestion();

function createBullets (num){
    countSpan.innerHTML = num;
    for (let index = 0; index < num; index++) {
        
        let bulletSpan = document.createElement("span");
        BulletContainer.appendChild(bulletSpan);

        if(index === 0){
            bulletSpan.className = "on"
        }
        
    }
}

function addQuestionData(obj , count){

    if(currentQuestion < count){

        // create h2 question 
        let questionTitle = document.createElement("h2");
        // create text of question 
        let questionText = document.createTextNode(obj.title);
    
        questionTitle.appendChild(questionText);
        question_area.appendChild(questionTitle);
    
        //create answers
        for (let i = 1; i <= 4; i++) {
            
            let answerDiv = document.createElement("div");
            answerDiv.className = "answer";
    
            //create radio button
            let radioInput = document.createElement("input");
            radioInput.name = "answer";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
    
            i===1 ? radioInput.checked = true : null;
    
            //create label 
            let labelOfRadio = document.createElement("label");
            labelOfRadio.htmlFor = `answer_${i}`;
            let theTextOfLabel = document.createTextNode(obj[`answer_${i}`]);
            labelOfRadio.appendChild(theTextOfLabel);
    
            //append to answer div label and radio
    
            answerDiv.appendChild(radioInput);
            answerDiv.appendChild(labelOfRadio);
    
            answer_area.appendChild(answerDiv);
            
        }
    }

}
function checkAnswer(rAnswer , count) {

    let answers = document.getElementsByName("answer");
    let choosenAnswer;

    for(i = 0 ; i<answers.length; i++){
        if(answers[i].checked){
            choosenAnswer = answers[i].dataset.answer
        }
    }
    if(rAnswer === choosenAnswer){
        rightAnswers++
    }
    
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayBullets = Array.from(bulletsSpans);

    arrayBullets.forEach((span,index) => {
        if(currentQuestion === index){

            span.className = "on";
        }
    })
}

function showResults(count){
    let the_results;
    if(count === currentQuestion){
        question_area.remove();
        answer_area.remove();
        submitBtn.remove();
        bulletsArea.remove();

        if(rightAnswers > (count/2) && rightAnswers < count){
            the_results = `<span class="good">Good</span>, you answered ${rightAnswers} from ${count} answers`;
        }else if(rightAnswers === count){
            the_results = `<span class="perfect">perfect</span>, you answered ${rightAnswers} from ${count} answers`;
        }else{
            the_results = `<span class="bad">bad</span>, you answered ${rightAnswers} from ${count} answers`;
        }

        results.innerHTML = the_results;
        results.style.backgroundColor = "white";
        results.style.padding = "10px";
        results.style.margin = "10px";

    }
}

function coundDown(duration , count){

    if(currentQuestion < count){
        let minutes,seconds;
        countDownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countDownContainer.innerHTML = `${minutes} : ${seconds}`;

            if (--duration < 0){
                clearInterval(countDownInterval);
                submitBtn.click()
                console.log("finish");
            }
        },1000)
    }
}