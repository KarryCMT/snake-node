import { LinRouter, NotFound, disableLoading } from 'lin-mizar';
import { groupRequired } from '../../middleware/jwt';
import {
  ArticleSearchValidator,
  CreateOrUpdateArticleValidator
} from '../../validator/m_article';
import { PositiveIdValidator } from '../../validator/common';

import { getSafeParamId } from '../../lib/util';
import { ArticleNotFound } from '../../lib/exception';
import { ArticleDao } from '../../dao/m_article';

// article 的资讯实例
const articleApi = new LinRouter({
  prefix: '/v1/article',
  module: '资讯'
});

// article 的dao 数据库访问层实例
const articleDto = new ArticleDao();
// 获取单个资讯实例
articleApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const article = await articleDto.getArticle(id);
  if (!article) {
    throw new NotFound({
      code: 10022
    });
  }
  ctx.json(article);
});
// 获取所有资讯实例
articleApi.get('/', async ctx => {
  const articles = await articleDto.getArticles();
  if (!articles || articles.length < 1) {
    throw new NotFound({
      message: '没有找到相关资讯'
    });
  }
  ctx.json(articles);
});
// 关键词搜索资讯实例
articleApi.get('/search/one', async ctx => {
  const v = await new ArticleSearchValidator().validate(ctx);
  const article = await articleDto.getArticleByKeyword(v.get('query.q'));
  if (!article) {
    throw new ArticleNotFound();
  }
  ctx.json(article);
});
// 新增资讯
articleApi.post('/', async ctx => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx);
  await articleDto.createArticle(v);
  ctx.success({
    code: 12
  });
});
// 修改资讯
articleApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateArticleValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await articleDto.updateArticle(v, id);
  ctx.success({
    code: 13
  });
});

articleApi.linDelete(
  'deleteArticle',
  '/:id',
  articleApi.permission('删除资讯'),
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await articleDto.deleteArticle(id);
    ctx.success({
      code: 14
    });
  }
);

module.exports = { articleApi, [disableLoading]: false };
