from bson import ObjectId

# Store resumes and job data
def insert_resume(db, data):
    """ Insert a new resume into MongoDB """
    return db.resumes.insert_one(data).inserted_id

def get_resumes(db):
    """ Fetch all resumes from MongoDB """
    return list(db.resumes.find())

def get_resume_by_id(db, resume_id):
    """ Fetch a single resume by ID """
    return db.resumes.find_one({"_id": ObjectId(resume_id)})

def insert_job_criteria(db, data):
    """ Insert job criteria into MongoDB """
    return db.jobs.insert_one(data).inserted_id
