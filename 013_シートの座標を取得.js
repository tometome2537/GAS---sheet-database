// シートの名前とxKeyから、そのxKeyは左から何番目にあるかを返す。
// 存在しない場合はエラー
let cacheXCoordinate_ = {};
function getXCoordinate(sheetName, xKey) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)
  
  // xKeyは必ず文字型で受け取ること。0の場合は"0"で受け取る。
  if(!(typeof(xKey) === "string" && xKey.length >= 1)){
    throw `xKeyは文字型で１文字以上の必要があります。${sheetName}の${xKey}`
  }
  // キャッシュの読み込み
  if([sheetName] in cacheXCoordinate_ && [xKey] in cacheXCoordinate_[sheetName]){
    return cacheXCoordinate_[sheetName][xKey];
  }
  // シートを取得
  const sheet = getSheetByName(sheetName);

  // ↓ １行目の値を配列を文字型で取得。
  const xKeyList = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);

  // シート名がキャッシュ変数に定義されていない場合は定義(初期化)
  if(!([sheetName] in cacheXCoordinate_)){
    cacheXCoordinate_[sheetName] = {}
  }
  let result = []; // 結果を初期化
  let count = 1; // 初期値
  
  // ↓ 取得した値からxKeyは何番目にあるかを計算
  for (const xKeyListItem of xKeyList) {
    if(xKeyListItem === xKey){ 
      result.push(count)
    }
    count += 1; // ⇦xKeyは何番目にあるかをカウントするための変数。もっといい書き方ある説。  
  }
  if(result.length === 0){
    throw `${sheetName}の${xKey}は存在しません。`
  }
  // キャッシュに保存
  cacheXCoordinate_[sheetName][xKey] = result;

  return result;
}

// Y座標を取得する
function getYCoordinate(sheetName, xKey, value) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)
  // ↓ false、0、NaN、null、""でy座標を探す場合も考えられるのでこの書き方。
  if(value === undefined){
    throw `valueが空白です!!`
  }
  // xKeyが存在しているかチェック
  getXCoordinate(sheetName, xKey)
  // シートを取得
  const sheetObj = getSheetObj_(sheetName)

  let result = {}; // 結果の初期化

  for(const x of getXCoordinate(sheetName, xKey)){ // xキー番号を繰り返す
    let count = 2// 初期値
    result[x] = []; // 初期化

    for(const sheetObjItem of sheetObj){
      
      // 両方とも配列だった場合(AND検索)
      if(sheetObjItem[xKey] && Array.isArray(sheetObjItem[xKey]) && Array.isArray(value)){
        if(value.every(valueItem => sheetObjItem[xKey].includes(valueItem))){
          result[x].push(count);
        }

      // 片方が配列で片方が文字型だった場合
      } else if(sheetObjItem[xKey] && Array.isArray(sheetObjItem[xKey])  && typeof(value) === "string"){
        if(sheetObjItem[xKey].includes(value)){
          result[x].push(count);
        }

      // 片方が配列で片方が文字型だった場合
      }else if(sheetObjItem[xKey] && typeof(sheetObjItem[xKey]) === "string" && Array.isArray(value) ){
        if(value.includes(sheetObjItem[xKey])){
          result[x].push(count);
        }

      //両方をともNaNだった場合
      } else if(typeof(sheetObjItem[xKey]) === "number" && isNaN(sheetObjItem[xKey]) && typeof(value) === "number" && isNaN(value)){
        result[x].push(count);
      
      // その他(文字型・Boolean型・null・"") 
      } else if(sheetObjItem[xKey] === value){
        result[x].push(count);

      // BigInt型に対応(Valueが桁数の多い数値の場合に文字型に変換String()すると値が変わってしまうためシートデータ側をNumber()して比較する。))
      } else if( Number(sheetObjItem[xKey]) === value){
        result[x].push(count);
      }
      count += 1
    }

    // y座標が存在しない場合エラー
    // if(result[x].length === 0){ 
    //   throw `${sheetName}の${xKey}の${JSON.stringify(value)}は存在しません。`
    // }
    // エラーにすると都合が悪い...y座標に値が存在しない場合の処理が書きにくいため。

  }

  return result;
}
