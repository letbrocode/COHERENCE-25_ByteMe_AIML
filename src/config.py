from dotenv import load_dotenv  
import os  
from pymongo import MongoClient  
import cloudinary  
import cloudinary.uploader  
import cloudinary.api  

# Load environment variables  
load_dotenv()

# MongoDB Configuration  
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client['resume_screener']  # Database name

# Cloudinary Configuration  
cloudinary.config(
    cloud_name=os.getenv('CLOUD_NAME'),
    api_key=os.getenv('CLOUD_API_KEY'),
    api_secret=os.getenv('CLOUD_API_SECRET')
)
