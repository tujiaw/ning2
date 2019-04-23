'use strict';

$('.post.card .content').on('click', function() {
  window.location.href = $(this).attr('href');
});

$('.ui.button').on('click', function() {
  const url = $(this).attr('href') || '';
  if (url.length) {
    window.location.href = url;
  }
});
