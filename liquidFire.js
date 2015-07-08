LiquidFire.map(function(){
  this.transition(
 /*   this.fromRoute('user.1.clients'),
    this.toRoute('user.a.client.1'),
   */  this.use('toLeft'),
    this.reverse('toRight')
  );
});