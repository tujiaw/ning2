'use strict';

const Service = require('egg').Service;
const PostsModel = require('../model/posts');
const CommentsModel = require('../model/comments');
const { TextJoke } = require('../model/joke');
const MongoHelp = require('../model/mongo').mongoHelp;
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const { getRandom, getRandomItems } = require('../extend/util');

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
    totalhit: 0,
    todayhit: 0,
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

  async search(keyword, page) {
    const lowerKeyword = keyword.toLowerCase();
    const result = await getMainData(page, function(post) {
      return post.title.toLowerCase().indexOf(lowerKeyword) >= 0 ||
      post.content.toLowerCase().indexOf(lowerKeyword) >= 0;
    });
    result.navs = [
      { name: 'Home', url: '/' },
      { name: keyword, url: '' },
    ];
    return result;
  }

  async textjoke(page, count, totalCount) {
    page = page || 1;
    count = count || 20;
    totalCount = totalCount || 100;
    const PAGE_PREFIX = '/textjoke?page=';
    const totalPage = totalCount / count;

    const prevPage = Math.max(1, parseInt(page) - 1);
    const nextPage = Math.min(totalPage, parseInt(page) + 1);
    const randomPage = Math.max(1, getRandom(1, totalPage));
    const list = await TextJoke.get(page, count);

    const result = await getMainData(page, function() { return false; });
    result.navs = [
      { name: 'Home', url: '/' },
      { name: '文本笑话', url: '' },
    ];
    result.joke = {
      page,
      count,
      list,
      prevPage: PAGE_PREFIX + prevPage,
      nextPage: PAGE_PREFIX + nextPage,
      randomPage: PAGE_PREFIX + randomPage,
    };
    return result;
  }

  async delete(postId, authorId) {
    try {
      await PostsModel.delPostById(postId, authorId);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = HomeService;
