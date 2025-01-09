import os
import json
from data.config.config import *
from flask import Flask, render_template, request, url_for, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/json/<name_file>')
def get_js(name_file: str):
    with open(name_file, 'r') as f:
        return json.load(f)

if __name__ == "__main__":
    app.run(debug=True)
