// ? Находим нужные элементы
var btn_start_test = document.getElementById('start-test');
var test_block = document.getElementById('test-block');
// ? Поля для изменения
var question_field = document.getElementById('question-field');
var answ_field = document.getElementById('answ-field');
var error_field = document.getElementById('error');
var btn_next = document.getElementById('send-answ');

class Tester {
    constructor () {
        // ? Добавляем обработчики событий
        btn_start_test.addEventListener('click', () => this.startTest());

        // ? Инициализируем переменные
        this.index_question = 0;
        this.json_answers = {};
    }

    async getAllQuestions() {
        const response = await fetch('/json/questions1.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    async startTest() {
        btn_start_test.hidden = true;
        test_block.hidden = false;

        await this.getAllQuestions().then(data => {
            this.questions = data;
            this.count_questions = Object.keys(data).length
        });
        console.log(this.questions);
        
        btn_next.addEventListener('click', () => {
            this.nextQuestion();
            
        });

        this.nextQuestion();
    }

    getAnswers() {
        return this.json_answers;
    }

    async sendData() {
        await fetch('/get_data_from_client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.json_answers)
        });
    }

    nextQuestion() {
        if (answ_field.value == "" && this.index_question > 0) {
            error_field.textContent = "Введите ответ!";
            // ! Этот return нужен, чтобы нельзя было ответить на вопрос без ответа
            // return;
        }
        else {
            error_field.textContent = "";
        }

        if (!(this.index_question < this.count_questions)) {
            if (btn_next.textContent == "Закончить") {
                this.sendData();                
                document.location = "/";
            }

            btn_next.textContent = "Закончить";
            return;
        }

        while (this.questions[this.index_question] == null && this.index_question < this.count_questions) {
            this.index_question++;
        }
        question_field.textContent = this.questions[this.index_question]['question'];
        this.json_answers[this.index_question] = answ_field.value;
        answ_field.value = "";
        this.index_question++;
    }
}

var testRunner = new Tester();
