"use strict";

const ElementSelector = (name, type) => {
    switch (type) {
        case 'class': return document.getElementsByClassName(name);
        case 'id': return document.getElementById(name);
        case 'tag': return document.getElementsByTagName(name);
        default: null;
    }
};

const RandomGenerator = (limit) => {
    return Math.round(Math.random() * limit);
};

const ball = ElementSelector('ball', 'id');
const start = document.getElementById('start_screen');

ball.style.display = 'none';

const body_positons = document.body.getBoundingClientRect();
let isGameStart = false;
let isMoving = false;

const pillers_info = [];
let calculate = 12;

for(let i = 0; i < (100 - 20) / calculate; i++){
    let height = RandomGenerator(body_positons.height - 100)
    pillers_info.push(
        {
            isUp : i % 2 === 0 ? false : true,
            height : height <= 50 ? height + 100 : height,
            width : 50,
        }
    );
}


const arrows = {
    left: false,
    right: false,
    top: false,
    bottom: false,
};

const arrowsTrue = (type, boolVal) => {
    if (type == 'ArrowUp') {
        arrows.top = boolVal
    } else if (type == 'ArrowDown') {
        arrows.bottom = boolVal
    } else if (type == 'ArrowLeft') {
        arrows.left = boolVal
    } else if (type == 'ArrowRight') {
        arrows.right = boolVal
    } else {
        arrows.top = false;
        arrows.bottom = false;
        arrows.left = false;
        arrows.right = false;
    }
};



const StartGame = () => {
    isGameStart = true;
    let increment = 1;
    pillers_info.forEach((e,index) => {
        let div = document.createElement('div');
        div.style.backgroundColor = 'blue';
        div.style.position = 'absolute';
        div.id = `pillter_${index}`;
        div.style.width = `${e.width}px`;
        div.style.height = `${e.height}px`;
        div.style.left = `${(calculate * increment) + 15}%`;
        e.isUp ? div.style.top = '0%' : div.style.bottom = '0%';
        document.body.appendChild(div);
        increment++;
    });
    pillers_running();
    document.body.classList.remove('bodyFlexing');
    document.body.classList.add('apply_after_start');
    ball.classList.add('ball');
    ball.classList.add('ballanimate');
    setTimeout(() => {
        ball.classList.remove('ballanimate');
        ball.classList.add('ball_left');
        isMoving = true;
    },1500);
    start.style.display = 'none'
    ball.style.display = 'block';
};

const MoveBall = (e) => {
    e.preventDefault();
    arrowsTrue(e?.key, true);
}

const StopMoveBall = (e) => {
    e.preventDefault();
    arrowsTrue(e?.key, false);
}

document.body.addEventListener('keydown', MoveBall);
document.body.addEventListener('keyup', StopMoveBall);

let speed = 10;

const positions = {
    x: 0,
    y: 0,
};

const piller_speed = 2;

const pillers_running = () => {
    let speed = 3;
    let selected_pillers = [];
    if(isGameStart){
        for(let i = 0; i < pillers_info.length; i++){
            selected_pillers.push(document.getElementById(`pillter_${i}`));
        }
        selected_pillers.forEach((p,index) => {
            let p_info = p.getBoundingClientRect();
            let letf_pos = p_info.left;
            letf_pos -= speed;
            if(p.style.left.includes('-')){
                p.style.left = `100%`;
            }else{
                p.style.left = `${letf_pos}px`;
            }
        });
    }
    requestAnimationFrame(pillers_running);
};

const AnimateBall = () => {
    if (isGameStart) {
        if(isMoving){
            if (arrows.top) {
                if (positions.y >= body_positons.height - 50) {
                    positions.y = positions.y;
                } else {
                    positions.y += speed;
                }
                ball.style.bottom = `${positions.y}px`
            } else if (arrows.bottom) {
                if (positions.y <= 0) {
                    positions.y = 0 + 10;
                } else {
                    positions.y -= speed;
                }
                positions.y -= speed;
                ball.style.bottom = `${positions.y}px`
            } else if (arrows.left) {
                if (positions.x <= 0) {
                    positions.x = 0 + 10;
                } else {
                    positions.x -= speed;
                }
                positions.x -= speed;
                ball.style.left = `${positions.x}px`
            } else if (arrows.right) {
                if (positions.x >= body_positons.width - 60) {
                    positions.x = positions.x;
                } else {
                    positions.x += speed;
                }
                ball.style.left = `${positions.x}px`
            }
        }
    }
    window.requestAnimationFrame(AnimateBall);
};

AnimateBall();
