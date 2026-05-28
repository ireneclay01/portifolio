from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data.json")


def load_data():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)

    except FileNotFoundError:
        return {
            "error": "data.json not found"
        }

    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON format"
        }


@app.route("/")
def home():
    return jsonify({
        "message": "Portfolio API is running",
        "endpoints": [
            "/api/profile",
            "/api/skills",
            "/api/qualifications",
            "/api/projects"
        ]
    })


def get_section(section_name):
    data = load_data()
    return jsonify(data.get(section_name, {}))


@app.route("/api/profile")
def profile():
    return get_section("profile")


@app.route("/api/skills")
def skills():
    return get_section("skills")


@app.route("/api/qualifications")
def qualifications():
    return get_section("qualifications")


@app.route("/api/projects")
def projects():
    return get_section("projects")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=True
    )