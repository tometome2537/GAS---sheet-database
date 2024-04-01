function getTargetCoordinate(sheetName, targets) {
  // シート名を履歴から呼び出す。
  sheetName = getSheetName(sheetName)
  /* 
  ・targetsの引数に以下のような同一のkey(この場合person)を持った配列が入力された場合エラー処理する。 → JavaScript言語の仕様で多分無理。
  {"person": "名前１", "person": "名前２"}
  以下のようにすれば意図した動作が可能
  { "person": ["名前１", "名前２"] }
  */
  
  // 結果を初期化
  let result = [];

  // xの値を削除する必要性があるかどうか
  let shouldRemoveX = false;

  // targetを繰り返す → targetが2つ以上指定されている → targetの条件をすべて満たした座標(AND検索)をreturnする必要がある。
  for (const target in targets) {
    const targetXKey = target;
    const targetYKey = targets[target];

    // 座標を調べる
    const xs = getXCoordinate(sheetName, targetXKey);
    const ys = getYCoordinate(sheetName, targetXKey, targetYKey);

    // 座標をresultに蓄積
    if (result.length === 0) { // targets１周目
      for (const x of xs) { // X軸を繰り返す
        for (const y of ys[x]) { // y軸を繰り返す
          const obj = { "x": x, "y": y }
          result.push(obj)
        }
      }

    } else { // targets２週目以降
      // 結果をキャッシュに保存
      const cache = result;
      // 初期化して
      result = [];

      for (const x of xs) { // X軸を繰り返す
        // xの値を削除する必要性があるかどうかの確認
        if(!(shouldRemoveX)) {
          if(cache[0]["x"] !== x) {
            shouldRemoveX = true
          }
        }
        for (const y of ys[x]) { // y軸を繰り返す
          for (const cacheItem of cache) { // キャッシュを繰り返す
            if (cacheItem["y"] === y) {
              const obj = { "x": x, "y": y }
              result.push(obj)
            } 
          }
        }
      }
    }



  } // targetの繰り返しforの閉じタグ。

  
  // xの値を削除する必要性があれば
  if (shouldRemoveX) { 
    // xの値を削除
    result = result.map(({ x, ...rest }) => rest);
  }

  // 座標が存在するかで判定するプログラムのためコメントアウト
  // if(result.length === 0){
  //   throw `${JSON.stringify(targets)}の座標は存在しません。}`;
  // }



  // 結果を返す
  return result;
}