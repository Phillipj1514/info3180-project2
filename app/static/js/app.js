/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
        <img src='static/images/photogram.png' class="header-logo" alt="Photogram Logo" />
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>  
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
          </li>  
          <li class="nav-item active">
            <router-link class="nav-link" to="/my_profile">My Profile<span class="sr-only">(current)</span></router-link>
          </li>  
          <li class="nav-item active">
            <router-link class="nav-link" to="/logout">Logout<span class="sr-only">(current)</span></router-link>
          </li>  
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Photogram.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template: `
    <div class="home-page-container">
        <div class="container home-cards">
        <img src="/static/images/home.jpg" class='home-image' alt='Picture of a pink fall trees'/>
        <div class="card home-auth-card">
            <div class="row home-card-head">
            <img class="card-header-image" src="static/images/photogram.png" alt="Photogram Logo">
            <div class="home-card-header"> Photogram</div>
            </div>
            <hr class="divider"/>
            <div class="card-body">
              <p class="card-text">Share photos of your favourite moments with friends, family and the world.</p>
              <div class="home-btns">
                  <button class="btn btn-success col-md-5" v-on:click="onClickRegister">Register</button>
                  <button class="btn btn-primary col-md-5" v-on:click="onClickLogin">Login</button>
              </div>
            </div>
        </div> 
        </div> 
    </div>
   `,
    data: function() {
       return {}
    },
    methods: {
        onClickRegister: function (event) {
            const router = this.$router;
            router.push("/register")
        },
        onClickLogin: function (event) {
            const router = this.$router;
            router.push("/login")
        }
    }
});

const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})


