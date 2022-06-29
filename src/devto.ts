import fetch from 'node-fetch';

export async function getStatsForOrg(
  orgName: string,
  apiKey: string
): Promise<ArticleStats[]> {
  const result: ArticleStats[] = [];

  const articlesResponse = await fetch(
    `https://dev.to/api/organizations/${orgName}/articles`,
    {
      headers: {
        'api-key': apiKey
      }
    }
  );

  if (articlesResponse.ok) {
    const {data, errors} = await articlesResponse.json();
    const articles: Article[] = data.map(article => {
      return {
        id: article.id,
        title: article.title,
        user: article.user.username,
        url: article.url,
        published_at: article.published_at
      };
    });

    for (const article of articles) {
      const articlesStatsResponse = await fetch(
        `https://dev.to/api/analytics/${article.id}/`,
        {
          headers: {
            'api-key': apiKey
          }
        }
      );

      if (articlesStatsResponse.ok) {
        const {data, errors} = await articlesStatsResponse.json();
        const articleStats: ArticleStats = {
          id: article.id,
          title: article.title,
          user: article.user,
          url: article.url,
          published_at: article.published_at,
          reactions: data.reactions.total,
          comments: data.comments.total,
          follows: data.reactions.total,
          page_views: data.page_views.total
        };
        result.push(articleStats);
      } else {
        throw new Error(articlesStatsResponse.statusText);
      }
    }
  } else {
    throw new Error(articlesResponse.statusText);
  }

  console.log(result);
  return result;
}

export type Article = {
  id: number;
  title: string;
  url: string;
  user: string;
  published_at: string;
};

export type ArticleStats = Article & {
  page_views: number;
  reactions: number;
  follows: number;
  comments: number;
};
