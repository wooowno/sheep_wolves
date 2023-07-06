const border = '7px dashed rgb(98, 148, 96)';

// BOARD

const board = document.querySelector('table');
for (let i = 1; i < 9; i++) {
    let tr = document.createElement('tr');
    for (let j = 1; j < 9; j++) {
        let td = document.createElement('td');
        if ((i + j) % 2 == 0) {
            td.style.backgroundColor = 'var(--LIGHT-COLOR)';
        } else {
            td.style.backgroundColor = 'var(--DARK-COLOR)';
            td.classList.add('black');
            td.id = `p${i}_${j}`;
        }
        tr.appendChild(td);
    }
    board.appendChild(tr);
}

// SOCKET

const socket = io();
const params = new URLSearchParams(document.location.search)
const gid = params.get('id');

const user = document.cookie.split('; name=')[1]

socket.emit('room', gid, user);

const msg = document.querySelector('#message');
msg.innerText = 'Ожидайте соперника';

let sn = document.querySelector('#sn');
let wn = document.querySelector('#wn');

socket.on('name', (name) => {
    let role = ['sheep', 'wolf'];
    role = role[Math.floor(Math.random() * role.length)];
    if (role == 'sheep') {
        sn.innerText = user;
        wn.innerText = name;
        sn = user;
        wn = name;
    } else {
        wn.innerText = user;
        sn.innerText = name;
        wn = user;
        sn = name;
    }
    msg.innerText = '';
    start();
    socket.emit('roles', sn, wn);
})

socket.on('roles', (shn, wfn) => {
    msg.innerText = '';
    sn.innerText = shn;
    sn = shn;
    wn.innerText = wfn;
    wn = wfn;
    start();
})

socket.on('gone', () => {
    msg.innerText = 'Соперник покинул игру';
    end();
})

let turn;
let lcell;
let game = false;

document.querySelectorAll('.black').forEach(cell => {
    cell.addEventListener('click', () => {
        if (myTurn()) {
            if (cell.innerText == 'Wolf' && wn == user) {
                black();
                colorPath(cell);
            }
            if (cell.style.border == border) {
                socket.emit('move', cell.id, lcell.id);
                move(cell, lcell);
            } 
        }
    });
})

setInterval(() => {
    if (game && sheepWon()) {
        round('sc', sn)
    }

    if (game && wolvesWon()) {
        round('wc', wn)
    }
}, "500");

function round(id, name) {
    game = false
    msg.innerText = `Этот раунд за ${name}`;
    if (count(id) == '3') {
        msg.innerText = `Победа ${name}`;
        end();
        if (name == user) {
            fetch('http://localhost:5000/api/win', {method: 'PUT'});
        } else {
            fetch('http://localhost:5000/api/loss', {method: 'PUT'});
        }
    } else {
        setTimeout(() => {msg.innerText = '';}, 5000);
        let a = sn;
        sn = wn;
        wn = a;
        a = document.querySelector('#sc').innerText;
        document.querySelector('#sc').innerText = document.querySelector('#wc').innerText;
        document.querySelector('#wc').innerText = a;
        document.querySelector('#sn').innerText = sn;
        document.querySelector('#wn').innerText = wn;

        start();
    }
} 

function count(id) {
    let c = document.querySelector(`#${id}`);
    c.innerText = parseInt(c.innerText) + 1 ;
    return c.innerText; 
}

function wolvesWon() {
    const scell = document.querySelector('img#sheep').parentElement;
    if (path(scell).length == 0) return true;
    return false;
}

function sheepWon() {
    const scell = document.querySelector('img#sheep').parentElement;
    const scid = Array.from(scell.id);
    const si = parseInt(scid[1]);
    let res = 1;
    document.querySelectorAll('img#wolf').forEach(w => {
        const wcell = w.parentElement;
        const wcid = Array.from(wcell.id);
        const wi = parseInt(wcid[1]);
        if (wi < si) {
            res = 0;
        }
    })
    return Boolean(res);
}

function start() {
    game = true;
    turn = 'sheep';
    black();
    document.querySelectorAll(".black").forEach(cell => {
        cell.innerHTML = '';
    })
    for (let id of ['p1_2', 'p1_4', 'p1_6', 'p1_8']) {
        document.querySelector(`#${id}`).innerHTML = 'Wolf <img id="wolf" src="/img/wolf.png">';
    }
    document.querySelector(`#p8_5`).innerHTML = 'Sheep <img id="sheep" src="/img/sheep.png">';
    chg_turn();
}

function end() {
    black();
    game = false;
    document.querySelectorAll(".black").forEach(cell => {
        cell.innerHTML = '';
    })
}

function black() {
    document.querySelectorAll(".black").forEach(cell => {
        cell.style.border = 'none';
    })
}

socket.on('move', (cell, lcell) => {
    const go = document.querySelector(`#${cell}`);
    const leave = document.querySelector(`#${lcell}`);
    move(go, leave);
})

function move(go, leave) {
    black();
    go.innerHTML = leave.innerHTML;
    leave.innerHTML = '';
    if (turn == 'sheep') {
        turn = 'wolf';
    } else {
        turn = 'sheep';
    }
    chg_turn();
}

function myTurn() {
    const tr_n = document.querySelector('#name').innerText;
    return tr_n == user
}

function chg_turn() {
    const tr_n = document.querySelector('#name');
    if (turn == 'sheep') {
        tr_n.innerText = sn;
        const sheep = document.querySelector('img#sheep').parentElement;
        colorPath(sheep);
    }
    else {
        tr_n.innerText = wn;
        document.querySelectorAll('img#wolf').forEach(wolf => {
            wolf.parentElement.style.border = '7px solid #629460';
        })
    }
}

function colorPath(cell) {
    path(cell).forEach(av => {
        av.style.border = '7px dashed #629460';
    })
    lcell = cell;
}

function path(cell) {
    let res = [];
    const cid = Array.from(cell.id);
    const av1 = findEl(cid, 1, 1),
          av2 = findEl(cid, 1, -1);
    if (checkPath(av1)) res[res.length] = av1;
    if (checkPath(av2)) res[res.length] = av2;

    if (cell.innerText == 'Wolf') return res;

    const av3 = findEl(cid, -1, 1),
          av4 = findEl(cid, -1, -1);
    if (checkPath(av3)) res[res.length] = av3;
    if (checkPath(av4)) res[res.length] = av4;
    return res;    
}

function findEl(cid, i, j) {
    let el = `p${parseInt(cid[1]) + i}_${parseInt(cid[3]) + j}`;
    el = document.getElementById(el);
    return el;
}


function checkPath(av) {
    if (!av) return false;
    if (av.innerText != '') return false;
    return true;
}
