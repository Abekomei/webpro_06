const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

// --- 既存の課題（Hello, Icon, Omikuji） ---

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  res.render( 'omikuji2', {result:luck} );
});

// --- じゃんけん（クエリパラメータ版） ---
app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});

  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';

  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗判定
  if (hand == cpu) {
    judgement = 'あいこ';
  } else if (
    (hand == 'グー' && cpu == 'チョキ') ||
    (hand == 'チョキ' && cpu == 'パー') ||
    (hand == 'パー' && cpu == 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
    total += 1;
  } else {
    judgement = '負け';
    total += 1;
  }

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

// --- じゃんけん（ラジオボタン版） ---
app.get("/janken-radio", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗判定
  if (hand == cpu) {
    judgement = 'あいこ';
  } else if (
    (hand == 'グー' && cpu == 'チョキ') ||
    (hand == 'チョキ' && cpu == 'パー') ||
    (hand == 'パー' && cpu == 'グー')
  ) {
    judgement = '勝ち';
    win += 1;
    total += 1;
  } else {
    judgement = '負け';
    total += 1;
  }

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  
  res.render( 'janken_radio', display );
});

// --- PDF課題：駅データの定義 ---
let station = [
    { id: 1, code: "JE01", name: "東京駅" },
    { id: 2, code: "JE07", name: "舞浜駅" },
    { id: 3, code: "JE12", name: "新習志野駅" },
    { id: 4, code: "JE13", name: "幕張豊砂駅" },
    { id: 5, code: "JE14", name: "海浜幕張駅" },
    { id: 6, code: "JE05", name: "新浦安駅" }
];

// --- PDF課題：駅一覧の表示 ---
app.get("/keiyo", (req, res) => {
    // db2.ejs (表形式) を使って表示
    res.render('db2', { data: station });
});

// --- PDF課題：駅データの追加 ---
app.get("/keiyo_add", (req, res) => {
    let id = req.query.id;
    let code = req.query.code;
    let name = req.query.name;

    let newdata = { id: id, code: code, name: name };
    station.push(newdata);

    // 追加後は入力画面に戻る（リダイレクト）
    res.redirect('/public/keiyo_add.html');
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));