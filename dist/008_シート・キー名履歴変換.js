let cacheHistorySheetKeyName_ = null;
/** シート・キー名を過去の変更履歴を定義することができる。 */
function setHistorySheetKeyName(historySheetKeyName) {
  if(cacheHistorySheetKeyName_){
    throw `シート・キー履歴が再度設定されようとしています。`
  } else {
    cacheHistorySheetKeyName_ = historySheetKeyName
    return { statas: "success" }
  }
}

/** シート名を取得 */
function getSheetName(sheetName) {
  for (const historySheetName in cacheHistorySheetKeyName_) {
    if ("sheetNameHistory" in cacheHistorySheetKeyName_[historySheetName]) {
      if (cacheHistorySheetKeyName_[historySheetName]["sheetNameHistory"].includes(sheetName)) {
        return historySheetName;
      }
    }
  }
  return sheetName
}

/** キー名を取得 */
function getKeyName(sheetName, keyName) {
  // シート名を取得
  imanoSheetName = getSheetName(sheetName);

  //キャッシュに登録されているシート名かチェック
  if ([imanoSheetName] in cacheHistorySheetKeyName_) {
    // 保存されている場合
    if ("keyNameHistory" in cacheHistorySheetKeyName_[imanoSheetName]) { // keyNameHistoryの項目があるかどうか
      if ([keyName] in cacheHistorySheetKeyName_[imanoSheetName]["keyNameHistory"]) {
        return cacheHistorySheetKeyName_[imanoSheetName]["keyNameHistory"][keyName]
      }
    }
  }
  // 保存されていない場合
  return keyName;
}