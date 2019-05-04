'use strict';

(function comments(sha1) {
  const $body = (window.opera) ? (document.compatMode === 'CSS1Compat' ? $('html') : $('body')) : $('html,body'); // 这行是 Opera 的补丁, 少了它 Opera 是直接用跳的而且画面闪烁
  $(document).ready(function() {
    const gotoid = getCookie('goto_id');
    if (gotoid && gotoid.length) {
      setCookie('goto_id', '');
      $body.animate({
        scrollTop: $('#' + gotoid).offset().top,
      }, 300);
    }
  });

  function getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + '=');
      if (c_start !== -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(';', c_start);
        if (c_end === -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end));
      }
    }
    return '';
  }

  function setCookie(c_name, value, expiredays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + '=' + escape(value) +
      ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
  }

  const refreshCaptcha = function() {
    $.ajax({
      type: 'GET',
      url: '/captcha',
      success: result => {
        if (result.data) {
          $('#svgCaptcha').html(result.data);
          $('#svgCaptcha').attr('value', result.text);
        }
      },
    });
  };

  refreshCaptcha();
  $('#svgCaptcha').on('click', function() {
    refreshCaptcha();
  });

  $('.comments .submit').on('click', function() {
    let errMsg = '';
    const content = $('.commentInput #content').val();
    const name = $('.commentInput #name').val();
    if (content.length < 3 || content.length > 2048) {
      errMsg = '评论不合法.';
    } else if (name.length < 1 || name.length > 64) {
      errMsg = '姓名不合法.';
    } else {
      const text = $('#captcha').val().toLowerCase();
      const inputCaptcha = sha1.update(text).hex();
      const dstCaptcha = $('#svgCaptcha').attr('value');
      if (inputCaptcha.length && inputCaptcha === dstCaptcha) {
        setCookie('goto_id', 'post_comments', 1);
        return true;
      }
      errMsg = '验证码不正确，请重新输入或者单击刷新验证码.';
    }
    $('.warning.message span').html(errMsg);
    $('.warning.message').show();
    return false;
  });

  // 解决eggjs csrf报错
  const csrftoken = getCookie('csrfToken');
  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
  $.ajaxSetup({
    // eslint-disable-next-line object-shorthand
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader('x-csrf-token', csrftoken);
      }
    },
  });

  $('.comments #delete').on('click', function() {
    const commentId = $(this).parents('.comment').attr('id');
    if (commentId && commentId.length) {
      $.ajax({
        type: 'POST',
        url: '/comments/remove/',
        data: {
          commentId,
        },
        success: result => {
          if (result === 'success') {
            $('#' + commentId).hide();
          } else {
            console.error(result)
          }
        },
      });
    }
  });

  $('.comments #reply').on('click', function() {
    // eslint-disable-next-line newline-per-chained-call
    const author = $(this).parent().siblings('.author').text();
    if (author.length) {
      const inputContent = $('textarea#content');
      inputContent.val('@' + author + ' ');
      inputContent.focus();
      $body.animate({
        scrollTop: inputContent.offset().top,
      }, 300);
    }
  });
// eslint-disable-next-line no-undef
})(sha1);

