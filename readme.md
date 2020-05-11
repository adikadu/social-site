This is a MERN stack application, it is a small social network app that includes authentication, profiles and forum posts.<br>
Deployed website <a href="https://lit-crag-85547.herokuapp.com/">Link</a><br><br>
The user will have to first register.<br>
After registration:-<br>
    -> The user can create his/her own profile.<br>
    -> View other user's profiles.<br>
    -> After giving `github username` 5 recent repos of user will be visible on user's profile page and<hr>also github profile picture will also be extracted.<br>
    -> The user will be able to `view all the posts` on site, `comment on posts`, `like unlike posts`, `Delete his/her own        posts` and much more.<br><br>

How to start the app:-
    -> Add this to `defalut.json` file in `config` folder:-<br>
    {
        "mongoURI": "<your_mongoDB_Atlas_uri_with_credentials>",
        "jwtSecret": "secret",
        "githubToken": "<yoursecrectaccesstoken>"
    }<br>
    -> Go to the app's root folder from terminal.<br>
    -> Run `npm install` to install server dependencies.<br>
    -> Go to the client folder from terminal.<br>
    -> Run `npm install` to install client dependencies.<br>
    -> Run both Express & React from from app's root folder.<br>
    -> `npm run dev`.<br><br>
Acknowledgement:- <a href="https://www.udemy.com/course/mern-stack-front-to-back/">Link</a>

