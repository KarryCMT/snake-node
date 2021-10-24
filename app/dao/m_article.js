import { NotFound, Forbidden } from 'lin-mizar';
import Sequelize from 'sequelize';
import { Article } from '../model/m_article';

class ArticleDao {
  async getArticle (id) {
    const article = await Article.findOne({
      where: {
        id
      }
    });
    return article;
  }

  async getArticleByKeyword (q) {
    const article = await Article.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        }
      }
    });
    return article;
  }

  async getArticles () {
    const articles = await Article.findAll();
    return articles;
  }

  async createArticle (v) {
    const article = await Article.findOne({
      where: {
        title: v.get('body.title')
      }
    });
    if (article) {
      throw new Forbidden({
        code: 10240
      });
    }
    const art = new Article();
    art.title = v.get('body.title');
    art.author = v.get('body.author');
    art.summary = v.get('body.summary');
    art.image = v.get('body.image');
    await art.save();
  }

  async updateArticle (v, id) {
    const article = await Article.findByPk(id);
    if (!article) {
      throw new NotFound({
        code: 10022
      });
    }
    article.title = v.get('body.title');
    article.author = v.get('body.author');
    article.summary = v.get('body.summary');
    article.image = v.get('body.image');
    await article.save();
  }

  async deleteArticle (id) {
    const article = await Article.findOne({
      where: {
        id
      }
    });
    if (!article) {
      throw new NotFound({
        code: 10022
      });
    }
    article.destroy();
  }
}

export { ArticleDao };
