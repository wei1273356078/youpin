// 获取商品id
var pid = parseInt(window.location.search.slice(window.location.search.indexOf('=') + 1)),
    scroll = null,
    productCount = 1,
    token = sessionStorage.getItem('token');

// 请求数据
$.myAjax({
  url: '/product/model/' + pid,
  success: data => {
    showBannerImage(data.bannerImgs);
    showInfoContent(data);
    showProductCount(data);
    initOrRefreshScroll();
  }
});


// 初始化或刷新滚动
function initOrRefreshScroll() {
  imagesLoaded($('.scroll')[0], () => {   // 保证滚动区域图加载完毕
    setTimeout(() => {                    // 保证滚动区域图片渲染完毕
      if(scroll === null) {
        scroll = new IScroll($('.scroll')[0], {
          deceleration: 0.003,
          bounce: true,
          click: true,
          probeType: 3,
        });
        scroll.on('scroll', function() {
          // 头部显示隐藏
          var a = Math.abs(this.y) / 300;
          if(a <= 1) {
            $('.detail-header>.more>a').addClass('show');
            $('.detail-header>.more>i').addClass('show');
            $('.detail-header>.more').removeClass('show');
            $('.detail-header>.more>.info-font').removeClass('show');
          }else {
            $('.detail-header>.more>a').removeClass('show');
            $('.detail-header>.more>i').removeClass('show');
            $('.detail-header>.more').addClass('show');
            $('.detail-header>.more>.info-font').addClass('show');
          }
          $('.detail-header>.left-right').toggle(a <= 1);
          $('.detail-header>.more-wrap').toggle(a >= 1);
          // 判断头部显示哪一个
          if($('.part-top').eq(2).offset().top < 48) {
            $('.info-font>span').eq(2).addClass('show').siblings('.show').removeClass('show');
          }else if($('.part-top').eq(1).offset().top < 48) {
            $('.info-font>span').eq(1).addClass('show').siblings('.show').removeClass('show');
          }else {
            $('.info-font>span').eq(0).addClass('show').siblings('.show').removeClass('show');
          }
        });
      }
      new IScroll($('.scroll1')[0], {
        deceleration: 0.003,
        scrollY: false,
        scrollX: true,
        bounce: true,
        click: true,
        probeType: 2,
      })
    }, 20);
  })
}

// 封装一个方法用来渲染轮播图
function showBannerImage(images) {
  var image = images.split(',');
  image.forEach(image => {
  $(`
    <div class="swiper-slide"><img src='${image}' /></div>
  `).appendTo('.swiper-wrapper');    
  });
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
}



// 封装一个方法用来渲染信息
function showInfoContent(data) {
  // 渲染content-top
  $(`
    <div>
      <div class='price'>
        <span>￥${data.price}</span>
        <img src='/images/detail/icon_product_unfavor.png' />
      </div>
      <div class='name'>
        <img src='/images/detail/tag_self.png' />
        <span>${data.name}</span>
      </div>
      <p class='ellipsis'>${data.brief}</p>
      <span class='rate'>评论：${data.rate}</span>
      <span class='sale'>销量：${data.sale}</span>
    </div>
    <div class='new-gift'><img src='/images/detail/new_gift.png' /></div>
  `).appendTo('.content-top');

  // 渲染content-bottom
  var images = data.otherImgs.split(',');
  // console.log(images);
  images.forEach(image => {
    $(`
      <img src='${image}' />
    `).appendTo('.content-bottom');
  });
}



// 渲染product-count信息
function showProductCount(product) {
  $(`
    <div class='masking-price'>
      <div class='img-wrap'><img src='${product.avatar}' /></div>
      <div class='font-wrap'>
        <p>￥<span>${product.price}</span></p>
        <div>已选：<span class='account'>1</span>件</div>
      </div>
    </div>
    <div class='masking-number'>
      <span>数量</span>
      <div>
        <span class='decrease'>-</span>
        <span class='count'>1</span>
        <span class='increase'>+</span>
      </div>
    </div>
    <div class='masking-buy'>
      <span class='ok'>确认</span>
    </div>
  `).appendTo('.masking-count>.masking-content');
}



// 封装一个方法用来渲染数量
function showCount() {
  var $count = $('.masking-number>div>span.count').text();
  $('.product-count>.p-c>.p-c-left>span.count').text($count+'件');
  $('.masking-price>.font-wrap>div>span.account').text($count);
};



// 加减商品数量
(function() {
  // 加
  $('.masking-count').on('click', 'span.increase', function() {
    if($('.masking-number>div>span.count').text() === '20') {
      $.notice('已达到购买最大数量~~');
      return;
    }
    $('.masking-number>div>span.count').text(++productCount);
    showCount();
  });
  // 减
  $('.masking-count').on('click', 'span.decrease', function() {
    if($('.masking-number>div>span.count').text() === '1') return;
    $('.masking-number>div>span.count').text(--productCount);
    showCount();
  });
  // 点击确认
  $('.masking-count').on('click', 'span.ok', function() {
    $('.masking-count').slideUp(300);
  });
})();




// 点击加入购物车
(function() {
  $('.detail-nav>.nav-buy>.add-cart').on('click', function() {
    if(token === null) {
      Cookies.set('fromDetailPage', window.location.href);
      window.location.href = '/pages/login/index.html';
      return;
    }
    $.myAjax({
      global: false,
      url: '/cart/add',
      type: 'post',
      data: {
        pid,
        count: productCount
      },
      success: res => {
        $.notice('加入购物车成功~~');
        addCartCount();
      }
    });
  });
})();





// 点击购买
(function() {
  $('.nav-buy>span.buy').on('click', function() {
    // 判断当前用户是否登录状态
    if(token === null) {
      Cookies.set('fromDetailPage', window.location.href);
      window.location.href = '/pages/login/index.html';
      return;
    }
    Cookies.set('fromDetailPage', window.location.href);
    window.location.href = '/pages/cart/index.html';
  });
})();







// 点击购物车
(function() {
  $('.nav-cart').on('click', function() {
    Cookies.set('fromDetailPage', window.location.href);
    window.location.href = '/pages/cart/index.html';
  });
})();




// 点击顶部font 
(function() {
  $(`.info-font>span:eq(0)`).on('click', function() {
    $(this).addClass('show').siblings('.show').removeClass('show');
    // scroll.scrollToElement($('.part-top').eq($(this).index())[0], 400)
    scroll.scrollTo(0, -370, 400)
  });
  $(`.info-font>span:eq(1)`).on('click', function() {
    $(this).addClass('show').siblings('.show').removeClass('show');
    scroll.scrollTo(0, -753, 400)
  });
  $(`.info-font>span:eq(2)`).on('click', function() {
    $(this).addClass('show').siblings('.show').removeClass('show');
    scroll.scrollTo(0, -1112, 400)
  });
})();




// 点击选择项商品
(function() {
  // 点击product-count弹出蒙版
  $('.product-count').on('click', function() {
    // console.log(123);
    $('.masking-count').slideDown(300);
  });
  // 点击masking的叉，取消蒙版
  $('.masking-count>.masking-content>i').on('click', function() {
    $('.masking-count').slideUp(300);
  });
})();


addCartCount();
// 获取购物车中的总数量
function addCartCount() {
  if(sessionStorage.getItem('token')) {
    $.myAjax({
      global: false,
      url: '/cart/total',
      success: res => {
        $('.nav-cart>b').text(res);
      }
    });
  }
}