const Register = Vue.component('register', {
    template: `
    <div class="container regular">
        <h1>Register</h1>
        <div class="auth-form-container">
           <form id="registrationForm" enctype="multipart/form-data" method="POST" class="col-md-12" @submit.prevent="onRegister">
            <div class="form-group">
                <label class="form-label" for="usernameField">Username</label>
                <input type="text" class="form-control" id="usernameField" placeholder="Enter username" required v-model="formData.username" minlength="1" maxlength="20"></input>
                <div class="no-error" id="usernameError">Your username can only contain letters and numbers</div>
            </div>
            <div class="form-group">
                <label class="form-label" for="passwordField">Password</label>
                <input type="password" class="form-control" id = "passwordField" placeholder="Enter password" minlength="1" maxlength="20" required v-model="formData.password"></input>
                <div class="no-error" id="passwordError">Your password must contain at least 8 characters, a letter and a number.</div>
            </div>
            <div class="form-group">
                <label class="form-label" for="confirmPasswordField">Confirm Password</label>
                <input type="password" id="confirmPasswordField" class="form-control" placeholder="Enter password again" minlength="1" maxlength="20" required v-model="formData.confirmPassword">
                <div class="no-error" id="confirmPasswordError">Both passwords must be the same. Enter again.</div>
            </div>
            <div class="form-group">
                <label class="form-label" for="firstnameField">Firstname</label>
                <input type="text" class="form-control" placeholder="Enter firstname" id="firstnameField" required minlength="8" maxlength="20" v-model="formData.firstname"></input>
                <div class="no-error" id="firstnameError">Your firstname cannot contain special characters apart from a hyphen or apostrophe.</div>
            </div>
            <div class="form-group">
                <label class="form-label" for="lastnameField">Lastname</label>
                <input type="text" id="lastnameField" class="form-control" placeholder="Enter lastname" required minlength="8" maxlength="20" v-model="formData.lastname"></input>
                <div class="no-error" id="lastnameError">Your lastname cannot contain special characters apart from a hyphen or apostrophe.</div>
            </div>
            <div class="form-group">
                <label class="form-label" for="emailField">Email</label>
                <input type="email" class="form-control" placeholder="Enter email" id="emailField" required minlength="1" maxlength="20" v-model="formData.email"></input>
            </div>
            <div class="form-group">
                <label class="form-label" for="locationField">Location</label>
                <input type="text" id="locationField" class="form-control" placeholder="Where are you from? eg. Kingston, Jamaica" minlength="3" maxlength="20" required v-model="formData.location"></input>
                <div class="no-error" id="locationError">Location should be in the format 'City, Country'</div>
            </div>
            <div class="form-group">
                <label class="form-label" for="biographyField">Biography</label>
                <textarea class="form-control" placeholder="Tell us a little about you." id="biographyField" rows="4" minlength="1" maxlength="255"required v-model="formData.biography"></textarea>
            </div>
            <div class="form-group d-flex flex-column">
                <label class="form-label" for="photoField">Photo</label>
                <input type="file" id="photoField" accept="image/*" v-on:change="savePhoto($event.target.files)" required></input>
            </div>
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    </div>    
    </div>
    `,
    data: function () {
        return {
            formData: {
                username: "",
                password: "",
                confirmPassword: "",
                firstname: "",
                lastname: "",
                email: "",
                location: "",
                biography: "",
                photo: null
            }
        }
    },
    methods: {
        onRegister: function () {
                      

            if (this.validateForm()) {
                //make ajax request
                console.log('success');
            } else {

                console.log('fails');
            }
        },
        validateForm() {
            let validForm = true;
            let passwordRegex = new RegExp('^[a-zA-Z0-9]+(([\',. -][a-zA - Z0 - 9 ]) ? [a - zA - Z0 - 9] *)*$');
            let nameRegex = new RegExp('^[a-zA-Z]+(([\'-][a-zA-Z ])?[a-zA-Z]*)*$');
            let userNameRegex = new RegExp('^[a-zA-Z0-9.]+$');
            let locationRegex = new RegExp('^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$');


            const errorDivs = document.getElementsByClassName('error');
            
            (Array.from(errorDivs)).forEach(div => {
                div.setAttribute('class', 'no-error')
            });

            //check for username format errors
            if (!userNameRegex.test(this.username)) {
                validForm = false;
                const unameError = document.getElementById('usernameError');
                unameError.setAttribute('class', 'error');
            }

            //check for password format errors
            if (!passwordRegex.test(this.formData.password)) {
                validForm = false;
                const passwordError = document.getElementById('passwordError');
                passwordError.setAttribute('class', 'error');
            }

            //check for password match if password format is correct

            if (passwordRegex.test(this.formData.password)) {
                if (!(this.formData.password === this.formData.confirmPassword)) {
                    validForm = false;
                    const confirmPasswordError = document.getElementById('confirmPasswordError');
                    confirmPasswordError.setAttribute('class', 'error');
                }
            }

            //check for correct firstname format
            if (!nameRegex.test(this.formData.firstname)) {
                validForm = false;
                const firstnameError = document.getElementById('firstnameError');
                firstnameError.setAttribute('class', 'error');
            }

            //check for correct lastname format
            if (!nameRegex.test(this.formData.lastname)) {
                validForm = false;
                const lastnameError = document.getElementById('lastnameError');
                lastnameError.setAttribute('class', 'error');
            }

            //check for correct location format
            if (!locationRegex.test(this.formData.location)) {
                validForm = false;
                const locationError = document.getElementById('locationError');
                locationError.setAttribute('class', 'error');
            }

            return validForm;
        },
        savePhoto(fileList) {
            if(fileList.length > 0) {
                this.photo = fileList[0];
            }
        }
    }
})


const Login = Vue.component('login', {
    template: `
        <div>
            <h1>Login</h1>
            <div class="auth-form-container">
                <form id="loginForm" class="" action="" method="POST">
                    <div class="form-group">
                        <label class="form-label" for="usernameField">Username</label>
                        <input type="text" id="usernameField" required></input>
                        <div class="invalid-feedback">This field is required.</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="passwordField">Password</label>
                        <input type="password" id="pasdwordField" required></input>
                        <div class="invalid-feedback">This field is required.</div>
                    </div>
                    <br/>
                    <button type="submit" class="btn btn-primary" id="loginBtn">Login</button>
                </form>
        </div>
    </div>
    `,
    data: function () {
        return {}
    }
})

