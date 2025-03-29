from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from rake_keybert import combine_keywords, filter_keywords, load_valid_keywords
from resume_scanner import analyze_resumes
import os
import json

app = Flask(__name__)
# Configure CORS with more permissive settings
CORS(app, 
     resources={r"/*": {
         "origins": ["http://localhost:8080", "http://127.0.0.1:8080"],
         "methods": ["GET", "POST", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
         "supports_credentials": True
     }},
     supports_credentials=True)

app.add_url_rule("/analyze", view_func=analyze_resumes)

# --- Directory for storing uploaded resumes temporarily ---
UPLOAD_FOLDER = 'flask_app/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        if 'resumes' not in request.files:
            return jsonify({"error": "No resumes part in request"}), 400

        files = request.files.getlist('resumes')
        required_skills = request.form.get('required_skills')
        
        print(f"Received required_skills: {required_skills}")  # Debug print
        
        if not required_skills:
            return jsonify({"error": "No required skills provided"}), 400
            
        try:
            required_skills = json.loads(required_skills)
            if not isinstance(required_skills, list):
                return jsonify({"error": "Required skills must be a list"}), 400
            if not required_skills:
                return jsonify({"error": "Required skills list cannot be empty"}), 400
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid required_skills format"}), 400

        if not files:
            return jsonify({"error": "No files provided"}), 400

        results = analyze_resumes(files, required_skills)
        return jsonify(results)
    except Exception as e:
        print(f"Error in analyze endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500




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



@app.route('/set_jd_skills', methods=['POST'])
def set_jd_skills():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Extract the jd_skills from the request
        jd_skills = data.get('jd_skills', [])
        
        # You can now process the jd_skills in your backend
        print(jd_skills)  # For debugging

        return jsonify({"message": "JD skills received", "jd_skills": jd_skills}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'resumes' not in request.files:
        return jsonify({"error": "No resumes part in request"}), 400

    files = request.files.getlist('resumes')
    if not files:
        return jsonify({"error": "No files provided"}), 400

    saved_files = []
    for file in files:
        if file and file.filename.endswith('.pdf'):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            saved_files.append(file_path)
        else:
            return jsonify({"error": "Only PDF files are allowed"}), 400

    return jsonify({"message": "Files uploaded successfully", "saved_files": saved_files}), 200


if __name__ == '__main__':
    app.run(debug=True)




