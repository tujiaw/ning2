'use strict';

const fs = require('fs');
const request = require('request');
const uuidv1 = require('uuid/v1');
const path = require('path');

exports.internalHandle = function(internalSecond, count, fn) {
  let i = 0;
  const id = setInterval(() => {
    ++i;
    if (i > count) {
      clearInterval(id);
    } else {
      fn(i);
    }
  }, internalSecond * 1000);
};

exports.asyncSleep = async function(ms) {
  function impl(ms) {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }
  await impl(ms);
};

exports.getRandom = (x, y) => {
  const a = y - x + 1;
  return a > 0 ? Math.floor(Math.random() * a + x) : 0;
};

exports.encodeBase64 = function(str) {
  return new Buffer(str).toString('base64');
};

exports.decodeBase64 = function(str) {
  return new Buffer(str, 'base64').toString();
};

exports.getRandomItems = function(arr, num) {
  // 新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
  const temp_array = [];
  for (const index in arr) {
    temp_array.push(arr[index]);
  }
  // 取出的数值项,保存在此数组
  const return_array = [];
  for (let i = 0; i < num; i++) {
    // 判断如果数组还有可以取出的元素,以防下标越界
    if (temp_array.length > 0) {
      // 在数组中产生一个随机索引
      const arrIndex = Math.floor(Math.random() * temp_array.length);
      // 将此随机索引的对应的数组元素值复制出来
      return_array[i] = temp_array[arrIndex];
      // 然后删掉此索引的数组元素,这时候temp_array变为新的数组
      temp_array.splice(arrIndex, 1);
    } else {
      // 数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
      break;
    }
  }
  return return_array;
};

exports.link2local = function(content, host = 'next.ningto.com/public/upload/', dstDir = './app/public/upload/') {
  if (!fs.existsSync(dstDir)) { fs.mkdirSync(dstDir); }

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
          name: uuidv1(),
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
          item.name += item.url.slice(lastDot, lastDot + 4);
        } else {
          item.name += '.png';
        }

        resultList.push(item);
      }
    }
  }

  let result = content;
  resultList.forEach(function(item) {
    result = result.replace(item.src, host + item.name);
    request(item.url).pipe(fs.createWriteStream(path.join(dstDir, item.name)));
  });
  return result;
};
