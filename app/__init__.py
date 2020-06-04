from flask import Flask
from flask_wtf.csrf import CSRFProtect 
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['PROFILE_PHOTO_FOLDER'] = './app/static/images/profile_photos'
app.config['POSTS_FOLDER'] = './app/static/images/posts'
profile_photo_folder = app.config['PROFILE_PHOTO_FOLDER']
posts_folder = app.config['POSTS_FOLDER']

# Database configuration
#app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://project2:project2@localhost/project2"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://rsfvhukevsgvdf:03f41ce558394a11e0545f56b7d2a582431ee4fa31870750ad1dda9875d223ca@ec2-35-174-127-63.compute-1.amazonaws.com:5432/d8sm9go93boig0"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # added just to suppress a warning

app.config.from_object(__name__)

db = SQLAlchemy(app)
csrf = CSRFProtect(app)

from app import views

