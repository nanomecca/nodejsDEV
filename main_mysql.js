var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var template = require('./lib/template.js');

var path = require('path'); //path 경로를 보안

var sanitizeHtml = require('sanitize-html'); //출력보안 NPM Package

var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'nano_db'
})

db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
      if (queryData.id === undefined) {
        // var datalist = './data';
        db.query(`SELECT * FROM topic`, function(error,topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.html(
          title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`,);

        response.writeHead(200);
        response.end(html);
        });
      } else {

          db.query(`SELECT * FROM topic`, function(error,topics){
            if(error){
              throw error;
            }
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id],function(error2,topic){
              if(error2){
                throw error2;
              }
              var title = topic[0].title;
              var description = topic[0].description;
              var list = template.list(topics);
              var html = template.html(
                title, list,
                `<h2>${title}</h2>
                ${description}
                <p>by ${topic[0].name}</p>`,
                `<a href="/create">create</a>
                <a href="/update?id=${queryData.id}">update</a>
                <form action="/delete_process" method="post" >
                  <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                 </form>`
              );
              response.writeHead(200);
              response.end(html);
            })
          });
        }
      }else if (pathname === '/create') {
          db.query(`SELECT * FROM topic`, function(error,topics){
            if(error){
              throw error;
            }
            db.query(`SELECT * FROM author`, function (error2,get_author) {
              if (error2) {
                throw error;
              }
              console.log('create:', get_author);
              var title = 'Create';
              var description = 'Hello, Node.js';
              var list = template.list(topics);
              var html = template.html(title, list,
                `
                <form action="/create_process" method="post">
                  <p><input type="text" name="title" value="" placeholder="title"></p>
                  <p>
                    <textarea name="description" rows="8" cols="80" placeholder="description"></textarea>
                  </p>
                  <p>
                    ${template.authorSelect(get_author)}
                  </p>
                  <p>
                    <input type="submit">
                  </p>
                </form> `,'');
              response.writeHead(200);
              response.end(html);
            })

          });
      }
      else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function data(data) {
          body = body + data;
        });
        request.on('end', function () {
          var post = qs.parse(body);
          // var title = post.title
          // var description = post.description
          console.log(post.author);
          db.query(`
            INSERT INTO topic (title, description, created, author_id)
              VALUE (?, ?, NOW(), ?)`,
              [post.title, post.description, post.author],
              function (error, result) {
                if(error){
                  throw error;
                }
                response.writeHead(302, {location: `/?id=${result.insertId}`});  //insertId insert한 row의 ID값을 가져온다.
                response.end();
              }
            )
        });

      }
      else if (pathname === '/update') {
        var filteredid = path.parse(queryData.id).base;

            db.query(`SELECT * FROM topic`, function (error, topics) {
                if(error){
                  throw error;
                }
                db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id],function (error,u_topic) {
                  if (error){
                    throw error;
                  }
                  db.query(`SELECT * FROM author`,function (error, u_author) {
                    if(error){
                      throw error;
                    }
                    var id = u_topic[0].id;
                    var title = u_topic[0].title;
                    var description = u_topic[0].description;
                    var list = template.list(topics);
                    var html = template.html(
                      title,
                      list,
                      `
                      <form action="/update_process" method="post">
                      <input type="hidden" name="id" value="${id}">
                      <p><input type="text" name="title" value="${title}"></p>
                      <p>
                      <textarea name="description" rows="8" cols="80">${description}</textarea>
                      </p>
                      <p>
                        ${template.authorSelect(u_author,u_topic[0].author_id)}
                      </p>
                      <p>
                      <input type="submit">
                      </p>
                      </form>
                      `,
                      `<a href="/create">create</a><a href="/update?id=${id}">update</a>`)
                      response.writeHead(200); //파일을 성공적으로 전송했다.
                      response.end(html);
                  })

                });
              });
      }
      else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function data(data) {
          body = body + data;
          console.log('body:',body);
        });
        request.on('end', function () {
          var post = qs.parse(body);
          console.log('post:', post);
          var id = post.id;
          var title = post.title;
          var description = post.description;


          db.query(`
            UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
            [title, description, post.author, id],
            function (error,result) {
              if (error) {
                throw error;
              }
              response.writeHead(302, {location: `/?id=${id}`});
              response.end();
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

          db.query(`DELETE FROM topic WHERE id=?`,
            [id],function (error,resulet) {
              if(error){
                throw error;
              }
              response.writeHead(302, {location: `/`});
              response.end();
            });
        });
      }
      else {
      response.writeHead(404);
      response.end('Not Found');
    }

});
app.listen(3000);
