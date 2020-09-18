
daiFuKuan();
// 请求待付款数据
function daiFuKuan(global = false) {
  $.myAjax({
    global,
    url: '/order/list_unpay',
    success: res => {
      showDaiFuKuan(res);
    }
  });
}


// 封装一个待付款的方法
function showDaiFuKuan(orders) {
  $('.order-content2>.all-order').remove();
  if(orders.length === 0) {
    $('.order-content2>.empty').addClass('show');
  }else {
    $('.order-content2>.empty').removeClass('show');
    // 遍历渲染所有的订单
    orders.forEach(function(order, i) {
      var total = 0;
      $(`
        <div class='all-order' data-order-id='${order.orderId}'>
          <div class='order-product1'></div>
          <div class='order-account1'>
            共<span class='total'></span>件商品，总金额￥<span class='account'>${order.account}</span>.00
          </div>
          <div class='order-edit1'>
            <span class='delete'>删除订单</span>
            <span class="again-buy">再次购买</span>
          </div>
        </div>
      `).appendTo('.order-content2');
      // 渲染遍历订单中的所有商品信息
      order.details.forEach(product => {
        $(`
          <div class='img-wrap'><img src='${product.avatar}' /></div>
          <div class='product-name'>${product.name}</div>
          <div class='product-param'>
            <span class='price'>￥${product.price.toFixed(2)}</span>
            <span class='count'>x ${product.count}</span>
          </div>
        `).appendTo(`.order-product1:eq(${i})`);
        total += parseInt(product.count);
      });
      $(`.order-account1>span.total:eq(${i})`).text(total);
    });
  }
}



daiShouHuo();
// 请求待收货数据
function daiShouHuo(global = false) {
  $.myAjax({
    global,
    url: '/order/list_pay',
    success: res => {
      // console.log(res);
      showDaiShouHuo(res);
    }
  });
}


// 封装一个待收货的函数
function showDaiShouHuo(orders) {
  $('.order-content3>.all-order').remove();
  if(orders.length === 0) {
    $('.order-content3>.empty').addClass('show');
  }else {
    $('.order-content3>.empty').removeClass('show');
    // 遍历渲染所有的订单
    orders.forEach(function(order, i) {
      var total = 0;
      $(`
        <div class='all-order' data-order-id='${order.orderId}'>
          <div class='order-product2'></div>
          <div class='order-account2'>
            共<span class='total'></span>件商品，总金额￥<span class='account'>${order.account}</span>.00
          </div>
          <div class='order-edit2'>
            <span class='delete'>删除订单</span>
            <span class="green">已付款</span>
          </div>
        </div>
      `).appendTo('.order-content3');
      // 渲染遍历订单中的所有商品信息
      order.details.forEach(product => {
        $(`
          <div class='img-wrap'><img src='${product.avatar}' /></div>
          <div class='product-name'>${product.name}</div>
          <div class='product-param'>
            <span class='price'>￥${product.price.toFixed(2)}</span>
            <span class='count'>x ${product.count}</span>
          </div>
        `).appendTo(`.order-product2:eq(${i})`);
        total += parseInt(product.count);
      });
      $(`.order-account2>span.total:eq(${i})`).text(total);
    });
  }
}



allOrder(true);
// 请求全部订单数据
function allOrder(global = false) {
  $.myAjax({
    global,
    url: '/order/list_all',
    success: res => {
      validTime(res);
      showAllOrder(res);
    }
  });
}


// 定义一个方法用来渲染全部订单
function showAllOrder(orders) {
  $('.order-content1>.all-order').remove();
  if(orders.length === 0) {
    $('.order-content1>.empty').addClass('show');
  }else {
    $('.order-content1>.empty').removeClass('show');
  // 遍历渲染所有的订单
  orders.forEach(function(order, i) {
    var total = 0;
    $(`
      <div class='all-order' data-order-id='${order.orderId}'>
        <div class='order-product'></div>
        <div class='order-account'>
          共<span class='total'></span>件商品，总金额￥<span class='account'>${order.account}</span>.00
        </div>
        <div class='order-edit'>
          <span class='delete'>删除订单</span>
          ${order.pay === 0 ? '<span class="again-buy">再次购买</span>' : '<span class="green">已付款</span>'}
        </div>
      </div>
    `).appendTo('.order-content1');
    // 渲染遍历订单中的所有商品信息
    order.details.forEach(product => {
      $(`
        <div class='img-wrap'><img src='${product.avatar}' /></div>
        <div class='product-name'>${product.name}</div>
        <div class='product-param'>
          <span class='price'>￥${product.price.toFixed(2)}</span>
          <span class='count'>x ${product.count}</span>
        </div>
      `).appendTo(`.order-product:eq(${i})`);
      total += parseInt(product.count);
    });
    $(`.order-account>span.total:eq(${i})`).text(total);
  });
}
}






// 顶部的选项卡切换
(function() {
  $('.select-item>span').on('click', function() {
    if($(this).hasClass('show')) return;
    $(this)
      .addClass('show')
      .siblings('span.show')
      .removeClass('show');
    $('.order-content-wrap>div')
      .eq($(this).index())
      .addClass('show')
      .siblings('.show')
      .removeClass('show');
    if($(this).index() === 0) allOrder();
    if($(this).index() === 1) daiFuKuan();
    if($(this).index() === 2) daiShouHuo();
  });
})();




// 再次购买
(function() {
  $('.order-content-wrap').on('click', 'span.again-buy', function() {
    var orderId = $(this).closest('.all-order').attr('data-order-id');
    Cookies.set('orderId', orderId);
    window.location.href = '/pages/pay/pay.html';
  });
})();




// 删除功能
(function() {
  deleteOrder('.order-content1');
  deleteOrder('.order-content2');
  deleteOrder('.order-content3');
  function deleteOrder(content) {
    $(content).on('click', 'span.delete', function() {
      var orderNO = $(this).closest('.all-order').attr('data-order-id');
      $.confirm('确认删除此订单？', () => {
        $(content + `>.all-order`).remove();
        $.myAjax({
          global: false,
          url: '/order/remove/' + orderNO,
          success: res => {
            $.notice('删除成功！');
            allOrder();
            daiFuKuan();
            daiShouHuo();
            if($(content + `>.all-order`).length === 0) {
              $(content + `>.empty`).addClass('show');
            }
          }
        });
      });
    });
  }
})();



// 回退按钮
(function() {
  $('i.prev-back').on('click', function() {
    window.location.href = '/pages/profile/index.html'
  });
})();



// 删除过期的订单
var timer = null;
function validTime(res) {
  var order = res.filter(item => item.pay === 0);
  order.forEach(time1 => {
    var time = new Date(time1.orderTime).getTime() + 1800000;
    var nowTime = new Date().getTime(),
        invalidTime = time - nowTime;
    if(invalidTime <= 0) {
      $.myAjax({
        url: '/order/remove/' + time1.orderId,
        success: res => {} 
      });
    }
  });
}
