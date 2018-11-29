module.exports = {
  html:function (title, list, body, control) {
    return`<!doctype html>
    <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function (topics) {
    var list = '<ul>';
    var i = 0;
    while (i < topics.length) {
      // console.log(topics[i]);
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
      // console.log(list);
    }
    return list = list + '</ul>';
    return list
  },
  authorSelect:function (get_author,author_id) {
    var tag = '';
    var i = 0;
    while (i < get_author.length) {
      var selected = '';
      if (get_author[i].id === author_id) {
        selected = 'seletecd';
      }
      tag += `<option value="${get_author[i].id}" ${selected}>${get_author[i].name}</option>`
      i++;
  };
  return `
  <select name="author">
    ${tag}
  </select>
  ` 
  },
}



// module.exports = template;
