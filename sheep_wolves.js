const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth-routes');
const accountRoutes = require('./routes/account-routes');
const gameRoutes = require('./routes/game-routes');
const apiRoutes = require('./routes/api-routes');
const authCheck = require('./middlware/auth-middleware');
const { csecret }  = require('./config');

const PORT = process.env.port || 5000;
const URL = require('./congif').db_url;


mongoose
.connect(URL)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(`DB connection error: ${err}`))

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const { create } = require('express-handlebars');
const hbs = create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        section: function (name, option) {
            if (!this._section) this._section = {};
            this._section[name] = option.fn(this);
            return null;
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(cors({origin: true, credentials: true}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(csecret));

app.use(authRoutes);
app.use(authCheck);
app.use(accountRoutes);
app.use(gameRoutes);
app.use(apiRoutes);


app.use((req, res) => {
    res.render('error', {message: '404 - Этой страницы не существует'});
});

app.use((err, req, res, next) => {
    res.render('error', {message: err});
});

io.on('connection', (socket) => {
    let room;
    socket.on('room', (gid, name) => {
        room = gid;
        socket.join(room);
        socket.to(room).emit('name', name)
    })
    socket.on('roles', (sn, wn) => {
        socket.to(room).emit('roles', sn, wn);
    })
    socket.on('move', (cell, lcell) => {
        socket.to(room).emit('move', cell, lcell);
    })
    socket.on('disconnect', () => {
        socket.to(room).emit('gone');
    })
})

server.listen(PORT, (err) => {
    err ? console.log(err) : console.log(`Приложение запущено на http://localhost:${PORT}/home;`)
});
