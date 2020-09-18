// 轮播图
(function() {
  new Swiper('.swiper-container', {
    loop: true,   // 是否无缝
    grabCursor: true,
    autoplay: {   // 自动播放
      delay: 5000,   // 切换间隔时间
      disableOnInteraction: false,  // 用户操作完可以自动轮播
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,   // 点击指示器可以切换
    },
  });
})();


// 获取购物车中的总数量
(function() {
  if(sessionStorage.getItem('token')) {
    $.myAjax({
      url: '/cart/total',
      success: res => {
        $('ul.nav>li>a>b').text(res);
      }
    });
  }

})();

