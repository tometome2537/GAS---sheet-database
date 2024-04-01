// シートを入れるとobj形式に変換してくれる。
function sheetObj(sheet) {
  const rows = sheet.getDataRange().getValues();
  const keys = rows.splice(0, 1)[0];
  return rows.map(row => {
    const obj = {};
    row.map((item, index) => {
      // 保存されている値が0の場合にfalse判定になりnullが出力されてしまうのでString(item) === ""の記述で判定を行っている。
      // obj[String(keys[index])] = String(item) === "" ? null : String(item);
      // すべての値を文字型にして出力する方が関数としての役割。JavaScript上では扱いやすい。
      obj[String(keys[index])] = String(item);
    });
    return obj;
  });
}

// シート名を一覧を取得
function getSheetNames(){
  return getSpreadSheet().getSheets().map(sheet => sheet.getName());
}

