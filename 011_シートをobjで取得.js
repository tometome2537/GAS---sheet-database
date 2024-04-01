// target指定でフィルター機能付きでシートをjson形式で取得(リレーションを考慮)
function getSheetObjTarget(sheetName, targetsObj) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)
  // シートを取得
  let result = getSheetObj(sheetName)

  if (targetsObj) {
    // 座標を取得
    const yCoordinate = getTargetCoordinate(sheetName, targetsObj).map(v => v["y"])

    result = result.filter((resultItem, index) => {
      if (yCoordinate.includes((index + 2))) {
        return resultItem;
      }
    });

  }

  return result;
}


// シートをjson形式で取得(リレーションを考慮)
let cacheGetSheetObjRelation_ = {};
function getSheetObj(sheetName) {
  // シート名履歴チェック
  sheetName = getSheetName(sheetName)


  // キャッシュに保存されているか確認。
  if ([sheetName] in cacheGetSheetObjRelation_) {
    return cacheGetSheetObjRelation_[sheetName]
  } else {
    // キャッシュに保存されていない場合。
    const result = getSheetObj_(sheetName);
    if ([sheetName] in cacheSchema_) { // スキーマでシートが定義されていれば。
      for (const key of Object.keys(cacheSchema_[sheetName])) { // シートの各keyの定義を繰り返す
        if ("relation" in cacheSchema_[sheetName][key]) { // リレーションの存在を確認
          // リレーション先のobjを取得
          const relationSheetObj = getSheetObj_(cacheSchema_[sheetName][key]["relation"]["sheetName"]);
          // リザルトに付与
          for (let resultItem of result) {
            resultItem[key] = relationSheetObj.filter(relationObj => {

              // リレーション元のkeyのvalueが配列[SET型][enumList型]
              if (Array.isArray(resultItem[cacheSchema_[sheetName][key]["relation"]["references"]])) {
                if (relationObj[cacheSchema_[sheetName][key]["relation"]["sheetKey"]] && resultItem[cacheSchema_[sheetName][key]["relation"]["references"]]) { // null以外の場合
                  return resultItem[cacheSchema_[sheetName][key]["relation"]["references"]].includes(relationObj[cacheSchema_[sheetName][key]["relation"]["sheetKey"]])

                }
              }

              // リレーション先のkeyのvalueが配列[SET型][enumList型]
              if (Array.isArray(relationObj[cacheSchema_[sheetName][key]["relation"]["sheetKey"]])) {
                if (relationObj[cacheSchema_[sheetName][key]["relation"]["sheetKey"]] && resultItem[cacheSchema_[sheetName][key]["relation"]["references"]]) { // null以外の場合
                  return relationObj[cacheSchema_[sheetName][key]["relation"]["sheetKey"]].includes(resultItem[cacheSchema_[sheetName][key]["relation"]["references"]])
                }
              }

              // リレーション先のkeyのvalueが文字列(object[SET型]以外)の場合は型を含めた完全一致で定義する。
              return relationObj[cacheSchema_[sheetName][key]["relation"]["sheetKey"]] === resultItem[cacheSchema_[sheetName][key]["relation"]["references"]]

            });
          }
        }
      }
    }
    // キャッシュに保存
    cacheGetSheetObjRelation_[sheetName] = result
    // 結果を返す
    return result
  }

}



// シートをjson形式で取得(リレーションを考慮しない)
let constGetSheetObj_ = {};
function getSheetObj_(sheetName) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)

  if ([sheetName] in constGetSheetObj_) { // キャッシュがある場合
    return constGetSheetObj_[sheetName];

  } else {
    // シートを取得
    const sheet = getSheetByName(sheetName);
    // objに変換
    let result = []
    result = sheetObj(sheet)

    // 型変換(デフォルトは文字型)
    if ([sheetName] in cacheSchema_) { // スキーマが定義されている場合
      for (let item of result) {
        for (const key in cacheSchema_[sheetName]) { // 定義を繰り返す
          if ("dataType" in cacheSchema_[sheetName][key]) {
            // 数値型の場合
            if (cacheSchema_[sheetName][key]["dataType"].match(/int/i)) {
              // 空文字をNumber()すると0になってしまう。 undefinedを返すとJSON.stringify()でkeyが削除されてしまうためnullを返す。
              if (item[key] === "" || item[key] === null) { // nullはNaNに変換
                item[key] = NaN;
              } else {
                item[key] = Number(item[key]);
              }
            }
            // jsonの場合
            if (cacheSchema_[sheetName][key]["dataType"].match(/json/i)) {
              try {
                item[key] = JSON.parse(item[key])
              } catch {
                item[key] = null
              }
            }
            // Bool型の場合
            if (cacheSchema_[sheetName][key]["dataType"].match(/bool|boolen|boolean/i)) {
              if (item[key] === null || item[key] === "") {
                item[key] = null
              } else if (/^(true|yes|1)$/i.test(item[key])) {
                item[key] = true;
              } else if (/^(false|no|0)$/i.test(item[key])) {
                item[key] = false;
              } else {
                item[key] = null
              }
            }
            // date型の場合
            if (cacheSchema_[sheetName][key]["dataType"].match(/date/i)) {
              item[key] = new Date(item[key])
              if (item[key].toString() === "Invalid Date") { // 日付に変換できなかった場合はnull
                item[key] = null
              }
            }
            // enumList(重複が許される)の場合
            if (cacheSchema_[sheetName][key]["dataType"].match(/enumlist|set/i)) {
              if (typeof (item[key]) === "string" && item[key].length >= 1) {
                item[key] = item[key].split(/ , |,| ,|, /).filter(v => v)
                // Set型(重複が許されない)
                if (cacheSchema_[sheetName][key]["dataType"].match(/set/i)) {
                  item[key] = item[key].filter((item, index, self) => self.indexOf(item) === index);
                }
              } else {
                item[key] = null
              }
            }

            // String型の扱い
            if (cacheSchema_[sheetName][key]["dataType"].match(/string/i)) {
              if (typeof (item[key]) === "string" && item[key].length >= 1) { // １文字以上の文字列なら文字型に変換
                item[key] = String(item[key]);
              } else { // それ以外はnull
                item[key] = null;
              }
            }

          }
        }
      }
    }

    // デフォルトはnullにする。
    for (let resultItem of result) {
      for(let resultItemKey in resultItem){
        // デフォルトはnull
        if (resultItem[resultItemKey] === "") {
          resultItem[resultItemKey] = null;
        }
      }
    }


    // キャッシュに保存して
    constGetSheetObj_[sheetName] = result
    // リターン
    return result;

  }

}





