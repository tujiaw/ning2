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

function gotoPage(page) {
  const href = window.location.href;
  const pos = href.indexOf('?');
  if (pos > 0) {
    window.location.href = href.slice(0, pos) + '?page=' + page;
  } else {
    window.location.href = href + '?page=' + page;
  }
}

$('button#prevPage').on('click', function() {
  gotoPage($(this).attr('page'));
});

$('button#nextPage').on('click', function() {
  gotoPage($(this).attr('page'));
});
