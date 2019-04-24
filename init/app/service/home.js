'use strict';

const Service = require('egg').Service;
const PostsModel = require('../model/posts');
const CommentsModel = require('../model/comments');
const MongoHelp = require('../model/mongo').mongoHelp;
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

function getRandomItems(arr, num) {
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
}

async function getMainData(page, filter) {
  const startTime = new Date().getTime();
  page = parseInt(page) || 1;
  const MAX_PAGE_COUNT = 20;
  const allPosts = await PostsModel.getPostsProfile();
  const startIndex = (page - 1) * MAX_PAGE_COUNT;
  const endIndex = page * MAX_PAGE_COUNT - 1;
  const posts = [];
  const totalCount = allPosts.length;
  const tagsCount = [];
  const archivesCount = {};
  let index = 0;
  allPosts.forEach(post => {
    const ok = filter ? filter(post) : true;
    if (ok) {
      if (index >= startIndex && index <= endIndex) {
        posts.push(post);
      }
      ++index;
    }

    // 归档
    const createYearMonth = moment(objectIdToTimestamp(post._id)).format('YYYY-MM-DD').substr(0, 7);
    if (createYearMonth.length) {
      if (archivesCount[createYearMonth]) {
        archivesCount[createYearMonth]++;
      } else {
        archivesCount[createYearMonth] = 1;
      }
    }

    // 标签
    post.tags.forEach(tag => {
      if (tag.length) {
        const fitem = tagsCount.find(item => (item.name === tag));
        if (fitem) {
          fitem.count++;
        } else {
          tagsCount.push({
            name: tag,
            url: '/tags/' + encodeURIComponent(tag),
            count: 1,
          });
        }
      }
    });
  });

  let currentTotalPage = parseInt(index / MAX_PAGE_COUNT);
  currentTotalPage += (index / MAX_PAGE_COUNT) > currentTotalPage ? 1 : 0;
  const pageTurn = {
    prev: Math.max(page - 1, 0),
    next: page >= currentTotalPage ? 0 : page + 1,
  };
  console.log(pageTurn);

  const right = {};
  right.profile = {
    postCount: totalCount,
    totalhit: 235462,
    todayhit: 340,
  };
  // 热搜
  right.hotPosts = allPosts.sort((a, b) => (b.pv - a.pv));
  right.hotPosts = getRandomItems(right.hotPosts.slice(0, 50), 10);
  right.tagsCount = tagsCount;
  right.archives = [];
  for (const item in archivesCount) {
    right.archives.push({
      yearMonth: item,
      count: archivesCount[item],
    });
  }
  right.archives.sort((a, b) => {
    return a.yearMonth > b.yearMonth ? -1 : 1;
  });
  MongoHelp.addAllCreateDateTime(posts);
  MongoHelp.postsContent2Profile(posts);

  const endTime = new Date().getTime();
  console.log('cost:' + (endTime - startTime));
  return { posts, pageTurn, right };
}

class HomeService extends Service {
  async list(page) {
    return await getMainData(page);
  }

  async post(id) {
    const post = await PostsModel.getPostById(id);
    const prevPosts = await PostsModel.getPrevPostById(id);
    const nextPosts = await PostsModel.getNextPostById(id);
    await PostsModel.incPv(id);
    MongoHelp.addOneCreateAt(post);
    MongoHelp.post2html(post);

    const MAX_NAV_TITLE_LENGTH = 30;
    const prevPost = prevPosts.length > 0 ? prevPosts[0] : null;
    const nextPost = nextPosts.length > 0 ? nextPosts[0] : null;
    if (prevPost && prevPost.title.length > MAX_NAV_TITLE_LENGTH) {
      prevPost.title = prevPost.title.substr(0, MAX_NAV_TITLE_LENGTH) + '...';
    }
    if (nextPost && nextPost.title.length > MAX_NAV_TITLE_LENGTH) {
      nextPost.title = nextPost.title.substr(0, MAX_NAV_TITLE_LENGTH) + '...';
    }

    const commentList = await CommentsModel.getByPostId(id);
    let comments = [];
    if (commentList && Array.isArray(commentList)) {
      MongoHelp.addAllCreateDateTime(commentList);
      comments = commentList.map(item => {
        return {
          id: item.id,
          name: item.name,
          content: item.content,
          created_at: item.created_at,
        };
      });
    }
    const { right } = await getMainData();
    return { post, comments, prevPost, nextPost, right };
  }

  async tag(name, page) {
    console.log(`tag, name:${name}, page:${page}`);
    name = decodeURIComponent(name);
    const result = await getMainData(page, function(post) {
      return post.tags.indexOf(name) >= 0;
    });
    result.navs = [
      { name: 'Home', url: '/' },
      { name, url: '' },
    ];
    return result;
  }

  async ym(ym, page) {
    const result = await getMainData(page, function(post) {
      return moment(objectIdToTimestamp(post._id)).format('YYYY-MM-DD').substr(0, 7) === ym;
    });
    result.navs = [
      { name: 'Home', url: '/' },
      { name: ym, url: '' },
    ];
    return result;
  }
}

module.exports = HomeService;
