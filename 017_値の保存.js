// const target = { id : 1}
// const setData = { key1: "value1", key2: "value2", key3: "value3" }

function setValue(sheetName, targetObj, setData) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)

  // 座標の特定
  const targets = getTargetCoordinate(sheetName, targetObj)

  if(targets.length === 0){
    throw `${JSON.stringify(targets)}の座標は存在しません。}`;
  }

  // 座標のy座標を繰り返す。
  for (const target of targets) {
    // 保存を実行
    setValueDone_(sheetName, target["y"], setData)
  }

}

// シートの1番下にデータを追加する。（ユニークに指定されている値と同じのを保存しようとするとエラー処理。）※ シートの行が不足している場合は自動で追加してくれる。
let ySetValueAppEndRow_ = {} // 保存するy座標のキャッシュ 繰り返し処理でこの関数を使用すると同じy座標の位置に値が保存されるのを防止するため。
function setValueAppEndRow(sheetName, setData) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)

  // 値を保存するy座標が定義されていない場合は定義する
  if (!([sheetName] in ySetValueAppEndRow_)) {
    // 値を保存するy座標を検出
    ySetValueAppEndRow_[sheetName] = getSheetObj_(sheetName).length + 2;
  }

  // 保存を実行
  setValueDone_(sheetName, ySetValueAppEndRow_[sheetName], setData)

  // 値を保存するy座標の値を更新
  ySetValueAppEndRow_[sheetName] += 1;
}



// 保存を実行
function setValueDone_(sheetName, y, setData) {
  // シート名を履歴から呼び出す。
  // sheetName = getSheetName(sheetName) //内部関数のためコメントアウト

  // シートを取得
  const sheet = getSheetByName(sheetName);


  // X座標が存在するかチェック
  for (const key of Object.keys(setData)) {
    // X座標取得しようとしてみる。(存在しないkeyの場合はエラー)
    getXCoordinate(sheetName, key);
  }

  // 保存していいかユニークキーチェック
  for (key in setData) {
    if ([sheetName] in cacheUniqueKeyNoValues_) {
      if ([key] in cacheUniqueKeyNoValues_[sheetName]) { // キャッシュにキーが存在するか確認
        if (cacheUniqueKeyNoValues_[sheetName][key].length !== 0) {
          if (cacheUniqueKeyNoValues_[sheetName][key].includes(setData[key])) {
            throw `このデータはすでに保存されています。${JSON.stringify(setData)}`
          }
        }
      }
    }
  }



  // setDataを繰り返して保存を実行
  for (key in setData) {
    // X座標を取得
    const xs = getXCoordinate(sheetName, key)

    // x座標を繰り返す
    for (const x of xs) {
      // 保存を実行
      // SET型またはenumlist型に指定されている場合。
      if (Array.isArray(setData[key]) && [sheetName] in cacheSchema_ && [key] in cacheSchema_[sheetName] && cacheSchema_[sheetName][key]["dataType"].match(/enumlist|set/i)) {
        
        sheet.getRange(y, x).setValue(setData[key].join(" , "));

      // Bool型の場合
      } else if (typeof (setData[key]) === "boolean") {
        
        if (setData[key] === true) {
          sheet.getRange(y, x).setValue("true");
        } else if(setData[key] === false) {
          sheet.getRange(y, x).setValue("false");
        } else {
          sheet.getRange(y, x).setValue("");
        }

      //json(obj)の場合
      } else if (typeof(setData[key]) === "object") {
        
        sheet.getRange(y, x).setValue(JSON.stringify(setData[key]));
      // その他の場合
      } else {
        
        sheet.getRange(y, x).setValue(setData[key]);
      }

      // ユニークキーをキャッシュに追記
      if ([sheetName] in cacheUniqueKeyNoValues_) {
        if ([key] in cacheUniqueKeyNoValues_[sheetName]) { //キャッシュにキーが存在する場合
          cacheUniqueKeyNoValues_[sheetName][key].push(setData[key])
        }
      }

    } // xsのforの閉じタグ
  } // setDataのfor閉じタグ

} // setValueDone_関数の閉じタグ


