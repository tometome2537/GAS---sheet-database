// スプシのIDを定義
let constSpreadSheetId_ = null; // 初期化
function setSpreadSheetId(id) {
  if (constSpreadSheetId_) {
    throw `スプシのIDが変更されようとしています。!大変危険!`
  } else {
    constSpreadSheetId_ = id
    return { statas: "success" }
  }

}

// スキーマを定義
let cacheSchema_ = null;
function setSchema(schema) {
  if (cacheSchema_) { //　キャッシュにスキーマがすでに保存されている確認。
    throw "スキーマを上書きしようとしています。大変危険！"
  } else {
    // 設定されたスキーマのxKeyが存在するかチェックする。
    for (let sheetName of Object.keys(schema)) { // シート名を繰り返す
      // シート名を履歴から呼び出す。
      sheetName = getSheetName(sheetName)
      for (const xKey of Object.keys(schema[sheetName])) { // xKeyを繰り返す
        if (!("relation" in schema[sheetName][xKey])) { // リレーションの値以外。
          try {
            getXCoordinate(sheetName, xKey)
          } catch (e) {
            throw `スキーマの保存に失敗しました。${e}`;
          }
        }
      }
    }
    // スキーマをキャッシュする。
    cacheSchema_ = schema;
    // ユニークキーを保存
    cacheUniqueKey_()
  }
  return { statas: "success" }
}

// スプシファイルを呼び出す。
let constSpreadSheet_ = null; // 初期化 キャッシュすることで読み込み速度を上げる。
function getSpreadSheet() {
  if (constSpreadSheet_) {// キャッシュが保存されている場合。
    return constSpreadSheet_;
    
  } else {
    if (!constSpreadSheetId_) { // idが定義されていない場合
      throw "読み込むスプシIDが定義されていません。"
    }
    const ss = SpreadsheetApp.openById(constSpreadSheetId_);
    constSpreadSheet_ = ss;
    return ss
  }
}

// シートを読み込む
let constSheet_ = {}; // キャッシュの初期化
function getSheetByName(sheetName) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)

  if ([sheetName] in constSheet_) { // キャッシュに保存されている場合
    return constSheet_[sheetName];

  } else { // キャッシュに保存されていない場合
    const sheet = getSpreadSheet().getSheetByName(sheetName);
    // キャッシュに保存
    constSheet_[sheetName] = sheet
    return sheet
  }

}
