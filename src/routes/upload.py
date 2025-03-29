from flask import Blueprint, request, jsonify
from config import db
from models import insert_resume
from cloudinary_utils import upload_file

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload():
    """ Upload resumes and store in MongoDB + Cloudinary """
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']

    # Upload to Cloudinary
    file_url = upload_file(file)

    # Store in MongoDB
    resume_data = {
        "name": file.filename,
        "url": file_url,
        "uploaded_at": request.form.get('date')
    }
    resume_id = insert_resume(db, resume_data)

    return jsonify({'message': 'Resume uploaded', 'resume_id': str(resume_id), 'url': file_url})
