var orderNO = Cookies.get('orderNO');
var orderId = Cookies.get('orderId');
// 请求数据渲染订单总金额
if(orderNO) {
  Cookies.remove('orderNO');
  showAllAccount(orderNO);
  showValidTime(orderNO);
  showButtonPay(orderNO);
}
// 再次购买
if(orderId) {
  Cookies.remove('orderId');
  showAllAccount(orderId);
  showValidTime(orderId);
  showButtonPay(orderId);
}

// 封装一个请求订单总金额的渲染
function showAllAccount(orderIdNO) {
  $.myAjax({
    url: '/order/account/' + orderIdNO,
    success: account => {
      $('span.account').text(account);
      $('button.btn-pay>span').text(account);
    }
  });
}


// 封装一个订单的有效时间请求
function showValidTime(orderId) {
  $.myAjax({
    url: '/order/list_all',
    success: res => {
      var time = res.filter(item => item.orderId === orderId)[0].orderTime;
      // 设置有效时间是30分钟
      time = new Date(time).getTime() + 1800000;
      validTime(time);  // 渲染订单有效时间
    }
  });
}





// 切换支付方式
(function() {
  $('.pay-alipay').on('click', function() {
    if($(this).find('i.checkbox').hasClass('check')) return;
    $(this)
      .attr('data-pay', $(this).find('i.checkbox').hasClass('check') ? '0' : '1')
      .find('i.checkbox').addClass('check');
    $('.pay-mipay')
    .attr('data-pay', $(this).find('i.checkbox').hasClass('check') ? '0' : '1')
      .find('i.check').removeClass('check');
  });
  $('.pay-mipay').on('click', function() {
    if($(this).find('i.checkbox').hasClass('check')) return;
    $(this)
      .attr('data-pay', $(this).find('i.checkbox').hasClass('check') ? '0' : '1')
      .find('i.checkbox').addClass('check');
    $('.pay-alipay')
      .attr('data-pay', $(this).find('i.checkbox').hasClass('check') ? '0' : '1')
      .find('i.check').removeClass('check');
  });
})();


// 确认支付
function showButtonPay(orderIdNO) {
  $('button.btn-pay').on('click', function() {
    $.confirm('确认支付?', function() {
      $.myAjax({
        url: '/order/pay/' + orderIdNO,
        success: res => {
          window.location.replace('/pages/order_page/index.html');
        }
      });
    });
  });
};


// 设置一个订单有效时间
var timer = null;
function validTime(time) {
  timer = setInterval(() => {
    var nowTime = new Date().getTime(),
        validTime = time - nowTime;
    if(validTime > 0) {
      var minute = Math.floor(validTime / 1000 / 60) ;
      var second = Math.floor(validTime / 1000 % 60);
      minute = minute > 9 ? minute : '0' + minute;
      second = second > 9 ? second : '0' + second;
      $('time.valid-time').text(minute + ':' + second);
    }else {
      clearInterval(timer);
      $.confirm('订单已失效，请重新下单', function() {
        window.location.replace('/pages/home/index.html');
      }, function() {
        var ordId = orderNO || orderId;
        $.myAjax({
          url: '/order/remove/' + ordId,
          success: res => {
            window.location.replace('/pages/order_page/index.html');
          } 
        });
      });
    }
  }, 1000);
}

// 回退到我的订单
(function() {
  $('i.prev-back').on('click', function() {
    window.location.replace('/pages/order_page/index.html');
  });
})();

