'use strict';

$('#search').bind('search', function() {
  const text = $(this).val();
  if (text.length <= 2) {
    console.log('search text is too short!');
    return;
  }
  window.location.href = '/search?keyword=' + encodeURIComponent(text);
});

$('#search').keyup(function(e) {
  if (e.keyCode === 13) {
    $(this).trigger('search');
  }
});

$('.post.card .content').on('click', function() {
  const url = $(this).attr('href') || '';
  if (url.length) {
    window.location.href = url;
  }
});

$('.ui.button').on('click', function() {
  const url = $(this).attr('href') || '';
  if (url.length) {
    window.location.href = url;
  }
});

function parse_query_string(query) {
  const query_string = {};
  if (query && query.length) {
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      const key = pair[0];
      const value = pair[1];
      // If first entry with this name
      if (typeof query_string[key] === 'undefined') {
        query_string[key] = value;
        // If second entry with this name
      } else if (typeof query_string[key] === 'string') {
        const arr = [ query_string[key], value ];
        query_string[key] = arr;
        // If third or later entry with this name
      } else {
        query_string[key].push(value);
      }
    }
  }
  return query_string;
}

function gotoPage(page) {
  const href = window.location.href;
  const pos = href.indexOf('?');
  const first = pos >= 0 ? href.slice(0, pos) : href;
  const second = pos >= 0 ? href.slice(pos + 1) : '';
  const queryObj = parse_query_string(second);
  queryObj.page = page;
  let params = '';
  for (const key in queryObj) {
    if (params.length > 0) params += '&';
    params += `${key}=${queryObj[key]}`;
  }
  window.location.href = first + '?' + params;
}

function go(self) {
  if (self.attr('page')) {
    gotoPage(self.attr('page'));
  } else {
    window.location.href = self.attr('href');
  }
}

$('.alink').on('click', function() {
  go($(this));
});
