import { IsEnum, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SearchParamsSort {
  stars = 'stars',
  forks = 'forks',
  helpWantedIssues = 'help-wanted-issues',
  updated = 'updated',
}

export enum SearchParamsOrder {
  desc = 'desc',
  asc = 'asc',
}

//this is a proxy for query params in https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories
export class SearchParamsDto {
  @IsNotEmpty()
  @ApiProperty({
    description:
      'The query contains one or more search keywords and qualifiers',
  })
  public q: string = '';

  @IsOptional()
  @IsEnum(SearchParamsSort)
  @ApiProperty({
    enum: SearchParamsSort,
    required: false,
    description:
      'Sorts the results of your query by number of stars, forks, or help-wanted-issues or how recently the items were updated. Default: best match',
  })
  public sort?: SearchParamsSort;

  @IsOptional()
  @IsEnum(SearchParamsOrder)
  @ApiProperty({
    enum: SearchParamsOrder,
    required: false,
    description:
      'Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). This parameter is ignored unless you provide sort. Default: desc',
  })
  public order?: SearchParamsOrder = SearchParamsOrder.desc;

  @Min(1)
  @Max(100)
  @IsOptional()
  @ApiProperty({
    required: false,
    minimum: 1,
    maximum: 100,
    description: 'The number of results per page',
  })
  public per_page?: number = 30;

  @Min(1)
  @IsOptional()
  @ApiProperty({
    required: false,
    minimum: 1,
    description: 'The page number of the results to fetch',
  })
  public page?: number = 1;
}
