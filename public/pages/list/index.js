var cid = parseInt(window.location.search.slice(window.location.search.lastIndexOf('=') + 1)),
    searchName = '',      // 表示当前用户输入的搜索关键字
    pageSize = 6,         // 每次向服务器拿取多少条数据
    orderDir = 'asc',     // 表示当前排序方向是升序
    orderCol = 'price',   // 表示当前排序列是price
    isLoading = false,    // 标识当前是否处于ajax交互
    scroll = null,        // 保存滚动对象
    hasMore = true;       // 标识按当前条件查找商品还有没有更多

// 返回顶部功能实现
(function() {
  $('i.rocket').on('click', function() {
    if(scroll) scroll.scrollTo(0, 0, 400);
    $(this).hide();
  });
})();

// 显示模式切换
(function() {
  $('i.show-mode').on('click', function() {
    $(this).toggleClass('icon-card icon-list');
    $('ul.product-list').toggleClass('list card');
    initOrRefreshScroll();
  });
})();

// 切换排序方向
(function() {
  $('i.order-dir').on('click', function() {
    if(isLoading) { 
      $.notice('您的操作太频繁了。。');
      return;
    };
    $(this).toggleClass('icon-sort-asc icon-sort-desc');
    orderDir = orderDir === 'asc' ? 'desc' : 'asc';
    updateProductList();
  });
})();

// 切换排序的列
(function() {
  $('span.order-col').on('click', function() {if(isLoading) { 
    $.notice('您的操作太频繁了。。');
      return;
    };
    if($(this).hasClass('active')) return;
    $(this).addClass('active').siblings('.active').removeClass('active');
    orderCol = $(this).attr('data-order-col');
    updateProductList();
  });
})();

updateProductList();

// 定义一个方法用来请求数据和渲染的
function updateProductList(isLoadMore = false) {
  isLoading = true;                        // 进入loading状态
  if(!isLoadMore) {
    $('i.rocket').hide();                  // 如果不是加载更多，请求一批新的数据，返回顶部的火箭重置为不显示，因为用户重头开始看的
    $('ul.product-list').empty();          // 如果不是加载更多，清空ul.product-list
    if(scroll) scroll.scrollTo(0, 0, 0);   // 如果不是加载更多请求一批新的数据，要让scroll重置回顶部，重头开始看
  }
  $('p.info').text('加载中...');           // 更新p.info显示文本
  // 请求数据
  setTimeout(() => {
    $.myAjax({
      global: false,
      type: 'post',
      url: '/product/list',
      data: {
        name: searchName,
        cid,
        orderDir,
        orderCol,
        pageSize,
        begin: $('ul.product-list>li').length
      },
      success: data => {
        isLoading = false;   // 结束loading状态
        hasMore = data.length === pageSize;   // 更新全局变量hasMore
        data.forEach(product => showProduct(product));
        initOrRefreshScroll();   // 初始化或更新scroll
        if(data.length === pageSize)
          $('p.info').text('上拉加载更多...');
        else if($('ul.product-list>li').length > 0)
          $('p.info').text('已到达底部~~~');
        else 
          $('p.info').text('暂无相关商品，敬请期待...');
      }
    });
  }, 400);
}

// 定义一个方法用来渲染商品
function showProduct(product) {
  // 拼接展示商品
  $(`
    <li>
      <a href='/pages/detail/index.html?pid=${product.id}'>
        <div class='img-wrapper'>
          <img src='${product.avatar}' />
        </div>
        <div class='detail-wrapper'>
          <div>
            <h4 class='ellipsis'>${product.name}</h4>
            <p class='ellipsis brief'>${product.brief}</p>
            <p class='price'>￥<span class='price'>${product.price}</span></p>
            <span class='sale'>销量：${product.sale}</span>
            <span class='rate'>评论：${product.rate}</span>
          </div>
        </div>
      </a>
    </li>
  `).appendTo('ul.product-list');
}

function initOrRefreshScroll() {
  imagesLoaded($('.scroll')[0], () => {   // 保证滚动区域图加载完毕
    setTimeout(() => {                    // 保证滚动区域图片渲染完毕
      if(scroll === null) {
        scroll = new IScroll($('.scroll')[0], {
          deceleration: 0.003,
          bounce: false,
          click: true,
          probeType: 2,
        });
        var isTriggerLoadMore = false;
        scroll.on('scroll', function() {
          $('i.rocket').toggle(Math.abs(this.y) >= 100);
          // if(Math.abs(this.y) >= 100) {
          //   $('i.rocket').show();
          // }else {
          //   $('i.rocket').hide();
          // }
          if(hasMore && !isLoading) { // 如果可以加载更多且当前没有处于loading状态
            if(this.y - this.maxScrollY === 0) { // 如果上拉达到加载更多的临界点
              $('p.info').text('放手立即加载..');
              isTriggerLoadMore = true;
            }
            else {                                // 如果没有达到加载更多的临界点
              $('p.info').text('上拉加载更多..');
              isTriggerLoadMore = false;
            }
          }
          scroll.on('scrollEnd', function() {
            if(isTriggerLoadMore) {
              isTriggerLoadMore = false;
              updateProductList(true);
            }
          });
        });
      }else scroll.refresh();
    }, 20);
  }) 
}