
if(sessionStorage.getItem('token')) {
  $('.cart-list').addClass('show');
  myAjax(true);
} else {
  $('.cart-list').removeClass('show');
  $('.cart-empty').addClass('show');
}

// 定义一个方法用来获取购物车信息
function myAjax(global = false) {
  $.myAjax({
    global,
    url: '/cart/list',
    type: 'post',
    success: data => {
      if(data.length === 0) {
        $('.cart-empty').addClass('show');
        $('.cart-list').removeClass('show');
      }
      showProductList(data);
      showProductEdit(data);
      showTotalAccount();
    }
  });
};




// 定义一个方法用来渲染商品列表
function showProductList(data) {
  // 先清空再渲染，为了后面的总数量与总价格的渲染
  $('.list-info').empty();
  $(data).each((i, product) => {
    $(`
      <div class='product-info' data-price='${product.price}' data-count='${product.count}' data-check='1' data-id='${product.id}'>
        <div class='product-wrapper'>
          <i class='checkbox check'></i>
          <div class='list-product'>
            <div class='img-wrap'><img src='${product.avatar}' /></div>
            <div class='font-wrap'>
              <h3>${product.name}</h3>
              <div class='price-count'>
                <span class='price'>￥${product.price.toFixed(2)}</span>
                <div class='decrease-increase'>
                  <span class='decrease'>-</span>
                  <span class='count'>${product.count}</span>
                  <span class='increase'>+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='service'>
          <div><span>服务</span>安装服务|延长保障</div>
          <span>选服务</span>
        </div>
      </div>
    `).appendTo('.list-info');
  });
}


// 渲染编辑状态下的商品列表
function showProductEdit(data) {
  $('.edit-info').empty();
  $(data).each((i, product) => {
    $(`
      <div class='product-info' data-price='${product.price}' data-count='${product.count}' data-check='0' data-id='${product.id}'>
        <div class='product-wrapper'>
          <i class='checkbox'></i>
          <div class='list-product'>
            <div class='img-wrap'><img src='${product.avatar}' /></div>
            <div class='font-wrap'>
              <h3>${product.name}</h3>
              <div class='price-count'>
                <span class='price'>￥${product.price.toFixed(2)}</span>
                <div class='decrease-increase'>
                  <span class='decrease'>-</span>
                  <span class='count'>${product.count}</span>
                  <span class='increase'>+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='service'>
          <div><span>服务</span>安装服务|延长保障</div>
          <span>选服务</span>
        </div>
      </div>
    `).appendTo('.edit-info');
  });
}





// 点击编辑按钮
(function() {
  $('.cart-list').on('click', 'span.edit', function() {
    // 切换状态
    $(this).closest('.cart-list').removeClass('show');
    $('.cart-edit').addClass('show');
    $('.cart-list-top>span').text('完成');
    // 删除状态下永久是未选中
    $('.edit-info>.product-info').attr('data-check', '0');
    $('.edit-info>.product-info').find('i.checkbox').removeClass('check');
    $('i.checkall-edit.all').removeClass('check');
  });
  $('.cart-edit').on('click', 'span.edit', function() {
    $(this).closest('.cart-edit').removeClass('show');
    $('.cart-list').addClass('show');
    $('.cart-list-top>span').text('编辑');
  });
  // 顶部切换编辑状态
  // $('.cart-list-top>span').on('click', function() {
    // 需要1.8.2版本
  //   $(this).toggle();
  // });
})();


// 点击删除按钮
(function() {
  // 全选联动单选
  $('.edit-all').on('click', function() {
    $(this).find('i.checkall-edit.all').toggleClass('check');
    $('.edit-info>.product-info')
      .attr('data-check',$(this).find('i.checkall-edit.all').hasClass('check') ? "1" : "0" )
      .find('i.checkbox')
      .toggleClass("check", $(this).find('i.checkall-edit.all').hasClass('check'));
  });
  // 单选联动全选
  $('.edit-info').on('click', 'i.checkbox', function() {
    $(this).closest('.product-info')
      .attr('data-check', $(this).hasClass('check') ? '0' : '1')
      .end()
      .toggleClass('check');
    // 全选切换，根据data-check的值有没有0
    $('i.checkall-edit.all').toggleClass('check', $('.edit-info>.product-info[data-check="0"]').length === 0);
  });
  // 删除
  $('button.btn-delete').on('click', function() {
    var ids = [];
    $('.edit-info>.product-info[data-check=1]').each((i, item) => {
      ids.push(parseInt(item.dataset.id));
    });
    if(ids.length === 0) {
      $.notice('请选择需要删除的商品~');
    }else {
      $.confirm('请确认删除？', function() {
        $.myAjax({
          global: false,
          url: '/cart/remove',
          type: 'post',
          data: {
            ids
          },
          success: res => {
            myAjax();
          }
        });
      });
    }
  });
})();




