from flask import Flask
from flask_wtf.csrf import CSRFProtect 
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['UPLOAD_FOLDER'] = "./app/static/uploads"

# Database configuration
# app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://project2:project2@localhost/project2"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://rsfvhukevsgvdf:03f41ce558394a11e0545f56b7d2a582431ee4fa31870750ad1dda9875d223ca@ec2-35-174-127-63.compute-1.amazonaws.com:5432/d8sm9go93boig0"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
# login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views

