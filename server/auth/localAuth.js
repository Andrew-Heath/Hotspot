import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
//---------------------------Local Strategy-------------------------------------
export default function(User) {
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    console.log('sign them up!');
    process.nextTick(function() {
      if (!req.user) {
        User.findOrCreate({
          username: username,
          password: password
        })
        .then((user) => done(null, user[0]))
        .catch((err) => done(err));
      } else {
        //user exists and is logged in
        done(null, false);
      }
    });
  }));
  //---------------------------local login----------------------------------------
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    return User.find({username: username})
      .then((user) => {
        console.log('checking username and password');
        if (user.length === 0) {
          return done(null, false);
        }
        return [User.isValidPassword(password, user[0].id), user];
      })
      .then(([match, user]) => {
        if (match) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => done(err));
  }));
}