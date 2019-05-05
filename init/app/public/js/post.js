'use strict';

$('#toc-head').on('click', function() {
  const angle = $('#toc-head .angle');
  if (angle.hasClass('down')) {
    angle.removeClass('down');
    angle.addClass('up');
  } else {
    angle.removeClass('up');
    angle.addClass('down');
  }
  $('#toc ul').toggle();
});
