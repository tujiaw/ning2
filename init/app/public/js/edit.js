'use strict';

(function ($) {
  $('.edit select.dropdown').dropdown({
    action: 'activate',
    onChange: function (value) {
      $('.edit #type').val(value);
    }
  });

  let tagList = $('.edit #selectedTag').val().split(',');
  tagList = tagList.filter(a => a);
  $('.edit .itemTag').each(function () {
    const name = $(this).children('label').html();
    if (tagList.indexOf(name) >= 0) {
      $(this).checkbox('check');
    }
  });

  $('.edit .itemTag').checkbox({
    onChecked: function () {
      const name = $(this).siblings('label').html();
      if (tagList.indexOf(name) < 0) {
        tagList.push(name);
        $('.edit #selectedTag').val(tagList.join(','));
      }
    },
    onUnchecked: function () {
      const name = $(this).siblings('label').html();
      const index = tagList.indexOf(name)
      if (index >= 0) {
        tagList.splice(index, 1);
        $('.edit #selectedTag').val(tagList.join(','));
      }
    }
  })

  $('.ui.form')
    .form({
      fields: {
        title: {
          identifier: 'title',
          rules: [{
            type: 'length[1]',
            prompt: '您的文章标题太短，请重新输入。'
          }]
        },
        content: {
          identifier: 'content',
          rules: [{
            type: 'length[10]',
            prompt: '您的文章内容太短，请重新输入。'
          }]
        }
      }
    });
})($);