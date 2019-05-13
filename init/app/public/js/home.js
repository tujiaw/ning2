'use strict';

$('#search').bind('search', function() {
  const text = $(this).val();
  if (text.length < 2) {
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

$('.header.title').on('click', function() {
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

$('a.postDelete').on('click', function() {
  const url = $(this).attr('url');
  $('.ui.mini.modal').modal({
    onApprove() {
      window.location.href = url;
    },
  }).modal('show');
  return false;
});

function fairyDustCursor(isStart) {
  const possibleColors = [ '#D61C59', '#E7D84B', '#1B8798' ];
  let width = window.innerWidth;
  // eslint-disable-next-line no-unused-vars
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: width / 2 };
  const particles = [];

  function init() {
    if (isStart) {
      bindEvents();
      loop();
    } else {
      unbindEvents();
    }
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  function onMouseMove(e) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;

    addParticle(cursor.x, cursor.y, possibleColors[Math.floor(Math.random() * possibleColors.length)]);
  }

  // Bind events that are needed
  function bindEvents() {
    $(document).bind('mousemove', onMouseMove);
    $(window).bind('resize', onWindowResize);
  }

  function unbindEvents() {
    $(document).unbind('mousemove');
    $(window).unbind('resize');
  }

  function addParticle(x, y, color) {
    const particle = new Particle();
    particle.init(x, y, color);
    particles.push(particle);
  }

  function updateParticles() {

    // Updated
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles[i].die();
        particles.splice(i, 1);
      }
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    updateParticles();
  }

  /**
   * Particles
   */

  function Particle() {

    this.character = '*';
    this.lifeSpan = 120; // ms
    this.initialStyles = {
      position: 'fixed',
      display: 'inline-block',
      top: '0px',
      left: '0px',
      pointerEvents: 'none',
      'touch-action': 'none',
      'z-index': '10000000',
      fontSize: '25px',
      'will-change': 'transform',
    };

    // Init, and set properties
    this.init = function(x, y, color) {

      this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1,
      };

      this.position = { x: x + 10, y: y + 10 };
      this.initialStyles.color = color;

      this.element = document.createElement('span');
      this.element.innerHTML = this.character;
      applyProperties(this.element, this.initialStyles);
      this.update();

      document.querySelector('.js-cursor-container').appendChild(this.element);
    };

    this.update = function() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;

      this.element.style.transform = 'translate3d(' + this.position.x + 'px,' + this.position.y + 'px, 0) scale(' + (this.lifeSpan / 120) + ')';
    };

    this.die = function() {
      this.element.parentNode.removeChild(this.element);
    };
  }

  /**
   * Utils
   */

  // Applies css `properties` to an element.
  function applyProperties(target, properties) {
    for (const key in properties) {
      target.style[ key ] = properties[ key ];
    }
  }

  if (!('ontouchstart' in window || navigator.msMaxTouchPoints)) init();
}

function setLocalCursor(value) {
  if (window.localStorage) {
    window.localStorage.fairyDustCursor = value;
  }
}
function getLocalCursor() {
  if (window.localStorage) {
    return window.localStorage.fairyDustCursor;
  }
  return '';
}

// eslint-disable-next-line no-unused-vars
function fairyDustCursorStart() {
  let isStart = getLocalCursor() === 'true';
  isStart = !isStart;
  setLocalCursor(isStart ? 'true' : 'false');
  fairyDustCursor(isStart);
}
fairyDustCursor(getLocalCursor() === 'true');
