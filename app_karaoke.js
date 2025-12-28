"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ■データ（カラオケ用）
let songs = [
    { id: 1, title: "怪獣の花唄", artist: "Vaundy", key: "原曲", memo: "サビが高い" },
    { id: 2, title: "マリーゴールド", artist: "あいみょん", key: "+2", memo: "歌いやすい" },
    { id: 3, title: "残酷な天使のテーゼ", artist: "高橋洋子", key: "原曲", memo: "盛り上がる" }
];

// ■■■ カラオケ用の表示設定 ■■■
const KARAOKE_CONFIG = {
    title: "カラオケ練習リスト",
    baseUrl: "/karaoke", // ここをカラオケ用にする
    columns: [
        { label: "ID", key: "id" },
        { label: "曲名", key: "title" },
        { label: "アーティスト", key: "artist" },
        { label: "キー", key: "key" },
        // 一覧にメモは出さない（詳細で見ればいいから）
    ]
};

const KARAOKE_DETAIL_CONFIG = {
    title: "曲の詳細",
    baseUrl: "/karaoke",
    columns: [
        { label: "ID", key: "id" },
        { label: "曲名", key: "title" },
        { label: "アーティスト", key: "artist" },
        { label: "キー", key: "key" },
        { label: "メモ", key: "memo" } // 詳細ではメモも出す
    ]
};

// ■一覧表示 (共通EJSを使用！)
app.get("/karaoke", (req, res) => {
    res.render('common_list', { 
        data: songs,
        title: KARAOKE_CONFIG.title,
        baseUrl: KARAOKE_CONFIG.baseUrl,
        columns: KARAOKE_CONFIG.columns
    });
});

// ■詳細表示 (共通EJSを使用！)
app.get("/karaoke/detail/:id", (req, res) => {
    const id = req.params.id;
    const detail = songs[id - 1]; 
    
    res.render('common_detail', { 
        data: detail,
        title: KARAOKE_DETAIL_CONFIG.title,
        baseUrl: KARAOKE_DETAIL_CONFIG.baseUrl,
        columns: KARAOKE_DETAIL_CONFIG.columns
    });
});

// ■新規登録画面へ (ここは専用のHTMLへ飛ばす)
app.get("/karaoke/create", (req, res) => {
    res.redirect('/public/karaoke_new.html');
});

// ■新規登録処理
app.post("/karaoke/add", (req, res) => {
    const id = songs.length + 1;
    songs.push({ 
        id: id, 
        title: req.body.title, 
        artist: req.body.artist, 
        key: req.body.key, 
        memo: req.body.memo 
    });
    res.redirect('/karaoke');
});

// ■削除処理
app.get("/karaoke/delete/:id", (req, res) => {
    const id = req.params.id;
    songs.splice(id - 1, 1);
    for(let i=0; i<songs.length; i++) songs[i].id = i + 1;
    res.redirect('/karaoke');
});

// ■編集画面へ (専用EJSを使う ※ここも共通化は難しいので一旦専用で)
app.get("/karaoke/edit/:id", (req, res) => {
    const id = req.params.id;
    const detail = songs[id - 1];
    res.render('karaoke_edit', { data: detail });
});

// ■更新処理
app.post("/karaoke/update/:id", (req, res) => {
    const id = req.params.id;
    songs[id - 1].title = req.body.title;
    songs[id - 1].artist = req.body.artist;
    songs[id - 1].key = req.body.key;
    songs[id - 1].memo = req.body.memo;
    res.redirect('/karaoke');
});

// ポートを変えておく（APEXと同時に動かせるように）
app.listen(8081, () => console.log("Karaoke App started on port 8081!"));