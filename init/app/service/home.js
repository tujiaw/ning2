const Service = require('egg').Service;
const PostsModel = require('../model/posts');
const MongoHelp = require('../model/mongo').mongoHelp;
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

function getRandomItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
}

async function getRightSidebarData() {
    let allPosts = await PostsModel.getPostsProfile();
    allPosts = allPosts.sort((a, b) => ( b.pv - a.pv ));
    const totalCount = allPosts.length;
    const tagsCount = []
    const archivesCount = {}
    allPosts.forEach((post) => {
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
      post.tags.forEach((tag) => {
          if (tag.length) {
            const fitem = tagsCount.find((item) => ( item.name === tag ));
            if (fitem) {
              fitem.count++;
            } else {
              tagsCount.push({ name: tag, count: 1})
            }
          }
      })
    })
    
    const result = {}
    result.profile = {
      postCount: totalCount,
      hitCount: 526,
      hitToday: 235462
    };
    // 热搜
    result.hotPosts = getRandomItems(allPosts.slice(0, 50), 10);
    result.tagsCount = tagsCount;
    result.archives = []
    for (let item in archivesCount) {
      result.archives.push({
        yearMonth: item,
        count: archivesCount[item]
      })
    }
    result.archives.sort((a, b) => a.yearMonth > b.yearMonth ? -1 : 1);
    console.log(result.hotPosts.length)
    return result
  }

class HomeService extends Service {
    async list(page = 1) {
        const pagePosts = await PostsModel.getPostsProfile(null, page)
        const totalCount = await PostsModel.getPostsCount(null)
        MongoHelp.addAllCreateDateTime(pagePosts);
        MongoHelp.postsContent2Profile(pagePosts);

        var pageNumbers = [];
        var lastPage = Math.ceil(totalCount / 20);
        if (page <= lastPage) {
        var i = 1;
        if (page <= 3) {
            for (i = 1; i <= page; i++) {
            pageNumbers.push(i);
            }
            for (i = page + 1; i <= lastPage && pageNumbers.length < 5; i++) {
            pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(0);
            for (i = page - 2; i <= Math.min(page + 2, lastPage); i++) {
            pageNumbers.push(i);
            }
        }
        if (lastPage > i) {
            pageNumbers.push(0);
        }
        }

        var prevPage = Math.max(page - 1, 1);
        var nextPage = Math.min(lastPage, page + 1);
        const result = {
            //user: ctx.session.user, // FIXME
            user: {},
            posts: pagePosts,
            page: page,
            lastPage: lastPage,
            pageNumbers: pageNumbers,
            prevPage: prevPage,
            nextPage: nextPage,
            right: await getRightSidebarData()
        }
        return result;
    }
}

module.exports = HomeService;