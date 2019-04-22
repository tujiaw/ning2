'use strict';

$('.post.card').on('click', function() {
  window.location.href = $(this).attr('href')
})

$('.ui.button').on('click', function() {
  var url = $(this).attr('href') || ''
  if (url.length) {
    window.location.href = url
  }
})