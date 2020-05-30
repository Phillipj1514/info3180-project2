"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
import os, datetime, uuid
from app import app, db, posts_folder, profile_photo_folder
from flask import render_template, request,redirect, url_for, flash,abort, jsonify,g
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from app.models import *
from app.forms import *
from app.jwt import *

db.create_all()

###
# Routing for your application.
###


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):               
     return render_template('index.html')

# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

# Photogram API EndPoints Below
# User registration endpoint
@app.route('/api/users/register', methods=['POST'])
def userRegister():
    userRegistrationForm = UserRegistrationForm() #(csrf_enabled=False)
    submission_errors = []

    if request.method == 'POST' and userRegistrationForm.validate_on_submit():
        success = True
        username = userRegistrationForm.username.data
        password = userRegistrationForm.password.data
        confirmed_password  = userRegistrationForm.confirm_password.data
        firstname = userRegistrationForm.firstname.data
        lastname = userRegistrationForm.lastname.data
        email = userRegistrationForm.email.data
        location = userRegistrationForm.location.data
        biography = userRegistrationForm.biography.data
        profile_photo = userRegistrationForm.profile_photo.data

        fileuid = str(uuid.uuid4())
        oldfilename = profile_photo.filename
        ext = oldfilename.split(".")[1]
        profile_photo_name = (fileuid + oldfilename + "." + ext).replace('-', '_')
        profile_photo_name = secure_filename(profile_photo_name)

        if(password != confirmed_password): 
            success = False
            submission_errors.append("password and confirm passowrd is different")
        if(not Users.query.filter_by(firstname=username).first() is None): 
            success = False
            submission_errors.append("username unavailable")
        if( not Users.query.filter_by(email=email).first() is None):
            success = False
            submission_errors.append("email already used")
        # Save the data if the information entered is valid and new 
        #print("success", success)
        if(success == True):
            profile_photo.save(os.path.join(
                profile_photo_folder, profile_photo_name
            ))
            user = Users(username,password,firstname,lastname, email, location, biography, profile_photo_name,datetime.datetime.now())
            db.session.add(user)
            db.session.commit()
            return successResponse({"message": "User successfully registered"}),201
    # If the form fail to submit it returns an error message
    #print(userRegistrationForm.firstname.data)
    errors = errorResponse(form_errors(userRegistrationForm)+submission_errors)
    return errors,400

# user login endpoint
@app.route('/api/auth/login', methods=['POST'])
def login():
    loginForm = LoginForm() 
    submission_errors = []

    if request.method == 'POST' and loginForm.validate_on_submit():
        username = loginForm.username.data
        password = loginForm.password.data
        user = Users.query.filter_by(username=username).first()
        if user is not None and check_password_hash(user.password, password):
            # On successfuly verification create the user payload with the user id 
            # and generate the user token
            payload = {"userid":user.id,"time":datetime.datetime.now().strftime("%m/%d/%Y, %H:%M:%S")}
            token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256').decode('utf-8')
            return successResponse({'message': username+" User successfully logged in.", "token": token}),200
        # Add user validation error
        submission_errors.append("username or password invallid")

    return errorResponse(form_errors(loginForm)+submission_errors),403


# User logout endpoint
@app.route('/api/auth/logout', methods=['GET'])
@requires_auth
def logout():
    spoiltoken = JWTBlacklist(g.current_token)
    db.session.add(spoiltoken)
    db.session.commit()
    return successResponse({"message": "User successfully logged out."})

@app.route('/api/users/<user_id>', methods=['GET'])
@requires_auth
def getUserDetail(user_id):
    # Check to ensure the user id entered is an integer
    if (not isinstance(user_id, int) and not user_id.isnumeric()): abort(400)
    user = Users.query.filter_by(id=user_id).first()
    # check to ensure user id is present
    submission_errors = []
    if(not user is None ):
        posts = Posts.query.filter(Posts.user_id == user_id).all()
        posted_items = []
        if(len(posts) > 0):
            for post in posts:
                posted_items.append(getPostDetails(post))

        # Order user data
        userDetail = {
            "id": user.id,
            "username": user.username,
            "firstname": user.firstname,
            "lastname": user.lastname,
            "email": user.email,
            "location": user.location,
            "biography": user.biography,
            "profile_photo": user.profile_photo,
            "joined_on": user.joined_on.strftime("%m/%d/%Y, %H:%M:%S"),
            "posts":posted_items
        }
        return successResponse(userDetail)
    submission_errors.append("user id invalid")
    return errorResponse(submission_errors)


@app.route('/api/users/<user_id>/posts', methods=['POST'])
@requires_auth
def createUserPost(user_id):
    addPostForm = AddPostForm() #(csrf_enabled=False)
    submission_errors = []
    if request.method == 'POST' and addPostForm.validate_on_submit():
        # Check to ensure the user id entered is an integer
        if (not isinstance(user_id, int) and not user_id.isnumeric()): abort(400)
        user = Users.query.filter_by(id=user_id).first()
        # Collect data from forms
        success = True  
        caption = addPostForm.caption.data
        photo = addPostForm.photo.data
        photo_name = secure_filename(photo.filename)
        # check to ensure user id is present
        if(user is None ):
            success = False
            submission_errors.append("user id invalid")
        if(success):
            photo.save(os.path.join(
                app.config['UPLOAD_FOLDER'],photo_name
            ))
            # create the post and add it to the database
            post = Posts(user_id, photo_name, caption, datetime.datetime.now())
            db.session.add(post)
            db.session.commit()
            return successResponse({"message": "Successfully created a new post"}),201
    return errorResponse(form_errors(addPostForm)+submission_errors),400


