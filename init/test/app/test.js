'use strict';

const fs = require('fs');
const request = require('request');
const uuidv1 = require('uuid/v1');
const path = require('path');

function link2local(content, host, dstDir) {
  const resultList = [];
  let index = 0;
  // eslint-disable-next-line no-constant-condition
  while (1) {
    const start = content.indexOf('![', index);
    if (start < 0) {
      break;
    }
    index = start + 1;
    const end = content.indexOf(')', index);
    if (end < 0) {
      break;
    }
    index = end + 1;

    const link = content.slice(start, end + 1);
    if (/^!\[.*\]\(.+\)$/.test(link)) {
      const first = link.indexOf('(');
      const second = link.lastIndexOf(')');
      if (first >= 0 && second >= 0) {
        const item = {
          src: link.slice(first + 1, second),
          url: '',
          dst: uuidv1(),
        };
        if (item.src.slice(0, 2) === '//') {
          item.url = 'http:' + item.src;
        } else if (item.src.indexOf('http') !== 0) {
          item.url = 'http://' + item.src;
        } else {
          item.url = item.src;
        }

        const lastDot = item.url.lastIndexOf('.');
        if (lastDot + 3 === item.url.length) {
          item.dst += item.url.slice(lastDot, lastDot + 4);
        } else {
          item.dst += '.png';
        }

        resultList.push(item);
      }
    }
  }

  let result = content;
  resultList.forEach(function(item) {
    result = result.replace(item.src, host + item.dst);
    request(item.url).pipe(fs.createWriteStream(path.join(dstDir, item.dst)));
  });
  return result;
}

const content = fs.readFileSync('C:\\Users\\jiawei.tu\\Desktop\\1111111111.txt', 'utf-8')
const result = link2local(content, 'ningto.com/upload', '.');
console.log(result);
