var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  return`<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    // console.log(filelist[i]);
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
    // console.log(list);
  }
  return list = list + '</ul>';
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    // console.log(queryData.id);

    // if(request.url == '/'){
    //   title = 'welcome';
    // }
    // if(request.url == '/favicon.ico'){
    //   response.writeHead(404);
    //   response.end();
    //   return;
    // }

    if (pathname === '/') {
      if (queryData.id === undefined) {
        // var datalist = './data';
        fs.readdir('./data', function(error, filelist) {
          // console.log(filelist);
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);
          var template = templateHTML(
            title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`,)
          response.writeHead(200); //파일을 성공적으로 전송했다.
          // console.log(__dirname + url);
          response.end(template);
          // response.end('nano : '+ url);
        });
      } else {
        fs.readFile(`data/${queryData.id}`, 'utf8',
          function(err, description) {
            var title = queryData.id;

            fs.readdir('./data', function(error, filelist) {
              var list = templateList(filelist)
              var template = templateHTML(
                title,
                list,
                `<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>
                 <a href="/update?id=${title}">update</a>
                 <form action="/delete_process" method="post" >
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
                 </form>`)
              response.writeHead(200); //파일을 성공적으로 전송했다.
              // console.log(__dirname + url);
              response.end(template);
              // response.end('nano : '+ url);
            });
          });
        }
      }else if (pathname === '/create') {
        fs.readdir('./data', function(error, filelist) {
          // console.log(filelist);
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = templateList(filelist);

          //Post 방식으로 Data전송
          var template = templateHTML(title, list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" value="" placeholder="title"></p>
              <p>
                <textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form> `,'')
          response.writeHead(200);
          response.end(template);
        });
      }
      else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function data(data) {
          body = body + data;
        });
        request.on('end', function () {
          var post = qs.parse(body);
          var title = post.title
          var description = post.description
          fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.writeHead(302, {location: `/?id=${title}`});
            response.end();
          })
        });

      }
      else if (pathname === '/update') {
        fs.readFile(`data/${queryData.id}`, 'utf8',
          function(err, description) {
            var title = queryData.id;

            fs.readdir('./data', function(error, filelist) {
              var list = templateList(filelist)
              var template = templateHTML(
                title,
                list,
                `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <p><input type="text" name="title" value="${title}"></p>
                  <p>
                    <textarea name="description" rows="8" cols="80">"${description}"</textarea>
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form>
                `,
                `<a href="/create">create</a><a href="/update?id=${title}">update</a>`)
              response.writeHead(200); //파일을 성공적으로 전송했다.
              // console.log(__dirname + url);
              response.end(template);
              // response.end('nano : '+ url);
            });
          });
      }
      else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function data(data) {
          body = body + data;
        });
        request.on('end', function () {
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title
          var description = post.description
          fs.rename(`data/${id}`, `data/${title}`, function (error) {
            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
              response.writeHead(302, {location: `/?id=${title}`});
              response.end();
            })
          })
        });
      }
      else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function data(data) {
          body = body + data;
        });
        request.on('end', function () {
          var post = qs.parse(body);
          var id = post.id;
          console.log(id);
          fs.unlink(`data/${id}`, function (error) {
            response.writeHead(302, {location: `/`});
            response.end();
          })


        });
      }
      else {
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);
