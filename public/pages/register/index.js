
// 表单插件的使用
var login = $('form.login').Validform({
  tiptype: 3,
  datatype: {
    userName: function(gets, obj, curform) {
      var reg = /^([\u4E00-\u9FA5]|\w){1,8}$/;
      if(!reg.test(gets)) return false;
      var result;
      $.ajax({
        async: false,
        global: false,
        type: 'get',
        url: '/user/check_name/' + gets,
        success: function(response) {
          if(response.code === 200) {
            result = response.data === 0 ? true : '用户名已存在';
          }else {
            result = response.msg;
          }
        },
        error: function() {
          result = '服务器验证失败';
        }
      });
      return result;
    }
  }
});




// 点击注册
(function() {
  $('input.btn-login').on('click', function() {
    if(login.check(false)) {
      var name = $('input.user').val().trim(),
          pwd = parseInt($('input.pwd').val()),
          phone = parseInt($('input.phone').val());
      $.myAjax({
        url: '/user/register',
        type: 'post',
        data: {
          name,
          pwd,
          phone
        },
        success: res => {
          $.notice('注册成功');
          window.location.href = '/pages/login/index.html';
        }
      });
    }
  });
})();


// 点击登录
(function() {
  $('input.btn-toggle').on('click', function() {
    window.location.href = '/pages/login/index.html';
  });
})();

