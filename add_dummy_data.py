from app import db
from app.models import *
import datetime

# db.create_all()
# Add dummy data to the database from the model created
user = Users("test","test","First","Last","fl@prj.com","a location","a test user profile","1.png",datetime.datetime.now())
db.session.add(user)
db.session.commit()
print("Users added successfully")

post = Posts(1,"1.png"," a caption",datetime.datetime.now())
db.session.add(post)
db.session.commit()
print("Posts added successfully")

like = Likes(1,1)
db.session.add(like)
db.session.commit()
print("Likes added successfully")

follow = Follows(1,1) 
db.session.add(follow)
db.session.commit()
print("Follows added successfully")
