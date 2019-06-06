class DB {
  constructor(name, version) {
    this.myDB = {
      name,
      version,
      db: null,
    };
    console.log(5555);

    this.createDB();
  }

  createDB(storeName = 'tipsStore') {
    console.log(666);

    const request = window.indexedDB.open(this.myDB.name, this.myDB.version);

    request.onerror = (e) => {
      console.log('数据库打开出错！', e);
    };


    request.onsuccess = (e) => {
      this.myDB.db = e.target.result;
      console.log('数据库打开成功', this.myDB.db);
      // callback && callback();
    };

    request.onupgradeneeded = (e) => {
      this.myDB.db = e.target.result;

      // 判断一下，这张表格是否存在，如果不存在再新建
      if (!this.myDB.db.objectStoreNames.contains(storeName)) {
        console.log(3333);
        this.myDB.db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  }
  // eslint-disable-next-line
  add(storeName = 'tipsStore', data) {
    console.log(4444);
    const request = this.myDB.db.transaction([storeName], 'readwrite')
      .objectStore(storeName)
      .add(data);

    request.onsuccess = (event) => {
      console.log('数据写入成功', event);
    };

    request.onerror = (event) => {
      console.log('数据写入失败', event);
    };
  }
}

export default DB;
