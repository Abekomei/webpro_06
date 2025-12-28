"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ==========================================
//  データ置き場
// ==========================================

let karaokeData = [
    { id: 1, title: "怪獣の花唄", artist: "Vaundy", key: "原曲", memo: "サビが高い" },
    { id: 2, title: "マリーゴールド", artist: "あいみょん", key: "+2", memo: "歌いやすい" }
];

let apexData = [
    { id: 1, name: "レイス", type: "スカーミッシャー", tier: "S", note: "ポータルが強い" },
    { id: 2, name: "ジブラルタル", type: "サポート", tier: "A", note: "ドーム重要" }
];

let subData = [
    { id: 1, service: "Netflix", price: "1980", cycle: "毎月25日", category: "動画", memo: "プレミアムプラン" },
    { id: 2, service: "Amazon Prime", price: "600", cycle: "毎月20日", category: "総合", memo: "配送特典あり" }
];


// ==========================================
//  設定 (Config)
// ==========================================

const KARAOKE_CONFIG = {
    title: "🎤 カラオケ管理リスト",
    baseUrl: "/karaoke",
    listColumns: [
        { label: "ID", key: "id" },
        { label: "曲名", key: "title" },
        { label: "アーティスト", key: "artist" },
        { label: "キー", key: "key" }
    ],
    detailColumns: [
        { label: "ID", key: "id" },
        { label: "曲名", key: "title" },
        { label: "アーティスト", key: "artist" },
        { label: "キー", key: "key" },
        { label: "メモ", key: "memo" }
    ]
};

const APEX_CONFIG = {
    title: "🔫 APEX キャラTier表",
    baseUrl: "/apex",
    listColumns: [
        { label: "ID", key: "id" },
        { label: "キャラ名", key: "name" },
        { label: "クラス", key: "type" },
        { label: "Tier", key: "tier" }
    ],
    detailColumns: [
        { label: "ID", key: "id" },
        { label: "キャラ名", key: "name" },
        { label: "クラス", key: "type" },
        { label: "Tier", key: "tier" },
        { label: "評価メモ", key: "note" }
    ]
};

const SUB_CONFIG = {
    title: "💰 サブスク管理リスト",
    baseUrl: "/sub",
    listColumns: [
        { label: "ID", key: "id" },
        { label: "サービス名", key: "service" },
        { label: "月額(円)", key: "price" },
        { label: "更新日", key: "cycle" }
    ],
    detailColumns: [
        { label: "ID", key: "id" },
        { label: "サービス名", key: "service" },
        { label: "月額(円)", key: "price" },
        { label: "更新日", key: "cycle" },
        { label: "カテゴリ", key: "category" },
        { label: "詳細メモ", key: "memo" }
    ]
};


// ==========================================
//  共通関数
// ==========================================

// IDを生成する関数
function generateId(dataArray) {
    let maxId = 0;
    if (dataArray.length > 0) {
        for(let i = 0; i < dataArray.length; i++) {
            if(dataArray[i].id > maxId) {
                maxId = dataArray[i].id;
            }
        }
    }
    return maxId + 1;
}

// 削除する関数
function deleteItem(dataArray, id) {
    let index = -1;
    for(let i = 0; i < dataArray.length; i++) {
        if(dataArray[i].id == id) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        dataArray.splice(index, 1);
    }
}


// ==========================================
//  ルート: カラオケ (Karaoke)
// ==========================================
app.get("/karaoke", (req, res) => {
    res.render('common_list', { 
        title: KARAOKE_CONFIG.title, 
        baseUrl: KARAOKE_CONFIG.baseUrl, 
        columns: KARAOKE_CONFIG.listColumns, 
        data: karaokeData 
    });
});

app.get("/karaoke/detail/:id", (req, res) => {
    let target = null;
    for(let i = 0; i < karaokeData.length; i++) {
        if(karaokeData[i].id == req.params.id) {
            target = karaokeData[i];
            break;
        }
    }
    res.render('common_detail', { 
        title: "曲の詳細", 
        baseUrl: KARAOKE_CONFIG.baseUrl, 
        columns: KARAOKE_CONFIG.detailColumns, 
        data: target 
    });
});

app.get("/karaoke/create", (req, res) => {
    res.redirect('/public/karaoke_new.html');
});

app.post("/karaoke/add", (req, res) => {
    karaokeData.push({ 
        id: generateId(karaokeData), 
        title: req.body.title, 
        artist: req.body.artist, 
        key: req.body.key, 
        memo: req.body.memo 
    });
    res.redirect('/karaoke');
});

// ▼▼▼ カラオケ編集機能（追加） ▼▼▼
app.get("/karaoke/edit/:id", (req, res) => {
    let target = null;
    for(let i = 0; i < karaokeData.length; i++) {
        if(karaokeData[i].id == req.params.id) {
            target = karaokeData[i];
            break;
        }
    }
    if(target) {
        res.render('karaoke_edit', { item: target });
    } else {
        res.redirect('/karaoke');
    }
});

