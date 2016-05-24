var fs = require('fs');
var path = require('path');
var http = require('http') ;
var imgPath = './images';

function go(){
	var dirList = fs.readdirSync(imgPath);
	var book = [];
	var index = 0;
	for (var i = dirList.length - 1; i >= 0; i--) {
		(function(name){
			fs.stat(path.resolve(__dirname,imgPath,name),function(err,stats){
				if(err){
					console.log('读取文件信息失败');
				}
				book.push({
					path:name,
					size:stats.size,   //文件大小
					atime:stats.atime, //访问时间
					mtime:stats.mtime, //修改时间
					ctime:stats.ctime, //创建时间
				});
				if(++index == dirList.length){
					fs.writeFile('./fileList.js','fileList='+JSON.stringify(book),function(){
						console.log('fileList.js写入成功');
					});
				}	
			})
		})(dirList[i])
	}
}

go();

http.createServer(function(req,res){
	console.log(req.url);
	try{
		if(req.url=='/fileList.js'){
			var s = fs.readFileSync('./fileList.js');
			res.write(s);
			res.end();
			return;
		}
		if(~req.url.indexOf('.jpg') || ~req.url.indexOf('.gif') || ~req.url.indexOf('.png')){
			var s = fs.readFileSync('.'+decodeURIComponent(req.url),'binary');
			res.writeHead(200, {'Content-Type': 'image/jpeg'});
			res.write(s,'binary');
			res.end();
			return;
		}
		if(req.url=='/'){
			res.writeHeader(200,{
		    	'Content-Type' : 'text/html;charset=utf-8'
		    }) ;
		    var s = fs.readFileSync('./index.html');
		    res.write(s);
		    res.end();
		    return;
		}
	}catch(e){
		console.log(e)
	}

}).listen(8080);

console.log('localhost:8080');

fs.watch(imgPath, function (event, filename) {
 	go();
});