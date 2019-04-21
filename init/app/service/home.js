const Service = require('egg').Service;
const PostsModel = require('../model/posts');
const MongoHelp = require('../model/mongo').mongoHelp;

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
        }
        return result;
    }
}

module.exports = HomeService;