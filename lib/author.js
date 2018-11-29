var db = require('./db');
var template = require('./template');
exports.home = function(request, response){//복수로 export
  db.query(`SELECT * FROM topic`, function(error,topics){
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(topics);
  var html = template.html(
    title, list,
    `<table>

    </table>
    `,
    `<a href="/create">11create</a>`,);

  response.writeHead(200);
  response.end(html);
  });
}
