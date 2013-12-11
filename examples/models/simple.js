Models.define('yourModelName', function( out, db, cache ) {

    // out 是你的Model想输出的值或函数
    out.name = 'express-model 1.0';
    out.getName = function() {
        return out.name
    }

    // db 将引用定义在express-model/supportDB目录下对应的数据库驱动文件
    // express默认使用moogoose
    // 同时db提供一个use，来让你使用其它声明在supportDB的数据库，例如
    db.use('mysql', function(storage) {
        // mysql的操作
    })

    // 若你想使用同步的方式，你可以这样：
    var mysql = db.use('mysql')
    mysql.connect(...);

    // cache 的使用，顾名思义，就是作为缓存，不过有点特殊
    // 你先要像如下一样给out添加一个proto
    out._constructor = function() {
        // numbers of codes
    }

    // 它不同于其它out的proto值，它在define完后，会先执行一次来实现初始化Model的工作，因此你可以这样
    out._constructor = function() {
        cache.username = db.queryUsername(...)
    }
    out.getUsername = function() {
        return cache.username;
    }

    // PS:
    // - cache的实现相当简单，其实就是一句Object.create(null)，然而其灵活度也大大增加了应用程序的直接效率，有效正确地使用参数cache往往事半功倍

})