app.post("/karaoke/update/:id", (req, res) => {
    for(let i = 0; i < karaokeData.length; i++) {
        if(karaokeData[i].id == req.params.id) {
            karaokeData[i].title = req.body.title;
            karaokeData[i].artist = req.body.artist;
            karaokeData[i].key = req.body.key;
            karaokeData[i].memo = req.body.memo;
            break;
        }
    }
    res.redirect('/karaoke');
});
// ▲▲▲ 追加ここまで ▲▲▲

app.get("/karaoke/delete/:id", (req, res) => {
    deleteItem(karaokeData, req.params.id); 
    res.redirect('/karaoke');
});


// ==========================================
//  ルート: APEX
// ==========================================
app.get("/apex", (req, res) => {
    res.render('common_list', { 
        title: APEX_CONFIG.title, 
        baseUrl: APEX_CONFIG.baseUrl, 
        columns: APEX_CONFIG.listColumns, 
        data: apexData 
    });
});

app.get("/apex/detail/:id", (req, res) => {
    let target = null;
    for(let i = 0; i < apexData.length; i++) {
        if(apexData[i].id == req.params.id) {
            target = apexData[i];
            break;
        }
    }
    res.render('common_detail', { 
        title: "キャラ詳細", 
        baseUrl: APEX_CONFIG.baseUrl, 
        columns: APEX_CONFIG.detailColumns, 
        data: target 
    });
});

app.get("/apex/create", (req, res) => {
    res.redirect('/public/apex_new.html');
});

app.post("/apex/add", (req, res) => {
    apexData.push({ 
        id: generateId(apexData), 
        name: req.body.name, 
        type: req.body.type, 
        tier: req.body.tier, 
        note: req.body.note 
    });
    res.redirect('/apex');
});

// ▼▼▼ APEX編集機能（追加） ▼▼▼
app.get("/apex/edit/:id", (req, res) => {
    let target = null;
    for(let i = 0; i < apexData.length; i++) {
        if(apexData[i].id == req.params.id) {
            target = apexData[i];
            break;
        }
    }
    if(target) {
        res.render('apex_edit', { item: target });
    } else {
        res.redirect('/apex');
    }
});

app.post("/apex/update/:id", (req, res) => {
    for(let i = 0; i < apexData.length; i++) {
        if(apexData[i].id == req.params.id) {
            apexData[i].name = req.body.name;
            apexData[i].type = req.body.type;
            apexData[i].tier = req.body.tier;
            apexData[i].note = req.body.note;
            break;
        }
    }
    res.redirect('/apex');
});
// ▲▲▲ 追加ここまで ▲▲▲

app.get("/apex/delete/:id", (req, res) => {
    deleteItem(apexData, req.params.id); 
    res.redirect('/apex');
});


// ==========================================
//  ルート: サブスク
// ==========================================
app.get("/sub", (req, res) => {
    let total = 0;
    for (let i = 0; i < subData.length; i++) {
        let p = parseInt(subData[i].price);
        if (!isNaN(p)) {
            total = total + p;
        }
    }

    let titleStr = SUB_CONFIG.title + " (合計: ¥" + total + ")";

    res.render('common_list', { 
        title: titleStr, 
        baseUrl: SUB_CONFIG.baseUrl, 
        columns: SUB_CONFIG.listColumns, 
        data: subData 
    });
});

app.get("/sub/detail/:id", (req, res) => {
    let target = null;
    for(let i = 0; i < subData.length; i++) {
        if(subData[i].id == req.params.id) {
            target = subData[i];
            break;
        }
    }
    res.render('common_detail', { 
        title: "サブスク詳細", 
        baseUrl: SUB_CONFIG.baseUrl, 
        columns: SUB_CONFIG.detailColumns, 
        data: target 
    });
});

app.get("/sub/create", (req, res) => {
    res.redirect('/public/subscription_new.html');
});

app.post("/sub/add", (req, res) => {
    subData.push({ 
        id: generateId(subData), 
        service: req.body.service, 
        price: req.body.price, 
        cycle: req.body.cycle, 
        category: req.body.category,
        memo: req.body.memo 
    });
    res.redirect('/sub');
});

// ▼▼▼ サブスク編集機能（追加） ▼▼▼
app.get("/sub/edit/:id", (req, res) => {
    let target = null;
    for(let i = 0; i < subData.length; i++) {
        if(subData[i].id == req.params.id) {
            target = subData[i];
            break;
        }
    }
    if(target) {
        res.render('sub_edit', { item: target });
    } else {
        res.redirect('/sub');
    }
});

app.post("/sub/update/:id", (req, res) => {
    for(let i = 0; i < subData.length; i++) {
        if(subData[i].id == req.params.id) {
            subData[i].service = req.body.service;
            subData[i].price = req.body.price;
            subData[i].cycle = req.body.cycle;
            subData[i].category = req.body.category;
            subData[i].memo = req.body.memo;
            break;
        }
    }
    res.redirect('/sub');
});
// ▲▲▲ 追加ここまで ▲▲▲

app.get("/sub/delete/:id", (req, res) => {
    deleteItem(subData, req.params.id); 
    res.redirect('/sub'); 
});

// ==========================================
//  トップページ (メニュー)
// ==========================================
app.get("/", (req, res) => {
    res.render('top', { title: '統合データ管理システム' });
});

app.listen(8081, () => {
    console.log("Server started on port 8081!");
});