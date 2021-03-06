let app;

let Server = function(node_app) {
    app = node_app;
}

let Initialize = function(network, crypto) {
    let flash             = require('connect-flash');
    let passport          = require('passport');
    let LocalStrategy     = require('passport-local').Strategy;
    
    // PASSPORT
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
        } , function (req, username, password, done) {
            let salt = process.env.PASSPORT_SALT;
            
            let school = req.body.school;
            
            network.query("SELECT * FROM tbl_students WHERE Nickname = ? AND School_ID = ?", [username, school], function(err, rows) {
                if (err != null) console.log(err);
                if (err) return done(err);
                
                if (typeof rows === "undefined") {
                    return done(null, false);
                }

                if (!rows.length) {
                    return done(null, false);
                }
                
                salt = salt + '' + password;

                let encPassword = crypto.createHash('sha256').update(salt).digest('hex');
                let dbPassword  = rows[0].Password;

                if(!(dbPassword == encPassword)) {
                    return done(null, false);
                }

                network.query("UPDATE tbl_students SET Online = ? WHERE ID = ?", [1, rows[0].ID]);
                done(null, rows[0]);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.ID);
    });

    passport.deserializeUser(function(ID, done) {
        network.query("SELECT * FROM tbl_students WHERE ID = ?", [ID], function (err, rows) {
            done(err, rows[0]);
        });
    });

    return {
        passport
    };
}

module.exports.Server = Server;
module.exports.Initialize = Initialize;