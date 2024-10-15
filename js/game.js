"use strict";//厳格モード


class Ship {
  // 自機クラス
  constructor() {
    this.img = document.querySelector("#ship");
    this.x = 200;
    this.y = 500;
    this.sx = 0;
    this.sy = 0;
  }
  move(mouseX, mouseY) {
    this.sx = (mouseX - this.x) / 10; // マウスx方向へ移動
    this.sy = (mouseY - this.y) / 10; // マウスy方向へ移動
  }
  tick() {
    this.x += this.sx; // 速度sxを座標xに反映
    this.y += this.sy; // 速度syを座標yに反映
    ctx.drawImage(this.img, this.x - 50, this.y - 50);
  }
  shoot() {
    bullets.push(new Bullet(this.x, this.y, 0, -25, true)); // 弾発射
    console.log(bullets);
  }
}


class Bullet {
  // 弾丸クラス
  constructor(x, y, sx, sy, isShip) {
    this.x = x;
    this.y = y;
    this.sx = sx;
    this.sy = sy;
    this.isShip = isShip; // 自機か否か
  }
  tick() {
    this.x += this.sx;
    this.y += this.sy;
    drawCircle(this.x, this.y, 10, "#Fff");
  }
}

// (x,y)を中心に半径r、色coloroの円を描画
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

const ele = document.querySelector('#scoresubmit');//スコア表示
ele.style.display = 'none';//非表示
const startb = document.querySelector('#gameplay');
const destruction = new Audio('bgm/destruction.mp3');//音読み込み
const bgm = new Audio('bgm/space.mp3');//音読み込み
bgm.loop = true;

let ctx; // 描画コンテキスト
let ship; // 自機
let back; // 背景画像
let interval = 50; // 出現頻度
let timerId;  // タイマー
let bullets = []; // 弾丸のリスト

function gamestart() {
  startb.style.display = 'none';//スタートボタン非表示
  document.body.classList.add('hideCursor');
  ctx = document.querySelector("#field").getContext("2d");
  ctx.font = "30px 'Times New Roman'";
  ship = new Ship();  // 自機オブジェクト作成
  back = document.querySelector("#back");
  //　pointermove ( onpointermove )イベントは、ポインターに座標の変化があると発生するイベントです。 このイベントを設定したエレメントの領域内が対象です　mousemove イベントや touchmove イベントはこのイベントで代替えできます。
  window.onpointermove = (e) => {
   // ship.move(e.clientX, e.clientY);  // マウス移動⇒自機を移動
   ship.move(e.clientX, e.clientY); 
  };
  window.onpointerdown = (e) => {
   // ship.shoot(); // マウス押下⇒弾丸発射
   ship.shoot();
  };
  timerId = setInterval(tick, 50);  // タイマー開始
  for (let i = 0; i < 50; i++) {
    stars.push(new Star()); // 星を作成してリストに追加
  }
};

function tick() {
  ctx.fillRect(0, 0, 620, 650);
  ctx.drawImage(back, 0, 0);
  ship.tick();
 
  bullets.forEach((b) => {
    b.tick(); // 弾丸移動
    if (!b.isShip && dist(b, ship) < 30) {
      gameOver = true;  // 弾丸との距離が30未満⇒ゲームオーバー
    }
  });

  ctx.fillStyle = "#fff";
  ctx.fillText("SCORE:" + score, 450, 50);

}



document.querySelector('#gameplay').addEventListener('click', () => {

    bgm.play();
    gamestart();
  
});

