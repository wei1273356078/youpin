var ids = JSON.parse(sessionStorage.getItem('ids')),  // 购物记录id
    id = 0,  // 保存地址id
    account = 0; // 订单的总金额

// 请求订单信息
$.myAjax({
  url: '/cart/list_ids',
  type: 'post',
  data: {
    ids
  },
  success: res => {
    showOrderProduct(res);
  }
});



// 请求地址信息
// 判断渲染哪个收货地址
if(Cookies.get('addressId')) {
  id = Cookies.get('addressId');
  Cookies.remove('addressId');
  $.myAjax({
    url: '/address/model/' + id,
    success: res => {
      showReceiveAddress(res);
    }
  });
}else {
  $.myAjax({
    url: '/address/get_default',
    success: res => {
      id = res.id;
      showReceiveAddress(res);
    }
  });
}



// 定义一个方法用来渲染收货地址
function showReceiveAddress(data) {
  $(`
    <div>
      <div>
        <span>${data.receiveName}</span>
        <span>${data.receivePhone}</span>
      </div>
      <p>${data.receiveRegion} ${data.receiveDetail}</p>
    </div>
    <i class='iconfont icon-arrow-right'></i>
  `).appendTo('.order-address');
}


// 点击地址管理
(function() {
  $('.order-address').on('click', function() {
    Cookies.set('orderAddress',window.location.href);
    window.location.href = '/pages/address/index.html';
  });
})();


// 定义一个方法用来渲染订单信息
function showOrderProduct(data) {
  data.forEach(product => {
    $(`
      <div class='product-wrapper' data-price='${product.price}' data-count='${product.count}'>
        <div class='img-wrap'>
          <img src='${product.avatar}' />
        </div>
        <div class='product-info'>
          <h4>${product.name}</h4>
          <div>
            <span class='price'>￥${product.price}</span>
            <span>x ${product.count}</span>
          </div>
          <span>7天无理由退货</span>
        </div>
      </div>
    `).appendTo('.order-product>.product');
  });
  showAccount();
}


// 定义一个方法用来渲染总价格
function showAccount() {
  $('.product-wrapper').each((i, price) => {
    account += parseInt(price.dataset.count) * price.dataset.price;
  });
  $('.all-price').text(account.toFixed(2));
}


// 提交订单
(function() {
  $('button.submit-order').on('click', function() {
    sessionStorage.removeItem('ids');
    $.myAjax({
      url: '/order/confirm',
      type: 'post',
      data: {
        ids,
        account,
        addressId: id
      },
      success: res => {
        Cookies.set('orderNO', res);
        window.location.replace('/pages/pay/pay.html');
      }
    });
  });
})();



// 顶部的显示与隐藏
(function() {
  $('.scroll').on('scroll', function() {
    $('.order-top').toggleClass('show', $(this).scrollTop() > 60);
  });
})();



// 回退购物车
(function() {
  $('.prev-back').on('click', function() {
    sessionStorage.removeItem('ids');
    window.location.replace('/pages/cart/index.html');
  });
})();

