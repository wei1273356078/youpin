
// 获取需要修改的地址id
var id = 1;


myAjax(true);
// 将请求数据的进行封装
function myAjax(global = false) {
  // 发送请求获取地址信息
  $.myAjax({
    global,
    url: '/address/list',
    success: res => {
      if(res.length > 0) {
        $('.page-content').addClass('show');
        $('.page-empty').removeClass('show');
        showAddressInfo(res);
        updateAddress();
      }else {
        $('.page-content').removeClass('show');
        $('.page-empty').addClass('show');
      }
    }
  });
}


// 封装一个方法用来展示地址信息
function showAddressInfo(data) {
  $('.page-content').empty();
  data.forEach(info => {
    $(`
      <div class='address-list' data-id='${info.id}'>
        <div class='address-info'>
          <div>
            <span class='name'>${info.receiveName}</span>
            <span class='phone'>${info.receivePhone}</span>
          </div>
          <p class='ellipsis'>
            ${info.isDefault === 1 ? '<span>默认</span>' : ''}
            ${info.receiveRegion} ${info.receiveDetail}
          </p>
        </div>
        <img src='/images/address/icon_edit_gray.png' />
      </div>
    `).appendTo('.page-content');
  });
};



// 为添加地址绑定点击事件
(function() {
  // 切换到新增地址
  $('.add-address').on('click', function() {
    $('.default-info').removeClass('show');
    $('.edit-address-info>.add-info>.delete').removeClass('show');
    $('button.save').attr('data-edit', 'add');
    $('.address-container').removeClass('show');
    $('.edit-address-info').addClass('show');
    // 清空地址信息
    $('input.name').val('');
    $('input.phone').val('');
    $('input.region').val('');
    $('input.detail').val('');
  });
  // 保存新增地址
  $('button.save').on('click', function() {
    var $edit = $('button.save').attr('data-edit');

    // 新增
    if($edit === 'add') {
      var receiveName = $('input.name').val().trim(),
          receivePhone = parseInt($('input.phone').val().trim()),
          receiveRegion = $('input.region').val(),
          receiveDetail = $('input.detail').val().trim(),
          phoneLength = /^1\d{10}$/;
      // 判断是否为空
      if(!receiveName) { $.notice('请输入收货人姓名！'); return; };
      if(!receivePhone || !phoneLength.test(receivePhone)) { $.notice('请输入正确的手机号！'); return; };
      if(!receiveRegion) { $.notice('请填写省市区！'); return; };
      if(!receiveDetail) { $.notice('请填写详细的地址！'); return; };
      $(this).closest('.edit-address-info').removeClass('show');
      $('.address-container').addClass('show');
      $.myAjax({
        global: false,
        url: '/address/add',
        type: 'post',
        data: {
          receiveName,
          receivePhone,
          receiveRegion,
          receiveDetail
        },
        success: res => {
          $.notice('新增成功');
          // 设置默认地址
          // if($('.default-info').attr('data-default') === 'true') {
          //   $.myAjax({
          //     global: false,
          //     url: '/address/set_default/' + ?,
          //     success: res => {
          //       myAjax();
          //     }
          //   });
          // };
          myAjax();
        }
      });
    };

    // 更新
    if($edit === 'update') {
      var receiveName = $('input.name').val().trim(),
          receivePhone = parseInt($('input.phone').val().trim()),
          receiveRegion = $('input.region').val(),
          receiveDetail = $('input.detail').val().trim(),
          phoneLength = /^1\d{10}$/;
      // 判断是否为空
      if(!receiveName) { $.notice('请输入收货人姓名！'); return; };
      if(!receivePhone || !phoneLength.test(receivePhone)) { $.notice('请输入正确的手机号！'); return; };
      if(!receiveRegion) { $.notice('请填写省市区！'); return; };
      if(!receiveDetail) { $.notice('请填写详细的地址！'); return; };
      $(this).closest('.edit-address-info').removeClass('show');
      $('.address-container').addClass('show');
      $.myAjax({
        global: false,
        type: 'post',
        url: '/address/update',
        data: {
          id,
          receiveName,
          receivePhone,
          receiveRegion,
          receiveDetail 
        },
        success: res => {
          $.notice('修改成功');
          // 设置默认地址
          if($('.default-info').attr('data-default') === 'true') {
            $.myAjax({
              global: false,
              url: '/address/set_default/' + id,
              success: res => {
                myAjax();
              }
            });
          };
          myAjax();
        }
      });
      
    }
  });
})();

// 回退按钮
(function() {
  // 回退个人中心
  $('i.prev-back').on('click', function() {
    if(Cookies.get('orderAddress')) {
      var orderAdd = Cookies.get('orderAddress');
      Cookies.remove('orderAddress');
      window.location.href = orderAdd;
      return;
    }
    window.location.href = '/pages/profile/index.html';
  });
  // 回退地址管理
  $('.address-back').on('click', function() {
    $('.edit-address-info').removeClass('show');
    $('.address-container').addClass('show');
  });
})();


// 修改地址
function updateAddress() {
  $('.page-content>.address-list').on('click', function() {
    if(Cookies.get('orderAddress')) {
      var orderAddress = Cookies.get('orderAddress');
      Cookies.remove('orderAddress');
      Cookies.set('addressId', $(this).attr('data-id'));
      window.location.href = orderAddress;
      return;
    }
    $('.default-info').addClass('show');
    $('.edit-address-info>.page-header>span').text('编辑地址');
    $('.edit-address-info>.add-info>.delete').addClass('show');
    $('.address-container').removeClass('show');
    $('.edit-address-info').addClass('show');
    $('button.save').attr('data-edit', 'update');
    id = this.dataset.id;
    $.myAjax({
      global: false,
      url: '/address/model/' + id,
      success: res => {
        if(res.isDefault === 0) {
          $('.default-info').attr('data-default', 'false');
          $('.default-info>i.checkbox').removeClass('check');
          $('span.default').text('设置默认地址');
        }else {
          $('.default-info').attr('data-default', 'true');
          $('.default-info>i.checkbox').addClass('check');
          $('span.default').text('默认地址');
        }
        showUpdateValue(res);
      },
    });
  });
}

// 渲染需要修改地址表单的值
function showUpdateValue(value) {
  $('input.name').val(value.receiveName);
  $('input.phone').val(parseInt(value.receivePhone));
  $('input.region').val(value.receiveRegion);
  $('input.detail').val(value.receiveDetail);
}

// 删除地址
(function() {
  $('.edit-address-info>.add-info>.delete').on('click', function() {
    $.confirm('请确认删除此地址！', function() {
      $('.edit-address-info').removeClass('show');
      $('.address-container').addClass('show');
      $.myAjax({
        global: false,
        url: '/address/remove/' + id,
        success: res => {
          $.notice('删除成功！');
          myAjax();
        }
      });
    });
  });
})();

// 设置默认地址
(function() {
  $('.default-info').on('click', function() {
    $(this).attr('data-default', $(this).find('i.checkbox').hasClass('check') ? 'false' : 'true')
      .find('i.checkbox').toggleClass('check');
    if($('.default-info').attr('data-default') === 'false') {
      $('span.default').text('设置默认地址');
    }
    else 
      $('span.default').text('默认地址');
  });
})();