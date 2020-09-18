var token = sessionStorage.getItem('token');

// 调用渲染
isLogin();
// 定义一个方法用来渲染是否登录
function isLogin() {
  // 判断登没登陆
  token = sessionStorage.getItem('token');
  $('.page-header>.empty').toggleClass('show', token ? false : true);
  $('.page-header>.login').toggleClass('show', token ? true : false);
  $('span.exit').toggleClass('show', token ? true : false);
  // 显示用户名
  if(token) {
    $('span.user').text(Cookies.get('user'));
  }
}

// 点击登录/退出
(function() {
  // 登录
  $('.page-header>.empty').on('click', function() {
    Cookies.set('fromProfile', window.location.href);
    window.location.href = '/pages/login/index.html';
  });
  // 退出
  $('span.exit').on('click', function() {
    $.notice('退出成功');
    sessionStorage.removeItem('token');
    isLogin();
  });
})();


// 点击我的订单
(function() {
  $('.order').on('click', function() {
    if(token) {
      window.location.href = '/pages/order_page/index.html';
    }else {
      Cookies.set('fromOrderPage', '/pages/order_page/index.html');
      window.location.href = '/pages/login/index.html';
    }
  });
})();


// 点击地址管理
(function() {
  var token = sessionStorage.getItem('token');
  $('.address').on('click', function() {
    console.log(!token);
    // 判断用户等没登录
    if(!token) {
      Cookies.set('fromProfile', window.location.href);
      window.location.href = '/pages/login/index.html';
      return;
    };
    window.location.href = '/pages/address/index.html';
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

