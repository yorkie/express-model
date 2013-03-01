# express-model

为Express框架提供Model支持，可集成多种数据库(SQL & NoSQL)，灵活性高的轻量级工具。
由于Express官方并未显式地提供Model支持，express-model不仅能有效嵌入Express Mvc中，还支持多种需要Model的场景

# Features

* 轻量级Controller，把更多地逻辑过程从Controller中移出，让Model分担请求压力，同时减少Controller代码量，增强代码可读性，从而加大Controller层的灵活性
* 理论上支持多种储存格式，包括XML，JSON，文件系统，数据库以及其它存储系统，并且可根据具体情况灵活地使用对应的存储体系
* 对上一特性的拓展，在同一个Model中，可以方便地对各存储系统实现交互，并得益于NodeJS的事件模型，这些操作对前端性能几乎不影响
* 精简的API，尽量从使用者的角度去设计程序接口

# 使用指南

秉承了SeaJS与RequireJS大道至简的接口设计，你首先要在服务器开启时初始化express-model，即Express中的app.js
```
	var model = require('express-model')
	var util = require('util')
	
	//..some codes...
	// 你必须通过传入一个字符串参数，让express-model知道你所定义的Model所在的位置
	global.Models = model(util.format('%s/%s', __dirname, 'models');
```
下面假设你使用了express-model默认的mongoose作为数据库driver，接着你需要的就是定义一个Model，你可以在你指定的Model目录下创建一个demo.js
```
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
```
接下来是使用刚才定义Model
```
	var model = Model.use('yourModelName', function() {
		this.someVariable_1 = 1;
		this.someVariable_2 = 2;
		// 这个函数是一个后处理，它会向已有的添加额外的属性
	})
	response.render('yourViewName', model)
```
最后在View中使用的部分就略掉了


# express-model是工具，不是Express插件，更不是框架

express-model正因此，才能得以如此灵活。
你可以很方便地把它接入任何需要与数据/存储相关的应用中，它是一个工具，帮助你的程序员们更好地在前后端之间进行交互。
可以试想一下下面的场景，你的Log使用的是mySQL，SNS应用的是MongoDB，而图片使用你自己开发的图片存储服务器集群，你可以在一个Model中这么写
```
	Models.define('Example_1', function( out, db, cache ) {
	
		db.use('mysql', function(storage) {
		// log operators
		})
	
		db.use('JfileSystem', function(storage) {
		// file system operators
		}
	
		// default as SNS: mongoDB
		// SNS operators
	
	})
```
另外一个场景则是，利用express-model，你可以写一个小脚本来迁移你两个数据库中的个别数据，甚至整个数据库，请看下面的代码
```
	Models.define('Example_2', function( out, db, cache ) {
	
		db.use('mysql', function(storage) {
			var mysqlData = storage.getSomeDataFromYourMySQL(...)
			db.use('mongoDB', function(db) {
				db.appendMySQLDataToMongoDB(mysqlData);
			})
		})
	
	})
```