let DBObject = null;

function deleteDataItem(ID) {
  const request = DBObject.transaction(['tipsStore'], 'readwrite')
    .objectStore('tipsStore')
    .delete(ID);

  request.onsuccess = () => {
    console.log('数据删除成功');
  };
}

function delectOneweekData() {
  console.log(DBObject, 12300);
  const objectStore = DBObject.transaction('tipsStore').objectStore('tipsStore');

  objectStore.openCursor().onsuccess = (event) => {
    const cursor = event.target.result;
    let time;
    const nowTime = this.$date(new Date()).$D;

    if (cursor) {
      time = this.$date(cursor.value.Time).$D;
      if (nowTime - time >= 1) {
        deleteDataItem(cursor.value.Num);
      }
      cursor.continue();
    }
  };
}

DBObject = window.indexedDB.open('tips_v1.1', 1);

DBObject.onerror = (e) => {
  console.log('删除数据打开出错！', e);
  setTimeout(() => {
    this.indexedDbInit();
  }, 1000);
};

DBObject.onsuccess = () => {
  delectOneweekData();
};
