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
        onClickRegister: function () {
            router.push("/register")
        },
        onClickLogin: function () {
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
            <div class="message-container">
                <ul class="alert alert-danger" v-if="formValid === 'not_valid'" id="errors">
                    <li v-for="error in errors"> {{ error }} </li>
                </ul>
            </div>

           <form @submit.prevent="onRegister" id="registrationForm" enctype="mutipart/form-data" class="col-md-12">
                <div class="form-group">
                    <label class="form-label" for="usernameField">Username</label>
                    <input type="text" class="form-control" id="usernameField" name="username"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="passwordField">Password</label>
                    <input type="password" class="form-control" id = "passwordField" name="password"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="confirmPasswordField">Confirm Password</label>
                    <input type="password" name="confirm_password" id="confirmPasswordField" class="form-control" placeholder="Enter password again"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="firstnameField">Firstname</label>
                    <input type="text" name="firstname" class="form-control" id="firstnameField"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="lastnameField">Lastname</label>
                    <input type="text" id="lastnameField" class="form-control" name="lastname"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="emailField">Email</label>
                    <input type="email" class="form-control" id="emailField" name="email"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="locationField">Location</label>
                    <input type="text" id="locationField" class="form-control" placeholder="Where are you from? eg. Kingston, Jamaica" name="location"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="biographyField">Biography</label>
                    <textarea class="form-control" name="biography" placeholder="Tell us a little about you." id="biographyField" rows="4"></textarea>
                </div>
                <div class="form-group d-flex flex-column">
                    <label class="form-label" for="photoField">Photo</label>
                    <input type="file" name="profile_photo" id="photoField"/>
                </div>
                <button type="submit" name="submit" class="btn btn-success reg-btn">Register</button>
            </form>
        </div>    
    </div>
    `,
    data: function () {
        return {
            errors: [],
            formValid: false
        }
    },
    methods: {
        onRegister: function () {
            let self = this;
            let regForm = document.getElementById('registrationForm');
            var uformdata = new FormData(regForm);
        
            fetch("/api/users/register", {
                method: 'POST',
                body: uformdata,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json();
            })
            .then(function (jResponse) {
                if (jResponse.hasOwnProperty("error")){
                    self.errors = jResponse.error;
                    self.formValid = 'not_valid';
                } else {
                    self.message = jResponse.message;
                    router.push('/login');
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        }
    }
});

const Login = Vue.component('login', {
    template: ` 
        <div class="container regular">
            <h1>Login</h1>
            <div class="auth-form-container">
                <div class="message-container">
                    <ul class="alert alert-danger" v-if="formValid === 'not_valid'" id="errors">
                        <li v-for="error in errors"> {{ error }} </li>
                    </ul>
                </div>
            <form @submit.prevent="onLogin" enctype="mutipart/form-data" id="loginForm" class="login-form col-md-12">
                <div class="form-group">
                    <label class="form-label" for="usernameField">Username</label>
                    <input type="text" id="usernameField" name="username" class="form-control"/>
                </div>
                <div class="form-group">
                    <label class="form-label" for="passwordField">Password</label>
                    <input type="password" id="passwordField" name="password" class="form-control"/>
                </div>
                <br/>
                <div class="login-ins">Don't have an acccount <em class="register-link link" v-on:click="register">Register Here</em></div>
                <br/>
                <button type="submit" name="submit" class="btn btn-success" id="loginBtn">Login</button>
            </form>
        </div>
    </div>
    `,
    data: function () {
        return {
            formValid: false,
            errors: []
        }
    },
    methods: {
        onLogin: function() {
            let self = this;
            let lForm = document.getElementById('loginForm');
            let lformdata = new FormData(lForm);
            //console.log(lformdata.get("username"));

            fetch('/api/auth/login', {
                method: 'POST',
                body: lformdata,
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jResponse) {
                //console.log(jResponse);
                if (jResponse.hasOwnProperty("message")) {
                    localStorage.setItem('token', jResponse.token);
                    localStorage.setItem('userId', jResponse.userId);
                    router.push('/explore');
                } else {
                    self.errors = jResponse.error;
                    self.formValid = 'not_valid';
                }
            })
            .catch(function(err) {
                console.log(err);
            });  
        },
        register: function() {
            router.push('/register');
        }
    }
});


const Feed = Vue.component('feed', {
    template: `
    <div class="container feed-page">
        <div class="no-content alert alert-info" v-if="showPosts === 'show'">There are no posts to show yet. Go create a post!</div>
        <div class="feed-posts">
            <div class="post card" v-for="(post,index) in posts">
                <div class="post-header">
                    <img height="30" width="30" v-bind:src="'../static/images/profile_photos/' + post.user_photo"/>
                    <div class="poster" v-on:click="goToProfile(post.user_id)"> {{ post.user_name }} </div>                        
                </div>
                <img class="post-image img-responsive img" v-bind:src="'../static/images/posts/' + post.photo" width="450" height="450"/>
                <div class='post-caption'>{{ post.caption }}</div>
                <div class="post-footer">
                    <div class="like-details footer-left">
                        <i v-if="post.user_liked === true" class="fa fa-heart"></i>
                        <i v-if="post.user_liked === false" class="fa fa-heart-o" v-on:click="registerLike(post.id, index)"></i>
                        {{ post.likes }}
                        <p class="like-text" v-if="(post.likes === 0) && (post.likes > 1)">Likes</p>
                        <p class="like-text" v-if="(post.likes === 1)">Like</p>
                    </div>
                    <div class="alert alert-info" v-if="(attemptLike === post.id) && (message !== '')"> {{ message }}</div>
                    <div class="footer-right">{{ post.created_on }}</div>
                </div>

            </div>                
        </div>
        <div class="sidebar">
             <button type="submit" class="btn btn-primary new-post-btn" v-on:click="createPost">New Post</button>   
        </div>
    </div>
   `,
    data: function () {
        return {
            posts : [],
            showPosts: 'hide',
            message: '',
            attemptLike: ''
        }
    },
    created: function() {
        let self = this;
        self.posts = self.getPosts();
    },
    methods: {
        getPosts: function() {
            let self = this;

            let userToken = self.getUserToken();
            let csrfToken = '';

            try{
                csrfToken = token;
            } catch {
                router.push('/login');
            }

            if (userToken === csrfToken) {
                router.push('/login');
            } else {
                fetch("/api/posts", {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': 'Bearer ' + userToken
                    }
                })
                .then(function(response) {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        console.log(response.statusText);
                    }
                })
                .then(function(jResponse) {
                    self.posts = jResponse.posts;
                    console.log(self.posts);
                    self.showPosts =  self.posts !== []? 'show' : 'hide';
                    self.posts.forEach(element => {
                        console.log(element.user_photo);
                    });
                })
                .catch(function(err) {
                    console.log(err);
                })
            }
        },
        getUserToken: function() {
            let uToken = localStorage.getItem('token') || token;
            return uToken;
        },
        createPost: function() {
            router.push('/posts/new');
        },
        registerLike: function(postId, postIndex) {
            let self = this;
            self.attemptLike = postId;

            let userToken = this.getUserToken();
            let csrfToken = token;

            if (userToken === csrfToken) {
                router.push('/login');
            } else {
                fetch("/api/posts/" + postId + "/like", {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': "Bearer " + userToken
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jResponse) {
                    if (jResponse.hasOwnProperty("message")) {
                        self.posts[postIndex].likes = jResponse.likes;
                        self.posts[postIndex].user_liked = true;
                        self.attemptLike = '';
                        self.message = '';
                    }else {
                        this.message = jResponse.error;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
        },
        goToProfile: function(userId) {
            router.push('/users/' + userId)
        }
    }
});

const CreatePost = Vue.component('post', {
    template: `
        <div>
            <h1>New Post</h1>
            <div class="auth-form-container">
                <div class="message-container">
                    <ul class="alert alert-danger" v-if="formValid === 'not_valid'" id="errors">
                        <li v-for="error in errors"> {{ error }} </li>
                        </ul>
                    </div>
                <form @submit.prevent="createPost" id="newPostForm" class="col-md-12" enctype="mulitpart/form-data">
                    <div class="form-group">
                        <label class="form-label" for="photoField">Photo</label>
                        <input type="file" id="photoField" name="photo"/>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="captionField">Caption</label>
                        <textarea class="form-control" placeholder="Tell us a little about this picture." id="captionField" rows="4" name="caption"></textarea>
                    </div>
                    <button type="submit" name="submit" class="btn btn-primary" id="loginBtn">Sumbit</button>
                </form>
            </div>
        </div>
    `,
    data: function () {
        return {
            errors: [],
            formValid: false
        }
    },
    methods: {
        getUserToken: function() {
            let uToken = localStorage.getItem('token') || token;
            return uToken;
        },
        createPost: function() {
            let userToken = this.getUserToken();
            let csrfToken = '';
            try{
                csrfToken = token;
            } catch {
                router.push('/login');
            }

            if (userToken === csrfToken) {
                router.push('/login');
            } else {

                let self = this;
                let userId = localStorage.getItem("userId");
                let postForm = document.getElementById('newPostForm');
                let uformdata = new FormData(postForm);

                fetch("/api/users/" + userId + "/posts", {
                    method: 'POST',
                    body: uformdata,
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': 'Bearer ' + userToken
                    }
                })
                .then(function(response) {
                    if (response.status === 201) {
                        router.push('/explore')
                    } else {
                        return response.json(); 
                    }
                })
                .then(function(jResponse) {
                    self.errors = jResponse.error;
                    self.formValid = 'not_valid';
                })
                .catch(function(err) {
                    console.log(err);
                })
            }
        }        
    }
});

const UserProfile = Vue.component('user-profile', {
    template: `
    <div class="full-page-container">
        <div class="profile-head-cotainer">
            <img src="'../static/images/profile_photos/' + userDetails.photo" alt='Profile Photo' style="width:100px; height:100px;"/> 
            <div class="profile-details-container">
                <div class="title"> {{ userDetails.firstname }} {{ userDetails.lastname }} </div>
                <div class="location"> {{ userDetails.location }} </div>
                <div class="member-details">Member since {{ userDetails.joined_on }} </div>
                <div class="biography-details"> {{ userDetails.biograhy }} </div>
            </div>
            <div class="engagement-container">
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value"> {{ postCount }} </div>
                        <div class="stat-label">Posts</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value"> {{ followers }} </div>
                        <div class="stat-label">Followers</div>
                    </div>
                </div>
                <button type="submit" class="btn btn-success follow-btn" v-if="(!myProfile) && user_follow">Following</button>
                <button type="submit" class="btn btn-primary follow-btn" v-if="(!myProfile) && (!user_follow)">Follow</button>
            </div>
        </div>
        <div class="posts-container col-md-3">
            <div v-if="posts === []" class="no-posts">This user hasn't posted anything yet.</div>
            <div class="post card" v-for="(post,index) in posts">
                <div class="post-header">
                    <img height="30" width="30" v-bind:src="'../static/images/profile_photos/' + post.user_photo"/>
                    <div class="poster"> {{ post.user_name }} </div>                        
                </div>
                <img class="post-image img-responsive img" v-bind:src="'../static/images/posts/' + post.photo" width="450" height="450"/>
                <div class='post-caption'>{{ post.caption }}</div>
                <div class="post-footer">
                    <div class="like-details footer-left">
                        <i v-if="post.user_liked === true" class="fa fa-heart"></i>
                        <i v-if="post.user_liked === false" class="fa fa-heart-o" v-on:click="registerLike(post.id, index)"></i>
                        {{ post.likes }}
                        <p class="like-text" v-if="(post.likes === 0) && (post.likes > 1)">Likes</p>
                        <p class="like-text" v-if="(post.likes === 1) ">Like</p>
                    </div>
                    <div class="alert alert-info" v-if="(attemptLike === post.id) && (message !== '')"> {{ message }}</div>
                    <div class="footer-right">{{ post.created_on }}</div>
                </div>

            </div>                
        </div>
        </div>
    `,
    data: function() {
        return {
            posts: [],
            message: '',
            userDetails: {},
            attemptLike: '',
            myProfile: false,
            followers: 0,
            postCount: 0,
            user_follow: true
        }
    },
    created: function() {
        let uId = this.$route.params.user_id;
        this.getProfilePosts(uId);
        this.getUserDetails(uId);
        this.getFollowerCount(uId);
    },
    methods: {
        getProfilePosts: function(userId) {
            let self = this;
            
            let userToken = this.getUserToken();
            let csrfToken = token;

            if (userToken === csrfToken) {
                router.push('/login');
            } else {
                fetch("/api/users/" + userId + "/posts", {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': 'Bearer ' + userToken
                    }
                })
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log(response.status, response.statusText);
                    } else {
                        return response.json();
                    }
                })
                .then(function(jResponse) {
                    self.posts = jResponse.posts;
                    console.log(self.posts);
                    self.postCount = self.posts.length;
                })
                .catch(function(error) {
                    console.log(err);
                })
            }
        },
        getUserDetails:  function(userId) {
            let self = this;
            
            let userToken = this.getUserToken();
            let csrfToken = token;
            let localUId = localStorage.getItem("userId");

            if (localUId === userId) {
                self.myProfile = true;
            }


            if (userToken === csrfToken) {
                router.push('/login');
            } else {
                fetch("/api/users/" + userId , {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': 'Bearer ' + userToken
                    }
                })
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log(response.status, response.statusText);
                    } else {
                        return response.json();
                    }
                })
                .then(function(jResponse) {
                    self.userDetails = jResponse.userDetail;
                })
                .catch(function(error) {
                    console.log(err);
                })
            }
        },
        getFollowerCount:  function(userId) {
            let self = this;
            
            let userToken = this.getUserToken();
            let csrfToken = token;

            if (userToken === csrfToken) {
                router.push('/login');
            } else {
                fetch("/api/users/" + userId + "/follow" , {
                    method: 'GET',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': 'Bearer ' + userToken
                    }
                })
                .then(function(response) {
                    if (response.status !== 200) {
                        console.log(response.status, response.statusText);
                    } else {
                        return response.json();
                    }
                })
                .then(function(jResponse) {
                    self.followers = jResponse.followers;
                })
                .catch(function(error) {
                    console.log(err);
                })
            }
        },
        registerLike: function(postId, postIndex) {
            let self = this;
            self.attemptLike = postId;

            let userToken = this.getUserToken();
            let csrfToken = token;

            if (userToken === csrfToken) {
                router.push('/login');
            } else {
                fetch("/api/posts/" + postId + "/like", {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Authorization': "Bearer " + userToken
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jResponse) {
                    if (jResponse.hasOwnProperty("message")) {
                        self.posts[postIndex].likes = jResponse.likes;
                        self.posts[postIndex].user_liked = true;
                        self.attemptLike = '';
                        self.message = '';
                    }else {
                        this.message = jResponse.error;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
        },
        getUserToken: function() {
            let uToken = localStorage.getItem('token') || token;
            return uToken;
        },
    }
});


// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", component: Home},
        { path: "/register", component: Register },
        { path: "/login", component: Login },
        { path: "/logout", component: Home },
        { path: "/explore", component: Feed },
        { path: "/users/:user_id", component: UserProfile },
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