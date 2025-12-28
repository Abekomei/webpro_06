"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ■データ
let legends = [
    { id: 1, name: "ブラッドハウンド", tier: "S", role: "リコン", comment: "壁透視" },
    { id: 2, name: "ジブラルタル", tier: "A", role: "サポート", comment: "ドーム" },
    { id: 3, name: "パスファインダー", tier: "A", role: "スカーミッシャー", comment: "グラップル" }
];

// ■■■ ここがポイント！表示設定を作る ■■■
// これを変えるだけで、APEX用にもカラオケ用にもなる
const APEX_CONFIG = {
    title: "APEX ティア表",
    baseUrl: "/apex", // リンクの基準になるURL
    columns: [
        { label: "ID", key: "id" },
        { label: "名前", key: "name" },
        { label: "Tier", key: "tier" },
        { label: "ロール", key: "role" },
        // 一覧には出したくない項目（commentなど）はここから外せば出ない
    ]
};

// 詳細画面用の設定（全部表示したい場合）
const APEX_DETAIL_CONFIG = {
    title: "キャラ詳細",
    baseUrl: "/apex",
    columns: [
        { label: "ID", key: "id" },
        { label: "名前", key: "name" },
        { label: "Tier", key: "tier" },
        { label: "ロール", key: "role" },
        { label: "コメント", key: "comment" } // 詳細ではコメントも出す
    ]
};

// ■一覧表示
app.get("/apex", (req, res) => {
    // 共通の 'common_list' を使い、設定(APEX_CONFIG)を渡す
    res.render('common_list', { 
        data: legends,
        title: APEX_CONFIG.title,
        baseUrl: APEX_CONFIG.baseUrl,
        columns: APEX_CONFIG.columns
    });
});

// ■詳細表示
app.get("/apex/detail/:id", (req, res) => {
    const id = req.params.id;
    const detail = legends[id - 1]; 
    
    // 共通の 'common_detail' を使う
    res.render('common_detail', { 
        data: detail,
        title: APEX_DETAIL_CONFIG.title,
        baseUrl: APEX_DETAIL_CONFIG.baseUrl,
        columns: APEX_DETAIL_CONFIG.columns
    });
});

// --- 以下は登録・削除・編集のロジック（ここはデータ構造に依存するためそのまま残すか、同様に工夫が必要）---
// ※フォーム(HTML)は入力項目が異なるため、無理に共通化せず専用のもの（apex_new.html）を使うのが無難です。

app.get("/apex/create", (req, res) => res.redirect('/public/apex_new.html'));

app.post("/apex/add", (req, res) => {
    const id = legends.length + 1;
    legends.push({ id: id, name: req.body.name, tier: req.body.tier, role: req.body.role, comment: req.body.comment });
    res.redirect('/apex');
});

app.get("/apex/delete/:id", (req, res) => {
    const id = req.params.id;
    legends.splice(id - 1, 1);
    for(let i=0; i<legends.length; i++) legends[i].id = i + 1;
    res.redirect('/apex');
});

// 編集画面（ここも共通化は可能ですが、まずは専用ファイルで対応が安全）
app.get("/apex/edit/:id", (req, res) => {
    const id = req.params.id;
    const detail = legends[id - 1];
    res.render('apex_edit', { data: detail }); // ここは一旦そのまま
});

app.post("/apex/update/:id", (req, res) => {
    const id = req.params.id;
    legends[id - 1].name = req.body.name;
    legends[id - 1].tier = req.body.tier;
    legends[id - 1].role = req.body.role;
    legends[id - 1].comment = req.body.comment;
    res.redirect('/apex');
});

app.listen(8080, () => console.log("APEX App (Common View) started on port 8080!"));