from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from rake_keybert import combine_keywords, filter_keywords, load_valid_keywords
import os

app = Flask(__name__)
CORS(app)

# --- API Endpoint to Extract Keywords from JD ---
@app.route('/api/extract_keywords', methods=['POST'])
def extract_keywords():
    data = request.get_json()
    jd = data.get('jd', '')

    if not jd:
        return jsonify({"error": "No JD provided"}), 400
    
    # Extract and filter keywords
    combined_keywords = combine_keywords(jd)
    valid_keywords = load_valid_keywords()
    filtered_keywords = filter_keywords(combined_keywords, valid_keywords)
    
    return jsonify({"filtered_keywords": filtered_keywords})

# --- Serve React Frontend (Optional) ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(f'../src/{path}'):
        return send_from_directory('../src', path)
    else:
        return send_from_directory('../src', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
