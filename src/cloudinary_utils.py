import cloudinary
import cloudinary.uploader

def upload_file(file):
    """ Upload resume (PDF/DOC) to Cloudinary """
    result = cloudinary.uploader.upload(file, resource_type="auto")
    return result["secure_url"]  # Return the file URL
