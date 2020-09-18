


var lock = false;  // 定义一个标志变量，需不需要跳转主页

// 切换登录方式
(function() {
  // 账号密码登录切换手机登录
  $('.login-user>form>label>input.btn-toggle').on('click', function() {
    $(this).closest('.login-user').removeClass('show').closest('.login-user').next().addClass('show');
  })
  // 手机登录切换账号密码登录
  $('.login-phone>form>label>input.btn-toggle').on('click', function() {
    $(this).closest('.login-phone').removeClass('show').closest('.login-phone').prev().addClass('show');
  })
})();



// 登录按钮
(function() {
  // 账号密码登录
  $('.login-user>form>label>input.btn-login').on('click', function() {
    var name = $('.login-user>form>label>input.user').val().trim(),
        pwd = parseInt($('.login-user>form>label>input.pwd').val());
    $.myAjax({
      global: false,
      type: 'post',
      url: '/user/login_pwd',
      data: {
        name,
        pwd
      },
      success: res => {
        Cookies.set('user', name);
        sessionStorage.setItem('token', res);
        fromWhichpage('fromDetailPage');
        fromWhichpage('fromProfile');
        fromWhichpage('fromOrderPage');
        if(!lock) {
          window.location.replace('/pages/home/index.html');
        }
      }
    });
  });
  // 手机登录
  $('.login-phone').on('click', 'input.btn-login', function() {
    var $phone = parseInt($('.login-phone').find('input.user').val().trim()),
        $pwd = $('.login-phone').find('input.pwd').val().trim(),
        $code = $('.login-phone').find('span.code').text(),
        phoneLength = /^1\d{10}$/;
    if(!phoneLength.test($phone)) {
      $.notice('请正确的输入手机号~');
      return;
    }
    if($pwd !== $code) {
      $.notice('验证码错误~');
      return;
    }
    $.myAjax({
      global: false,
      url: '/user/login_phone',
      type: 'post',
      data: {
        phone: $phone,
      },
      success: res => {
        Cookies.set('user', name);
        sessionStorage.setItem('token', res);
        fromWhichpage('fromDetailPage');
        fromWhichpage('fromProfile');
        fromWhichpage('fromOrderPage');
        if(!lock) {
          window.location.replace('/pages/home/index.html');
        }
      }
    });
  })
})();




// 随机验证码
(function() {
  var codes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      codeStr = '';
  for(var i = 1; i < 5; i++) {
    codeStr += Math.floor(Math.random() * codes.length)
  }
  $('.login-phone span.code').text(codeStr);
  $('.login-phone span.code').on('click', function() {
    codeStr = '';
    for(var i = 1; i < 5; i++) {
      codeStr += Math.floor(Math.random() * codes.length)
    }
    $('.login-phone span.code').text(codeStr);
  });
})();



// 判断从哪个页面进来的
function fromWhichpage(page) {
  if(Cookies.get(page)) {
    var backPage = Cookies.get(page);
    Cookies.remove(page);
    setTimeout(() => {
      window.location.replace(backPage);
    },2000);
    return lock = true;
  }
}