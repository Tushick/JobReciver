import os
import json
from data.config.config import *
from flask import Flask, render_template, request, url_for, jsonify

app = Flask(__name__)


# ? Возвращение главной страницы сайта
@app.route("/")
def index():
    return render_template("index.html")


# ? Переход на любую другую страницу
@app.route("/<name_html>")
def get_html(name_html: str):
    if os.path.exists(os.path.join("templates", name_html)):
        return render_template(name_html)
    else:
        return "Not found", 404


# ? Получение json файла
# ! Пока что без какой-либо защиты (то есть пользователь тоже может получить доступ)
@app.route("/json/<name_file>")
def get_json(name_file: str):
    path_to_file = DIRECTORY_JSONS / name_file
    if path_to_file.exists():
        with open(path_to_file, "r") as f:
            return json.load(f)
    else:
        return "Not found", 404


# ? Функция для принятия данных из js
@app.route("/get_data_from_client", methods=["POST"])
def get_data_from_client():
    if request.is_json:
        data = request.get_json()
        print("Received data from client:", data)
        with open("result.json", "w") as f:
            json.dump(data, f)

        return "received", 200
    else:
        return "400: Request does not have application/json header", 400


if __name__ == "__main__":
    app.run(host=HOST, debug=SERVER_START_DEBUG)
