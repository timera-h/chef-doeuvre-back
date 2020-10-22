const router = new require("express").Router();

// on utilise bcrypt pour encrypter les mdp
const bcrypt = require("bcrypt");
const UserModel = require("./../models/User");
// auth une librairie custom pour gérer les jetons d'authentification JWT
const auth = require("./../auth");

// uploader est un middleware, une fonction qui s'incère entre une requête http et une réponse http

router.get("/signout", (req, res) => {
    const x = req.session.destroy();
    res.json(x);
});

// voir l'user avec le token
router.get("/get-user-by-token", (req, res) => {
    try {
      const user = auth.decodeToken(req.header("x-authenticate"));
      const userId = user.infos._id;
      console.log("should be user", user);
      res.redirect("/api/users/" + userId);
    } catch (err) {
      res.status(500).json(err.message);
    }
  });

// connexion
router.post("/signin", async (req, res, next) => {
    // infos saisis dans le formulaire
    const userInfos = req.body;

    // vérifier si l'utilisateur à remplis les champs requis
    if(!userInfos.email || !userInfos.password) {
        // si non renvoyer une erreur
        res.status(401).json({
            msg: "Merci de remplir tous les champs requis",
            level: "error"
        });
    }
    // si oui vérifier que l'email et mdp correspondent e bdd 
    UserModel
        .findOne({ email: userInfos.email })
        .then((user) => {
            if(!user) {
                // si user trouver pour cet email vaut null
                // si non retourner une erreur
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error"
                });
            }
            // si oui comparer le mdp crypté stocké en bdd avec le mpd en clair depuis le formulaire
            const checkPassword = bcrypt.compareSync(
                userInfos.password, //mdp provenant du form
                user.password // mdp stocké en bdd
            ); //checkPassword vaut true ou false

            // si le mdp est false retourner une error
            if(checkPassword === false) {
                return res.status(401).json({
                    msg: "Identifiants incorrects",
                    level: "error"
                });
            }
            // si oui stoker les infos de l'utilisateur en session pour lui permettre de naviguer jusqu'au signout
            const {_doc: clone } = { ...user }; // on clone l'utilisateur
            delete clone.password; // par sécurité, on supprime le mdp du clone
            delete clone.passwordConfirme;
            delete clone.address;
            delete clone.lastName;
            delete clone.email;
            
            console.log(clone);
            req.session.currentUser = clone; // on inscrit le clone dans la session pour maintenir un etat de connexion

            const token = auth.createToken(clone, req.ip); // createToken retourne un jeton (token) créé avec JWT

            return res
                .header("user-authenticate", token) // on renvoie le token au client dans l'entête de la réponse pour l'authentification
                .status(200)
                .send({ user: clone, token, msg: "Connecter !", level: "success" });
        })
        .catch(next);
});

// mdp oublier
// router.post('/forgot', async (req, res, next) => {
//     waterfall([
//       function(done) {
//         crypto.randomBytes(20, function(err, buf) {
//           const token = buf.toString('hex');
//           done(err, token);
//         });
//       },
//       function(token, done) {
//         UserModel.findOne({ email: req.body.email }, function(err, user) {
//           if (!user) {
//           //   console.log('error', 'No account with that email address exists.');
//           req.flash('error', "Cet email n'existe pas.");
//             return res.redirect('/forgot');
//           }
//   console.log('step 1')
//           user.resetPasswordToken = token;
//           user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
//           user.save(function(err) {
//             done(err, token, user);
//           });
//         });
//       },
//       function(token, user, done) {
//           console.log('step 2')
  
  
//         const smtpTrans = nodemailer.createTransport({
//            service: 'Gmail', 
//            auth: {
//             user: 'myemail',
//             pass: 'mypassword'
//           }
//         });
//         var mailOptions = {
  
//           to: user.email,
//           from: 'myemail',
//           subject: 'Node.js Password Reset',
//           text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//             'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//             'If you did not request this, please ignore this email and your password will remain unchanged.\n'
  
//         };
//         console.log('step 3')
  
//           smtpTrans.sendMail(mailOptions, function(err) {
//           req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//           console.log('sent')
//           res.redirect('/forgot');
//   });
//   }
//     ], function(err) {
//       console.log('this err' + ' ' + err)
//       res.redirect('/');
//     });
//   });
  
//   app.get('/forgot', function(req, res) {
//     res.render('forgot', {
//       User: req.user
//     });
//   });

// inscription
router.post("/signup", async (req, res, next) => {
    // console.log(">>>>>>>>> user", req.body);
    // user = infos saisis dans le formulaire
    const user = req.body;
    // envoyer une erreur si l'user n'as pas saisis les champs requis
    if(!user.firstName || !user.lastName ||!user.email || !user.password || !user.passwordConfirme) {
        return res.status(422).json({
            msg: "Merci de remplir tous les champs requis",
            level: "warning"
        });
    }  // vérifier si l'email fournit n'existe pas dans la bdd 
    // si oui renvoyer une erreur
    else {
        try {
            const previousUser = await UserModel.findOne({ email: user.email });
            console.log(previousUser);
            if(previousUser) {
                return res.status(422).json({
                    msg: "Cet email existe déjà",
                    level: "warning"
                });
            }

            // on verifie si mdp est egale au mdp confirmer
            // si non renvoie une erreur
            if(user.password !== user.passwordConfirme){
                return res.status(422).json({
                    msg: "Merci de confirmer votre mot de passe",
                    level: "warning"
                })
            } 

            // si non 
            // convertir le mdp fournit par l'user en chaîne cryptée
            const salt = bcrypt.genSaltSync(10);
            const hashed = bcrypt.hashSync(user.password, salt);
            // on remplace le mdp en claire par sa valeur crypté
            user.passwordConfirme = hashed
            user.password = hashed
            
            
//       var smtpTrans = nodemailer.createTransport({
//         service: 'Gmail', 
//         auth: {
//          user: 'myemail',
//          pass: 'mypassword'
//        }
//      });
//      var mailOptions = {

//        to: user.email,
//        from: 'myemail',
//        subject: 'Node.js Password Reset',
//        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//          'If you did not request this, please ignore this email and your password will remain unchanged.\n'

//      };
//      console.log('step 3')

//        smtpTrans.sendMail(mailOptions, function(err) {
//        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//        console.log('sent')
//        res.redirect('/forgot');
// }), function(err) {
//    console.log('this err' + ' ' + err)
//    res.redirect('/');
// });

// app.get('/forgot', function(req, res) {
//  res.render('forgot', {
//    User: req.user
//  });

            // user.date = Date.now;
            user.birthDate = Date.moment().format("DD MM YYYY");

            // on insère le nouvel utilisateur en bdd 
            await UserModel.create(user);
            res.redirect("/signin");
            return res.status(200).json({
                msg: "Inscription validée !",
                level: "success"
            });
            
        } catch(error) {
            next(error);
        }
    }
    
})

module.exports = router;