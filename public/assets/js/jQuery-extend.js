(function() {
    var overlayCssConfig = {
        zIndex: '9999',
        position: 'fixed',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    };
    var contentCssConfig = {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '60%',
        maxWidth: '70%',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 0 20px 0 rgba(0,0,0,0.2)',
        paddingTop: '20px'
    };
    var textCssConfig = {
        padding: "10px", 
        fontSize: '13px',
        color: '#999'
    };
    var buttonWrapperCssConfig = {
        display: 'flex',
        height: '50px',
        borderTop: '1px solid #b0b0b0',
        width: '100%'
    };
    var buttonCssConfig = {
        flexGrow: '1',
        backgroundColor: '#fff',
        fontSize: '14px',
        color: '#845f3f',
        border: 'none',
        outline: 'none',
    };
    // jQuery自定义扩展消息提示alert方法
    $.extend({
        alert: function(msg, callback) {
            var $alertEl = $('<div></div>').css(overlayCssConfig);
            var $contentEl = $('<div></div>').css(contentCssConfig);
            $('<img src="/images/msg.png" />').css({ width: '100px' }).appendTo($contentEl);
            $('<p></p>').text(msg).css(textCssConfig).appendTo($contentEl);
            var $buttonWrapper = $('<div></div>').css(buttonWrapperCssConfig);
            $('<button>确定</button>').css(buttonCssConfig).on('click', function() { 
                $alertEl.remove(); 
                if(callback && typeof callback === "function") callback();
            }).appendTo($buttonWrapper);
            $alertEl.append($contentEl.append($buttonWrapper)).appendTo('body');
        }
    });    
    // jQuery自定义扩展消息提示confirm方法
    $.extend({
        confirm: function(msg, callback, cancelback) {
            var $confirmEl = $('<div></div>').css(overlayCssConfig);
            var $contentEl = $('<div></div>').css(contentCssConfig);
            $('<img src="/images/msg.png" />').css({ width: '100px' }).appendTo($contentEl);
            $('<p></p>').text(msg).css(textCssConfig).appendTo($contentEl);
            var $buttonWrapper = $('<div></div>').css(buttonWrapperCssConfig);
            $('<button>确定</button>').css(buttonCssConfig).css({ borderRight: '1px solid #b0b0b0' }).on('click', function() {
                $confirmEl.remove();
                if(typeof callback === "function") callback();
            }).appendTo($buttonWrapper);
            $('<button>取消</button>').css(buttonCssConfig).on('click', function() { 
                $confirmEl.remove();
                if(cancelback && typeof callback === "function") cancelback();
            }).appendTo($buttonWrapper);
            $confirmEl.append($contentEl.append($buttonWrapper)).appendTo('body');
        }
    });
    // jQuery自定义扩展消息提示notice方法
    $.extend({
        notice: function(msg) {
            var $noticeEl = $('<div></div>').text(msg).css({
                zIndex: '10000',
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70%',
                backgroundColor: '#333',
                color: '#fff',
                fontSize: '16px',
                textIndent: '2em',
                borderRadius: '2px',
                padding: '10px 5px'
            }).appendTo('body');
            setTimeout(function() {
                $noticeEl.animate({ opacity: '0' }, 1000, function() { $noticeEl.remove(); });
            }, 1500);
        }
    });
    // jQuery自定义扩展消息提示loading方法
    $.extend({
        loading: {
            _el: null,
            _time: 0,
            show: function() {
                if(this._time === 0) {
                    this._el = $('<div></div>').css(overlayCssConfig).css({ backgroundColor: 'rgba(255, 255, 255, 1)' });
                    $('<img src="/images/loading.gif" />').css({ width: '170px' }).appendTo(this._el);
                    this._el.appendTo('body');
                }
                this._time++;
            },
            hide: function() {
                if(this._time === 1)
                    this._el.animate({ opacity: '0' }, 400, function() { $(this).remove(); });
                if(this._time > 0) 
                    this._time--; 
            }
        }
    });
    // jQquery自定义扩展ajax封装及带loading效果
    $(document)
        .bind('ajaxSend', function() { $.loading.show(); })
        .bind('ajaxComplete', function() { 
            setTimeout(function() { $.loading.hide(); }, 500);
        });
    $.extend({
        myAjax: function(options) {
            var defaultOptions = {
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                headers: {      // 强制让所以的ajax请求都携带token
                    "Authorization": sessionStorage.getItem("token")
                },
                error: function(xhr, textStatus) {
                    $.alert(textStatus);
                }
            };
            ajaxOptions = Object.assign({}, defaultOptions, options);
            if(ajaxOptions.data) ajaxOptions.data = JSON.stringify(ajaxOptions.data);
            ajaxOptions.success = function(result, statue, xhr) {
                // 如果有新令牌在响应头中的Authorization节点，则更新sessionStorage中的旧令牌,来刷新令牌过期时间
                if(xhr.getResponseHeader("Authorization")) {
					sessionStorage.setItem('token', xhr.getResponseHeader("Authorization"));
				}
                // 如果有消息，显示消息
                switch(result.code) {
                    case 200: 
                        if(result.msg) $.notice(result.msg);
                        options.success(result.data);
                        break;
                    case 401:
                        $.alert(result.msg, function() {
                          Cookies.set('backNext', window.location.href);
                          window.location.href = '/pages/login/index.html';
                        });
                        
                        break;
                    case 500:
                    case 199:
                    case 404:
                    default:
                        if(result.msg) $.alert(result.msg);
                        break;
                }
            };
            $.ajax(ajaxOptions);
        }
    });
})();