const Feed = Vue.component('feed', {
    template: `
    <div class="container">
        <div class="feed-posts">
            <div class="post card">
                <div class="post-header">
                    <img src='static/images/photogram.png' height="30" width="30" />
                    <div class="poster"></div>                        
                </div>
                <img class="post-image" src='static/images/uploads/2.jpg' width="500" height="500"/>
                <div class='post-caption'>I was once a stranger walking through this city. I wmanaged to dlkdlksdlkdlklkdlk lorem impsum dloeremand fk lkdj kja j;kd djlk ddkljdsljdsijepi ddjhdoirj fj</div>
                <div class="post-footer">
                    <div class="footer-left">
                        <img src='static/images/photogram.png' width="20" height="20" class="like-icon"/>
                        <p class="like-details">10 Likes</p>
                    <div class="footer-left">24 Apr 2018</div>
                </div>

            </div>                
        </div>
        <div class="sidebar">
             <button type="submit" class="btn btn-primary new-post-btn">New Post</button>   
        </div>
    </div>
   `,
    data: function () {
        return {}
    }
})

const CreatePost = Vue.component('post', {
    template: `
        <div>
            <h1>New Post</h1>
            <div class="auth-form-container">
                <form class="" action="" method="POST">
                    <div class="form-group d-flex flex-column">
                        <label class="form-label" for="photoField">Photo</label>
                        <input type="file" id="photoField" required></input>
                        <div class="invalid-feedback">This field is required</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="captionField">Caption</label>
                        <textarea class="form-control" placeholder="Tell us a little about this picture." id="captionField" rows="4"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" id="loginBtn">Sumbit</button>
                </form>
            </div>
        </div>
    `,
    data: function () {
        return {}
    }
})

const UserProfile = Vue.component('user-profile', {
    template: `
    <div class="full-page-container">
        <div class="profile-head-cotainer">
            <img src='static/uploads/2.jpg' alt='Profile Photo' style="width:100px; height:100px"/> 
            <div class="profile-details-container">
                <div class="title">Rosa Diaz</div>
                <div class="location">Kingston, Jamaica</div>
                <div class="member-details">Member since January 2018</div>
                <div class="biography-details">THis is my short biography so you can learn more about me</div>
            </div>
            <div class="engagement-container">
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">6</div>
                        <div class="stat-label">Posts</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">10</div>
                        <div class="stat-label">Followers</div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary follow-btn">Follow</button>
            </div>
        </div>
        <div class="posts-container col-md-3">
            <div class="no-posts">This user hasn't posted anything yet.</div>
                <img src='static/images/uploads/2.jpg' width="250" height="250" />   
                <img src='static/images/uploads/2.jpg' width="250" height="250" /> 
                <img src='static/images/uploads/2.jpg' width="250" height="250" />
                <img src='static/images/uploads/2.jpg' width="250" height="250" />
                <img src='static/images/uploads/2.jpg' width="250" height="250" />
                <img src='static/images/uploads/2.jpg' width="250" height="250"/>
        </div>
        </div>
    `,
    data: function () {
        return {
            profilePhotoSource: require("../imauploads/2.jpg")
        }
    },
    methods: {
        getProfilePhotoUrl() {
            var imageUrl = require("static/images/uploads/2.jpg")
            return imageUrl;
        }
    },
    props: ['profilePhotoSource']
})


// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        { path: "/register", component: Register },
        { path: "/login", component: Login },
        { path: "/logout", component: Home },
        { path: "/explore", component: Feed },
        { path: "/users/", component: UserProfile },
        { path: "/posts/new", component: CreatePost },
        {path: "*", component: NotFound }
    ]
});


// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router,
    data:{
        flash: false
    }
});