var q = {
  v1: 'v1',
  v2: 'v2',
  f1:function () {
    console.log(this.v1);
  },
  f2:function () {
    console.log(this.v2);
  }
}

q.f1();
q.f2();


//함수가 객체 내의 값을 참조할 경울 "this"로 객채내의 값을 참조
