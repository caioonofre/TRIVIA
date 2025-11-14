let URL_BASE;
const URL_BASE_TRADUTOR = "https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=pt-br&q="
const triviaElement = document.getElementById("trivia-container");



const escolha = async () => {
    await new Promise(res => {
        const inputTema = document.getElementById("escolhatema");
        inputTema.onkeyup = (event) => {
            if (event.key.toLowerCase() === "enter") {
                if (inputTema.value == 1) {
                    URL_BASE = "https://opentdb.com/api.php?amount=5&category=28&difficulty=";
                } else if (inputTema.value == 2) {
                    URL_BASE = "https://opentdb.com/api.php?amount=5&category=22&difficulty=";
                } else {
                    URL_BASE = "https://opentdb.com/api.php?amount=5&category=27&difficulty=";
                }
                res();
            }
        };
    });
    await escolhaDificuldade();
}

const escolhaDificuldade = async () => {
    await new Promise(res => {
        const inputDificulade = document.getElementById("escolhadificuldade");
        // inputDificulade.onkeyup = (event) => {
        // if (event.key.toLowerCase() === "enter") {
        if (inputDificulade.value == 1) {
            URL_BASE + "easy"
            console.log(URL_BASE)
        } else if (inputDificulade.value == 2) {
            URL_BASE + "medium";
            console.log(URL_BASE)
        } else {
            URL_BASE + "hard";
            console.log(URL_BASE)
        }
        res();
    }
        // };}
    );
    triviaElement.innerHTML = '';
    await fetchTrivia(URL_BASE);
}


const traslateText = async (txt) => {
    try {
        const response = await fetch(URL_BASE_TRADUTOR + encodeURIComponent(txt));
        const data = await response.json();
        return data[0][0];
    } catch (error) {
        console.error('Error translate text: ', error)
        return txt;
    }
}

const fetchTrivia = async (url) => {
    let correctAnswer = 0;
    try {
        let data = await fetch(url);
        data = await data.json();

        triviaElement.innerHTML = '';

        for (const question of data.results.values()) {
            const questionElement = document.createElement('div');
            questionElement.innerHTML = `<h3>${await traslateText(decodeURIComponent(question.question))}</h3>`;
            triviaElement.appendChild(questionElement);

            const answerElement = document.createElement('div');
            const allAnswers = [...question.incorrect_answers, question.correct_answer];
            allAnswers.sort();

            for (let answer of allAnswers) {
                const buttonElement = document.createElement('button');
                buttonElement.innerText = await traslateText(decodeURIComponent(answer));
                answerElement.appendChild(buttonElement);
                // buttonElement.addEventListener('click', () => {
                //     if(buttonElement.innerText === question.correct_answer) {
                //         alert("Correto");
                //         correctAnswer++;
                //     } else {
                //         alert(`Incorreta! A resposta correta era ${question.correct_answer}`);
                //     }
                // })
            }
            questionElement.appendChild(answerElement);
            const translatedRightAnswer = await traslateText(question.correct_answer)

            await new Promise(resolve => {
                const allButons = answerElement.querySelectorAll('button');
                allButons.forEach((b) => b.addEventListener('click', (e) => {
                    console.log(e);

                    if (b.innerText === translatedRightAnswer) {
                        alert("Correto");
                        correctAnswer++;
                    } else {
                        alert(`Incorreta! A resposta correta era ${translatedRightAnswer}`);
                    }
                    triviaElement.innerHTML = '';
                    resolve();
                }))
            })
        }

        const resultElement = document.createElement('div');
        resultElement.innerHTML = `<h4>Você acertou ${correctAnswer}/5! </h4>`;
        triviaElement.appendChild(resultElement);

    } catch (error) {
        console.error('Error fetching trivia: ', error);
        // fetchTrivia(url);       
    }
}
escolha()