// ↓ ユニークキーの値を保存用
let cacheUniqueKeyNoValues_ = {}


// すべてのシートのユニークキーをcacheに保存する
function cacheUniqueKey_() {
  for (let sheetName of Object.keys(cacheSchema_)) { // スキーマの各シートの定義を繰り返す
    // シート名を履歴から呼び出す。
    sheetName = getSheetName(sheetName)
    cacheUniqueKeyNoValues_[sheetName] = {}; // 初期化
    for (const key of Object.keys(cacheSchema_[sheetName])) { // シートの各keyの定義を繰り返す
      if ("decorator" in cacheSchema_[sheetName][key]) { // decoratorの存在を確認
        if (cacheSchema_[sheetName][key]["decorator"].includes("unique")) { // decoratorにuniqueが指定されている場合
          // 既存の値をキャッシュにすべて保存する
          cacheUniqueKeyNoValues_[sheetName][key] = [];  // 初期化
          for (const item of getSheetObj_(sheetName)) {
            cacheUniqueKeyNoValues_[sheetName][key].push(item[key])
          }
        }
      }
    }
  }
}
