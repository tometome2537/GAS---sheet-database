function setRichTextValue(sheetName, targetObj, newRichTextValue) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)
  
  // シートを取得
  const sheet = getSheetByName(sheetName);
  // 座標の特定
  const targets = getTargetCoordinate(sheetName, targetObj);

  if(targets.length === 0){
    throw `${JSON.stringify(targets)}の座標は存在しません。}`;
  }


  for (const target of targets) { // targetを繰り返す
    // 自分自身の値の置き換えが可能になるためのセーフティ機能必要
    // if (newRichTextValue.getText() != sheet.getRange(target["y"], target["x"]).getValue()) {
    if(false){
      throw "既存の値とsetText()で定義された値が違います。";
    } else {
      // 設定
      sheet.getRange(target["y"], target["x"]).setRichTextValue(newRichTextValue);
    }
  }
}
