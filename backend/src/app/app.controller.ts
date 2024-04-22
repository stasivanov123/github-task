import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { SearchParamsDto } from './search-params.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('search')
  search(@Query() search: SearchParamsDto) {
    return this.appService.search(search);
  }

  @Get('star/:owner/:repo')
  getStar(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.appService.isStarredByCurrentUser(owner, repo);
  }

  @Put('star/:owner/:repo')
  setStar(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.appService.starRepo(owner, repo);
  }

  @Delete('star/:owner/:repo')
  deleteStar(@Param('owner') owner: string, @Param('repo') repo: string) {
    return this.appService.starRepo(owner, repo);
  }
}
