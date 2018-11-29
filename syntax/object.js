var member = ['nano', 'k8805', 'hoya']
console.log(member[1]);

var i = 0;
while (i < member.length) {
  console.log('array loop:', member[i]);
  i = i + 1;
}

var roles = {
  'programer':"nano",
  'designer':'k8805',
  'manager':'hoya'
}

console.log(roles.manager);
console.log(roles['manager']);


for (var name in roles) {
  console.log( 'object: ', name, 'object value: ', roles[name]);
}
