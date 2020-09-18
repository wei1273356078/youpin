// 自己写的

// 二次封装一个数据请求函数
// function $ajax(url, succCallback, type, dataType) {
//   var type = type || 'get',
//       dataType = dataType || 'json';
//   $.ajax({
//     type: type,
//     url: url,
//     dataType: dataType,
//     success: res => {
//       if(res.code === 200) {
//         succCallback(res);
//       }else {
//         $.alert(res.msg)
//       }
//     },
//     error: error => {
//       $.alert(error);
//     }
//   });
// }

// 第一次展示的
// $ajax("/category/list/0",function(res) {
//   showMainCategory(res.data);
//   // console.log(res.data);
// });
// 第一次显示的
// $ajax("/category/list/1",function(res) {
//   showSubCategory(res.data);
//   console.log(res.data);
// });

// // 定义一个方法，用来渲染一级标题分类
// function showMainCategory(data) {
//   data.forEach(function(item) {
//     $(`
//       <li data-id='${item.id}' data-avatar='${item.avatar}'>
//         <span>${item.name}</span>
//       </li>
//     `).appendTo('ul.category-main');
//   });
//   // 显示第一个
//   $('ul.category-main>li>span')[0].classList.add('show');
//   // 显示右侧第一个图片
//   var avatar = $('ul.category-main>li')[0].dataset.avatar;
//   $('.right>img').attr('src', `${avatar}`);
//   // 点击事件
//   $('ul.category-main>li').on('click', function() {
//     if($(this).children('span').hasClass('show')) return;

//     // 被点击的添加，其余的移除
//     $(this).children('span').addClass('show').end().siblings('li').children('span.show').removeClass('show');
//     var $id = $(this).closest('li').attr('data-id'),
//         $avatar = $(this).closest('li').attr('data-avatar');
//     $('.right>img').attr('src', `${$avatar}`);
//     $ajax(`/category/list/${$id}`,function(res) {
//       console.log(res.data);
//       if(res.data.length > 0) {
//         $('ul.category-sub').removeClass('hide');
//         $('.right>p.empty').removeClass('show');
//         $('ul.category-sub').text('');
//         showSubCategory(res.data);
//       }else {
//         $('ul.category-sub').addClass('hide');
//         $('.right>p.empty').addClass('show');
//       }
//     })
//     // console.log($id);
//     // 一级分类选中样式的切换
//     // 右上显示对应的激活的一级分类的avatar
//     // 更新显示激活的一级分类的所有二级分类
//   })
// }

// 定义一个方法，用来渲染二级标题分类
// function showSubCategory(data) {
//   data.forEach(item => {
//     $(`
//       <li>
//         <div>
//           <img src='${item.avatar}' />
//           <a href=''>${item.name}</a>
//         </div>
//       </li>
//     `).appendTo('ul.category-sub');
//   });
// }



// 老师讲解

// 发送ajax请求向服务器请求一级分类的数据
// $.ajax({
//   type: "get",                // 请求的类型
//   url: "/category/list/0",    // 请求的url地址
//   dataType: "json",           // 命令ajax把返回的数据当json字符串parse处理之后，在作为参数调用
//   success: result => {        // 请求成功返回结果后的回调函数
//     switch(result.code) {
//       case 200:
//         showMainCategory(result.data)
//         $('ul.category-main>li').eq(0).trigger('click');
//         if(result.msg) $.notice(result.msg);
//         break;
//       case 199:
//       case 401:
//       case 404:
//       case 500:
//         if(result.msg) $.alert(result.msg);
//         break;
//     }
//   },
//   error: error => {
//     $.alert(error);
//   }
// });

// 使用封装的插件Ajax请求数据
$.myAjax({
  // global: false,  // 不需要imgLoading
  url: '/category/list/0',
  success: data => {
    showMainCategory(data);
    $('ul.category-main>li').eq(0).trigger('click');
  }
});



// 定义一个方法，用来渲染一级标题分类
function showMainCategory(data) {
  data.forEach(function(item) {
    $(`
      <li data-id='${item.id}' data-avatar='${item.avatar}'>
        <span>${item.name}</span>
      </li>
    `)
    .on('click', function() {
      if($(this).hasClass('active')) return;
      // 一级分类选中样式的切换
      $(this).addClass('active').siblings('.active').removeClass('active');
      // 右上显示对应的激活的一级分类的avatar
      $('img.avatar').attr('src', $(this).attr('data-avatar'));
      // 更新显示激活的一级分类的所有二级分类
      $.myAjax({
        global: false,
        url: '/category/list/' + $(this).attr('data-id'),
        success: res => {
          $('p.empty').toggleClass('show', res.length === 0);
          $('ul.category-sub').empty().toggleClass('show', res.length !== 0);
          showSubCategory(res)
        },
        error: err => {
          $.alert(err)
        }
      });
    }).appendTo('ul.category-main');
  });
}

// 渲染二级标题
function showSubCategory(data) {
  data.forEach(function(item) {
    $(`
      <li>
        <a href='/pages/list/index.html?cid=${item.id}'>
          <img src='${item.avatar}' />
          <span>${item.name}</span>
        </a>
      </li>
    `).appendTo('ul.category-sub');
  });
}


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


