from flask import Blueprint, jsonify
from config import db
from models import get_resumes

hr_bp = Blueprint('hr', __name__)

@hr_bp.route('/resumes', methods=['GET'])
def get_all_resumes():
    """ Retrieve all resumes """
    resumes = get_resumes(db)
    
    # Serialize ObjectId to string
    resumes_list = [
        {
            "id": str(resume["_id"]),
            "name": resume["name"],
            "url": resume["url"],
            "uploaded_at": resume.get("uploaded_at", "")
        }
        for resume in resumes
    ]
    
    return jsonify(resumes_list)
