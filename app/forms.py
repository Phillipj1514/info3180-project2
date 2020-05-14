from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, IntegerField
from wtforms.validators import InputRequired, DataRequired, Email
from flask_wtf.file import FileField, FileRequired, FileAllowed

class UserRegistrationForm(FlaskForm):
    username = StringField('Username', 
        validators=[DataRequired(), InputRequired()])

    password = PasswordField('Password', 
        validators=[DataRequired(), InputRequired()])

    confirm_password = PasswordField('Confirm Password', 
        validators=[DataRequired(), InputRequired()])

    firstname = StringField('First Name', 
        validators=[DataRequired(), InputRequired()])

    lastname = StringField('Last Name', 
        validators=[DataRequired(), InputRequired()])

    email = StringField('Email', 
        validators=[DataRequired(), Email(), InputRequired()], 
        description="123@abc.com")

    location = StringField('Location', 
        validators=[DataRequired(), InputRequired()], 
        description="kingston")

    biography  = TextAreaField('Biography',
        validators=[DataRequired(), InputRequired()])

    profile_photo = FileField('Profile Picture', 
        validators=[FileRequired(),
        FileAllowed(['jpg', 'png', 'Images only!'])])

class LoginForm(FlaskForm):
    username = StringField('Username', 
        validators=[DataRequired(), InputRequired()])

    password = PasswordField('Password', 
        validators=[DataRequired(), InputRequired()])

class AddPostForm(FlaskForm):
    caption  = TextAreaField('Caption',
        validators=[DataRequired(), InputRequired()])

    photo = FileField('Photo', 
        validators=[FileRequired(),
        FileAllowed(['jpg', 'png', 'Images only!'])])

class AddFollowForm(FlaskForm):
    user_id = IntegerField('User Id', 
        validators=[DataRequired(), InputRequired()])
    follower_id = IntegerField('Follower Id', 
        validators=[DataRequired(), InputRequired()])
