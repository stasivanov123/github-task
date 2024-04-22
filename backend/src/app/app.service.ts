import { Inject, Injectable, Logger } from '@nestjs/common';
import { SearchParamsDto } from './search-params.dto';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class AppService {
  private githubClient: AxiosInstance;
  private readonly logger = new Logger(AppService.name);

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    //todo this can be extracted to another service/client
    this.githubClient = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${this.configService.get<string>(
          'GITHUB_TOKEN'
        )}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
  }

  async search(search: SearchParamsDto) {
    const result = await this.githubClient.get('/search/repositories', {
      params: search,
    });

    if (result.data?.items?.length > 0) {
      for (const item of result.data?.items) {
        item.isStarred = await this.isStarredByCurrentUser(
          item?.owner?.login,
          item?.name
        );
      }
    }

    return result.data;
  }

  getCacheKey(owner: string, repo: string) {
    return `isStarredByCurrentUser::${owner}::${repo}`;
  }

  async isStarredByCurrentUser(owner: string, repo: string): Promise<boolean> {
    //using this API https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#check-if-a-repository-is-starred-by-the-authenticated-user
    const cacheKey = this.getCacheKey(owner, repo);
    const cached = await this.cacheManager.get(cacheKey);
    if (typeof cached === 'boolean') {
      return cached;
    }
    this.logger.debug(`Requesting isStarred for ${owner}/${repo}`); //useful to see cache in work
    const response = await this.githubClient.get(
      `/user/starred/${owner}/${repo}`,
      {
        validateStatus: (status) => status === 204 || status === 404,
      }
    );
    const isStarred = response.status === 204;
    await this.cacheManager.set(cacheKey, isStarred, 3600 * 1000); //one hour TTL
    return isStarred;
  }

  async starRepo(owner: string, repo: string) {
    const cacheKey = this.getCacheKey(owner, repo);
    await this.githubClient.put(`/user/starred/${owner}/${repo}`);
    await this.cacheManager.set(cacheKey, true);
  }

  async unStarRepo(owner: string, repo: string) {
    const cacheKey = this.getCacheKey(owner, repo);
    await this.githubClient.delete(`/user/starred/${owner}/${repo}`);
    await this.cacheManager.set(cacheKey, false);
  }
}
