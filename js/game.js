"use strict";//厳格モード
class Star {
  // 星クラス
  constructor() {
    this.x = Math.random() * 620; // x座標
    this.y = Math.random() * 650; // y座標
    this.r = Math.random() * 5 + 1; // 半径
  }
  tick() {
    this.y += this.r; // 下に移動
    if (this.y > 650) {
      // 画面下部にきたら上へ移動
      this.y -= 650;
    }
    drawCircle(this.x, this.y, this.r, "#879AB1");// 流れる星
  }
}

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

class Enemy {
  // 敵クラス
  constructor() {
    this.img = document.querySelector("#enemy");
    this.x = Math.random() * 400 + 100; // x座標
    this.y = 0; // y座標
    this.sx = Math.random() * 5 - 2.5; // x方向初速
    this.sy = Math.random() * 15 + 15; // y方向初速
    this.shoot = false;
  }
  tick() {
    this.sy -= 1; // 速度を減らす
    this.x += this.sx; // 速度sxを座標xに反映
    this.y += this.sy; // 速度syを座標yに反映
    ctx.drawImage(this.img, this.x - 50, this.y - 50);

    if (this.shoot == false && this.sy < 0) {
      // 速度が上向きになったタイミングで弾丸発射
      let theta = Math.atan2(ship.y - this.y, ship.x - this.x);
      let sx = Math.cos(theta) * 10;
      let sy = Math.sin(theta) * 10;
      bullets.push(new Bullet(this.x, this.y, sx, sy, false));
      this.shoot = true;
    }
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
    drawCircle(this.x, this.y, 10, this.isShip ? "#25AFA2" : "#F9D791");
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
const destruction_enemy = new Audio('bgm/destruction_enemy.mp3');//音読み込み
destruction_enemy.preload = 'auto';//連続でSE音を鳴らす
const bgm = new Audio('bgm/space.mp3');//音読み込み
bgm.loop = true;
let isPlaying = false;


let ctx; // 描画コンテキスト
let ship; // 自機
let back; // 背景画像
let count = 0;  // 敵出現用カウンタ
let interval = 50; // 出現頻度
let timerId;  // タイマー
let bullets = []; // 弾丸のリスト
let enemies = []; // 敵のリスト
const stars = []; // 星のリスト
let score = 0; // スコア
let scorec = 0; // スコア
let gameOver = false;


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
  count++;
  ctx.fillRect(0, 0, 620, 650);
  ctx.drawImage(back, 0, 0);
  stars.forEach((s) => s.tick()); // 星の移動
  ship.tick();
  if (count % interval == 0) {
    enemies.push(new Enemy());  // intervalフレーム毎に敵を作成
    interval = Math.max(5, interval - 5);
  }
  enemies.forEach((e) => {
    e.tick(); // 敵を移動
    if (dist(e, ship) < 100) {
      gameOver = true;  // 敵との距離が100未満⇒ゲームオーバー
    }
  });
  bullets.forEach((b) => {
    b.tick(); // 弾丸移動
    if (!b.isShip && dist(b, ship) < 30) {
      gameOver = true;  // 弾丸との距離が30未満⇒ゲームオーバー
    }
  });
  let prevNum = enemies.length;
  enemies = enemies.filter((e) => {
    return !bullets.some((b) => {
      return b.isShip && dist(e, b) < 50; // 弾丸と敵の衝突判定
    });
  });

  score += prevNum - enemies.length;
  if (score > scorec) {
    scorec = score;
    destruction_enemy.load();//連続音
    destruction_enemy.play();//破壊
  }

  ctx.fillStyle = "#fff";
  ctx.fillText("SCORE:" + score, 450, 50);
  document.querySelector("#scorebox").value = score;//非表示のformボックスにscoreを代入

  if (gameOver) {
    clearInterval(timerId);
    destruction.play();//破壊音
    bgm.pause();//BGM音を止める
    ele.style.display = 'block';//表示
    document.body.classList.remove('hideCursor');
  }
}

// 2つのオブジェクト間の距離を求める
function dist(e0, e1) {
  return Math.sqrt(
    Math.abs(e0.x - e1.x) ** 2 + Math.abs(e0.y - e1.y) ** 2
  );
}

document.querySelector('#gameplay').addEventListener('click', () => {
  if (isPlaying) {
    bgm.pause();
    isPlaying = false;
  } else {
    bgm.play();
    isPlaying = true;
    gamestart();
  }
});

document.querySelector('#cheat').addEventListener('click', () => {
    if (isPlaying) {
      bgm.pause();
      isPlaying = false;
    } else {
      bgm.play();
      isPlaying = true;
      gamestart();
    }
  });