// 回退上个页面
(function() {
  $('i.prev-back').on('click', function() {
    if(Cookies.get('fromDetailPage')) {
      var fromDetailPage = Cookies.get('fromDetailPage');
      Cookies.remove('fromDetailPage');
      window.location.href = fromDetailPage;
      return;
    }
    window.location.href = '/pages/home/index.html';
  });
})();



// 顶部的显示与隐藏
(function() {
  $('.scroll').on('scroll', function() {
    $(this).scrollTop() > 80 ? $('.cart-list-top').addClass('show') : $('.cart-list-top').removeClass('show');
  })
})();



// 结算按钮
(function() {
  var productId = [];
  $('button.btn-settle').on('click', function() {
    // 存入选中的购物记录的id值
    $('.list-info>.product-info').each((i, product) => {
      if(product.dataset.check === '1') {
        productId.push(parseInt(product.dataset.id));
      }
    });
    if($('.list-info>.product-info[data-check=1]').length  === 0) 
      return $.notice('请选择购买的商品哟~');
    Cookies.remove('fromDetailPage');
    sessionStorage.setItem('ids', JSON.stringify(productId));
    window.location.href = '/pages/order_confirm/index.html';
  })
})();



// 数量的加减
(function() {
  // 加
  $('.list-content').on('click', 'span.increase', function() {
    if($(this).prev().text() === '20') {
      $.notice('商品数量以达到最大了哟~');
      return;
    }
    // 获取购物车列表商品id
    var $id = $(this).closest('.product-info').attr('data-id');
    // 根据商品id进行数量的增减
    $.myAjax({
      global: false,
      url: '/cart/increase/' + $id,
      type: 'post',
      success: res => {
        myAjax();
      }
    });
  });
  // 减
  $('.list-content').on('click', 'span.decrease', function() {
    if($(this).next().text() === '1') {
      $.notice('商品数量以达到最小了哟~');
      return;
    }
    // 获取购物车列表商品id
    var $id = $(this).closest('.product-info').attr('data-id');
    // 根据商品id进行数量的增减
    $.myAjax({
      global: false,
      url: '/cart/decrease/' + $id,
      type: 'post',
      success: res => {
        myAjax();
      }
    });
  });
})();



// 全选、单选点击事件
(function() {
  // 全选联动单选
  $('.list-all').on('click', function() {
    $(this)
      .find('i.checkall.all')
      .toggleClass('check');
    $('.list-info>.product-info')
      .attr('data-check', $(this).find('i.checkall.all').hasClass('check') ? "1" : "0" )
      .find('i.checkbox')
      .toggleClass("check", $(this).find('i.checkall.all').hasClass('check'));
    showTotalAccount();
  });
  // 单选联动全选
  $('.list-info').on('click', 'i.checkbox', function() {
    $(this).closest('.product-info')
      .attr('data-check', $(this).hasClass('check') ? '0' : '1')
      .end()
      .toggleClass('check');
    // 全选切换，根据data-check的值有没有0
    $('i.checkall.all').toggleClass('check', $('.list-info>.product-info[data-check="0"]').length === 0);
    showTotalAccount();
  });
})();


// 定义一个方法用来显示总数量与总价格
function showTotalAccount() {
  var account = 0,
      total = 0;
  $('.product-info').each((i, div) => {
    // 判断是否选中
    if(div.dataset.check === '1') {
      total += parseInt(div.dataset.count);
      account += parseInt(div.dataset.count) * div.dataset.price;
    }
    
  })
  $('.list-account>span').text(`￥${account.toFixed(2)}`);
  $('button.btn-settle>span.count').text(total);
}

