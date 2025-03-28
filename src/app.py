from flask import Flask  
from routes.upload import upload_bp  
from routes.hr import hr_bp  
from flask_cors import CORS  

app = Flask(__name__)  
CORS(app)  # Allow cross-origin requests

# Register Routes  
app.register_blueprint(upload_bp, url_prefix='/api')  
app.register_blueprint(hr_bp, url_prefix='/api')  

if __name__ == '__main__':  
    app.run(debug=True)
