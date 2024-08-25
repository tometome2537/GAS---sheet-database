// GASでシートの書き換え実行時に手動でスプシに変更が加えられるのを防止するためにロックする必要がある。

// シートを保護するコード
function protectionSheet(sheetNames){
  // 引数が渡されていない場合
  if(!(sheetNames)){
    sheetNames = getSheetNames()
  }
  

  for(let sheetName of sheetNames){
    // シート名を履歴から呼び出す。
    sheetName = getSheetName(sheetName)
    
    const protection = getSheetByName(sheetName).protect().setDescription('GASの更新処理中のため保護');
    // 編集時に警告を表示する
    protection.setWarningOnly(true);
  }
}

// シートの保護を解除するコード
function protectionRemoveSheet(){
  // シート名を履歴から呼び出す。
  // sheetName = getSheetName(sheetName)
  
  for(const sheetName of getSheetNames()){
    const protection = getSheetByName(sheetName).getProtections(SpreadsheetApp.ProtectionType.SHEET)[0];
    if (protection) {
      protection.remove();
    }
  }
}