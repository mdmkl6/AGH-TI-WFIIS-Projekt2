const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const cookieparser = require('cookie-parser')
const bodyParser = require('body-parser')


let Quest = require('./models/quest');
let User = require('./models/user');

const app = express();
const Port = 10007;
const secret = 'to jest bardzo tajny kod';



app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug')


mongoose.connect('mongodb+srv://9domin:pass9domin@cluster0.tmqtc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));


app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(express.json({
  type: "*/*"
}))
app.use(cookieparser());
app.use(express.static(__dirname + '/public'));

app.get('/register', (req, res) => {
  res.render('register',
    {
      title: 'Rejestracja:'
    });
})

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.pass, 10).then((hash) => {
    let user = new User;
    user.name = req.body.name;
    user.pass = hash;
    user.save(function (err) {
      if (err) { res.send("Urzytkonik już istnieje") }
      else { res.redirect('/login'); }
    })
  });
});

app.get('/login', (req, res) => {
  res.render('login',
    {
      title: 'Logowanie:'
    });
})
app.post('/login', (req, res) => {
  let name = req.body.name;
  let pass = req.body.pass;

  User.findOne({ name: name }, function (err, user) {
    if (err) { console.error(err); }
    else {
      if (user) {
        bcrypt.compare(pass, user.pass).then(match => {
          if (match) {
            const accessToken = jwt.sign({ id: 1 }, secret, { expiresIn: 1200 });
            res.cookie('JWT', accessToken, { maxAge: 86400000, httpOnly: true });
            res.render('loged');
          }
          else {
            res.render('login',
              {
                title: 'Logowanie:',
                out: 'Błędne hasło'
              });
          }
        })

      } else {
        res.render('login',
          {
            title: 'Logowanie:',
            out: 'Nie znaleziono urzytkownia'
          });
      }
    }
  });
})

app.get('/logout', authenticate, (req, res) => {
  res.clearCookie('JWT', { httpOnly: true, path: '/', domain: 'localhost' });
  res.send("Wylogowano<br><a href='/'>Powrót do strony głównej<a>");
})

function authenticate(req, res, next) {
  const token = req.cookies.JWT

  if (token === null) return res.sendStatus(401)

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.send("Musisz się nsjapier zalogować");

    req.user = user
    next()
  })
}

app.get('/', function (req, res) {
  res.render('ankieta',
      {
        title: 'Aniketa'
      });
})

app.get('/info', function (req, res) {
  res.render('info',
      {
        title: 'Opis projektu'
      });
})

app.post('/ankieta', authenticate, function (req, res) {
  let quest = new Quest();
  quest.ilosc = req.body.ilosc;
  quest.marka = req.body.marka;
  quest.cena = req.body.cena;
  quest.male = req.body.male;
  quest.wiek = req.body.wiek;

  quest.save(function (err) {
    if (err) { console.error(err); }
    else { res.redirect('/'); }
  })
})

app.get('/wykresy', authenticate, function (req, res) {
  data1l = ['0', '1', '2', '3', '4'];
  data2l = ['Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Poco', 'Realme', 'Motorola', 'Sony', 'HTC', 'LG', 'Oneplus', 'Huawei', 'Inne', 'Apple'];
  data3l = ['500', '1000', '1500', '2000', '3000', '5000'];
  data4l = ['fmale', 'male'];
  data5l = [0, 10, 15, 20, 30, 50, 10000000];
  data1 = [];
  data2 = [];
  data3 = [];
  data4 = [];
  data5 = [];
  data1n(0);
  function data1n(i) {
    Quest.count({ ilosc: data1l[i] }).then(function (val) {
      data1.push(val);
      if (i < data1l.length) {
        data1n(i + 1);
      }
      else {
        data2n(0);
      }
    });
  }
  function data2n(i) {
    Quest.count({ marka: data2l[i] }).then(function (val) {
      data2.push(val);
      if (i < data2l.length) {
        data2n(i + 1);
      }
      else {
        data3n(0);
      }
    });
  }
  function data3n(i) {
    Quest.count({ cena: data3l[i] }).then(function (val) {
      data3.push(val);
      if (i < data3l.length) {
        data3n(i + 1);
      }
      else {
        data4n(0);
      }
    });
  }
  function data4n(i) {
    Quest.count({ male: data4l[i] }).then(function (val) {
      data4.push(val);
      if (i < data4l.length) {
        data4n(i + 1);
      }
      else {
        data5n(0);
      }
    });
  }
  function data5n(i) {
    Quest.count({ wiek: { $gte: data5l[i], $lte: data5l[i + 1] - 1 } }).then(function (val) {
      data5.push(val);
      if (i < data5l.length - 1) {
        data5n(i + 1);
      }
      else {
        res.render('wykresy',
          {
            title: 'Wykresy',
            data1: JSON.stringify(data1),
            data2: JSON.stringify(data2),
            data3: JSON.stringify(data3),
            data4: JSON.stringify(data4),
            data5: JSON.stringify(data5)
          })
      }
    });
  }
})


// app.get('/', function (req, res) {
//   Quest.find({}, function (err, tab) {
//     if (err) {console.error(err);}
//     else {
//       res.render('index',
//         {
//           title: 'Hello2',
//           tab: tab
//         });
//     }
//   });
//   if(req.session)
//     console.log(1);
//   else
//     console.log(0);
// })


app.listen(Port, () => {
  console.log(`Server is running on port ${Port}.`);
});