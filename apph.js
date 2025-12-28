"use strict";

const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));



let karaokeData = [
    { id: 1, title: "怪獣の花唄", artist: "Vaundy", key: "原曲", memo: "サビが高い" },
    { id: 2, title: "マリーゴールド", artist: "あいみょん", key: "+2", memo: "歌いやすい" },
    { id: 3, title: "青と夏", artist: "Mrs. GREEN APPLE", key: "原曲", memo: "盛り上がる" },
    { id: 4, title: "ドライフラワー", artist: "優里", key: "-2", memo: "裏声が重要" },
    { id: 5, title: "Pretender", artist: "Official髭男dism", key: "-1", memo: "キーが高い" },
    { id: 6, title: "アイドル", artist: "YOASOBI", key: "原曲", memo: "テンポ速い" },
    { id: 7, title: "水平線", artist: "back number", key: "原曲", memo: "感情込める" },
    { id: 8, title: "天体観測", artist: "BUMP OF CHICKEN", key: "原曲", memo: "定番" },
    { id: 9, title: "奏", artist: "スキマスイッチ", key: "+1", memo: "バラード" },
    { id: 10, title: "小さな恋のうた", artist: "MONGOL800", key: "原曲", memo: "皆で歌える" }
];

let apexData = [
    { id: 1, name: "レイス", type: "スカーミッシャー", tier: "S", note: "ポータルが強い" },
    { id: 2, name: "ジブラルタル", type: "サポート", tier: "A", note: "ドーム重要" },
    { id: 3, name: "パスファインダー", type: "スカーミッシャー", tier: "A", note: "移動が楽しい" },
    { id: 4, name: "ライフライン", type: "サポート", tier: "S", note: "自動蘇生が強力" },
    { id: 5, name: "バンガロール", type: "アサルト", tier: "S", note: "スモーク活用" },
    { id: 6, name: "ブラッドハウンド", type: "リコン", tier: "B", note: "スキャン役" },
    { id: 7, name: "コースティック", type: "コントローラー", tier: "B", note: "室内戦最強" },
    { id: 8, name: "ホライゾン", type: "スカーミッシャー", tier: "S", note: "リフトで高所へ" },
    { id: 9, name: "オクタン", type: "スカーミッシャー", tier: "A", note: "ジャンパで特攻" },
    { id: 10, name: "ワットソン", type: "コントローラー", tier: "A", note: "パイロンで防御" }
];

let subData = [
    { id: 1, service: "Netflix", price: "1980", cycle: "毎月25日", category: "動画", memo: "プレミアムプラン" },
    { id: 2, service: "Amazon Prime", price: "600", cycle: "毎月20日", category: "総合", memo: "配送特典あり" }
];



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


app.get("/karaoke/delete/:id", (req, res) => {
    deleteItem(karaokeData, req.params.id); 
    res.redirect('/karaoke');
});



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


app.get("/sub/delete/:id", (req, res) => {
    deleteItem(subData, req.params.id); 
    res.redirect('/sub'); 
});


app.get("/", (req, res) => {
    res.render('top', { title: '統合データ管理システム' });
});

app.listen(8081, () => {
    console.log("Server started on port 8081!");
});