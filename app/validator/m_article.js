import { LinValidator, Rule } from 'lin-mizar';

class ArticleSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '必须传入搜索关键字');
  }
}

class CreateOrUpdateArticleValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入资讯名');
    this.author = new Rule('isNotEmpty', '必须传入资讯作者');
    this.summary = new Rule('isNotEmpty', '必须传入资讯综述');
    this.image = new Rule('isLength', '资讯插图的url长度必须在0~100之间', {
      min: 0,
      max: 100
    });
  }
}

export { CreateOrUpdateArticleValidator, ArticleSearchValidator };
