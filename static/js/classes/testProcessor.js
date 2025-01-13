export default class TestProcessor {
  // ? Находим нужные элементы
  btn_start_test = document.getElementById("start-test");
  test_block = document.getElementById("test-block");
  // ? Поля, которые будут изменяться
  question_field = document.getElementById("question-field");
  answ_field = document.getElementById("answ-field");
  error_field = document.getElementById("error");
  btn_next = document.getElementById("send-answ");

  async init() {
    this.btn_start_test.addEventListener("click", () => {
      this.btn_start_test["hidden"] = true;
      this.test_block["hidden"] = false;

      this.startTest();
    });

    // ? Инициализируем нужные переменные
    this.index_question = 0;
    this.json_answers = {};

    // ? Получаем вопросы
    this.questions = {};
    await this.getQuestions();
    this.questions_lenght = Object.keys(this.questions).length;

    console.log(this.questions);
    console.log(this.questions_lenght);
  }

  // ? Функция для получения вопросов. Записывает данные в this.questions
  async getQuestions(file_name) {
    let url = "/json/";
    if (file_name == null) {
      url += "questions1.json";
    } else {
      url += file_name;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.questions = await response.json();
  }

  // * Функция для управления тестом
  // ? Функция для начала тестирования
  startTest() {
    this.btn_next.addEventListener("click", () => {
      this.btn_next.textContent = "Далее";
      this.answ_field["hidden"] = false;
      this.nextQuestion();
    });
  }

  // ? Функция для показа вопроса и запоминания ответа
  async nextQuestion() {
    // ? Говорим, что вопросы закончились и ждём ещё одно нажатие чтобы перейти на главную
    if (this.index_question == this.questions_lenght) {
      this.question_field.textContent = "Вы прошли тест! Ждите результатов";
      this.btn_next.textContent = "На главную";
      this.answ_field["hidden"] = true;
      this.index_question++;
      await this.sendData();
      return;
    }
    // ? После всех вопросов при повторном нажатии делаем действия
    if (this.index_question > this.questions_lenght) {
      document.location = "/";
      return;
    }

    if (this.index_question > 0) {
      this.rememberAnswer();
    }
    this.showQuestion();
    console.log(this.index_question);
    this.index_question++;
  }

  // ? Показывает вопрос
  showQuestion() {
    this.question_field.textContent =
      this.questions[this.index_question]["question"];
  }

  // ? Записывает ответ в json
  rememberAnswer() {
    this.json_answers[this.index_question] = this.answ_field.value;
    this.answ_field.value = "";
  }

  // ? Отправляем данные на сервер
  async sendData() {
    await fetch("/get_data_from_client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.json_answers),
    });
  }
}