@app.route('/api/users/<user_id>/posts', methods=['GET'])
@requires_auth
def getUserPosts(user_id):
    # Check to ensure the user id entered is an integer
    if (not isinstance(user_id, int) and not user_id.isnumeric()): abort(400)
    user = Users.query.filter_by(id=user_id).first()
    # check to ensure user id is present
    submission_errors = []
    if(not user is None ):
        posts = Posts.query.filter(Posts.user_id == user_id).all()
        posted_items = []
        if(len(posts) > 0):
            for post in posts:
                posted_items.append(getPostDetails(post))
            
        return successResponse({"posts":posted_items})
    submission_errors.append("user id invalid")
    return errorResponse(submission_errors),400

def getPostDetails(post):
    userDet = Users.query.filter(Users.user_id == post.user_id).first()
    user_name = userDet.username
    user_photo = userDet.profile_photo
    likes = Likes.query.filter_by(Likes.post_id == post.id).count()
    user_like = Likes.query.filter_by(Likes.user_id == post.user_id, Likes.post_id == post.id).first()
    user_liked = False
    print("user likes", user_like)
    item = {
        "id": post.id,
        "user_id": post.user_id,
        "user_name": user_name,
        "user_photo": user_photo,
        "photo": post.photo,
        "caption": post.caption,
        "likes": likes,
        "user_liked": user_liked,
        "created_on":post.created_on.strftime("%m/%d/%Y, %H:%M:%S")
    }
    return item   

@app.route('/api/users/<user_id>/follow', methods=['POST'])
@requires_auth
def createUserFollow(user_id):
    addFollowForm = AddFollowForm(csrf_enabled=False)
    submission_errors = []
    if request.method == 'POST' and addFollowForm.validate_on_submit():
        userId = addFollowForm.user_id.data
        follower_id = addFollowForm.follower_id.data
        # Check to ensure the user id entered is an integer
        if ((not isinstance(user_id, int) and not user_id.isnumeric()) or 
                (not isinstance(userId, int) and not userId.isnumeric())): abort(400)
        follower = Users.query.filter_by(id=user_id).first()
        followed = Users.query.filter_by(id=userId).first()

        # check to ensure user id is present
        if((not follower is None) and (not followed is None)):
            # current_user_id = g.current_user["userid"]
            # user_following_id = user.id 
            follow = Follows(followed.id,follower.id)
            db.session.add(follow)
            db.session.commit()
            return successResponse({"message": "You are now following that user."}),201
        submission_errors.append("user ids are invalid")
    return errorResponse(form_errors(addFollowForm)+submission_errors),400    


@app.route('/api/users/<user_id>/follow', methods=['GET'])
@requires_auth
def getFollowerCount(user_id):
    # Check to ensure the user id entered is an integer
    if (not isinstance(user_id, int) and not user_id.isnumeric()): abort(400)
    user = Users.query.filter_by(id=user_id).first()
    # check to ensure user id is present
    submission_errors = []
    if(not user is None ):
        follows = Follows.query.filter(Follows.user_id == user_id).all()
        followCount = len(follows)
        return successResponse({"followers": followCount}),200
    submission_errors.append("user id invalid")
    return errorResponse(submission_errors),400


@app.route('/api/posts', methods=['GET'])
@requires_auth
def getAllPosts():
    posts = Posts.query.order_by(Posts.created_on.desc()).all()
    posted_items = []
    if(len(posts) > 0):
        for post in posts:
            posted_items.append(getPostDetails(post))
    return successResponse({"posts": posted_items}),200
    

@app.route('/api/posts/<post_id>/like', methods=['POST'])
@requires_auth
def addLikeToPost(post_id):
    submission_errors = []
    # Check to ensure the user id entered is an integer
    if (not isinstance(post_id, int) and not post_id.isnumeric()): abort(400)
    post = Posts.query.filter_by(id=post_id).first()
    # check to ensure post id is present
    if(not post is None ):
        current_user_id = g.current_user["userid"]
        user_post_id = post.id 
        like = Likes(current_user_id, post_id)
        db.session.add(like)
        db.session.commit()
        # Count the Likes
        likes = Likes.query.filter(Likes.post_id == post_id).all()
        numLikes = len(likes)
        return successResponse({"message": "Post liked!","likes": numLikes}),201
    submission_errors.append("post id invalid")
    return errorResponse(submission_errors),400 

@app.route('/api/posts/<post_id>/like', methods=['GET'])
@requires_auth
def getLikesCount(post_id):
    # Check to ensure the user id entered is an integer
    if (not isinstance(post_id, int) and not post_id.isnumeric()): abort(400)
    post = Posts.query.filter_by(id=post_id).first()
    # check to ensure user id is present
    submission_errors = []
    if(not post is None ):
        likes = Likes.query.filter(Likes.post_id == post_id).all()
        numLikes = len(likes)
        return successResponse({"Likes": numLikes}),201
    submission_errors.append("post id invalid")
    return errorResponse(submission_errors),400

# APi request response
def successResponse(message):
    return jsonify(message)

def errorResponse(error):
    return jsonify(error=error)

###
# The functions below should be applicable to all Flask apps.
###
def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (
                getattr(form, field).label.text,
                error
            ), 'danger')

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
