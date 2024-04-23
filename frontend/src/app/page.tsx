'use client';
import { useSearchParamState } from '../hooks/useSearchParamState';
import { Header } from './components/header';
import { useGithubSearch } from '../hooks/useGithubSearch';
import { Spinner } from './components/spinner';
import { ResultsTable } from './components/resultsTable';
import { StarButton } from './components/starButton';
import { Pagination } from 'react-headless-pagination';

export default function Index() {
  const [q, setQ] = useSearchParamState('q', '');
  const [pageStr, setPageStr] = useSearchParamState('page', '1');
  const [perPageStr, setPerPageStr] = useSearchParamState('per_page', '30');
  const [sort, setSort] = useSearchParamState('sort', '');
  const [order, setOrder] = useSearchParamState('order', '');
  const page = parseInt(pageStr) || 1;
  const per_page = parseInt(perPageStr) || 30;

  const searchQuery = useGithubSearch({
    q,
    page,
    per_page,
    sort: sort ? sort : undefined,
    order: sort && order ? order : undefined,
  });

  return (
    <div>
      <Header />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className={'flex'}>
            <input
              className={
                'block w-3/6 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              }
              type={'search'}
              placeholder={'Query...'}
              required={true}
              value={q}
              onChange={(ev) => setQ(ev.target.value)}
            />
            <select
              value={sort}
              onChange={(ev) => setSort(ev.target.value)}
              className={
                (sort ? 'w-2/6' : 'w-3/6') +
                ' mx-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              }
            >
              <option value={''}>Sort by</option>
              {['stars', 'forks', 'help-wanted-issues', 'updated'].map((k) => (
                <option value={k} key={k}>
                  {k}
                </option>
              ))}
            </select>
            {!!sort && (
              <select
                value={order || 'desc'}
                onChange={(ev) => setOrder(ev.target.value)}
                className={
                  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/6 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                }
              >
                <option value={'desc'}>Descending</option>
                <option value={'asc'}>Ascending</option>
              </select>
            )}
          </div>

          {searchQuery.isLoading && <Spinner />}
          {searchQuery.isError && (
            <div className={'text-red-600'}>
              {searchQuery?.error?.response?.data?.message ||
                searchQuery.error?.message}
            </div>
          )}
          {searchQuery.data && (
            <ResultsTable
              searchQuery={searchQuery}
              element={(item: any) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {item.full_name}
                  </th>
                  <td className="px-6 py-4">{item.stargazers_count}</td>
                  <td className="px-6 py-4">{item.watchers_count}</td>
                  <td className="px-6 py-4">{item.forks_count}</td>
                  <td className="px-6 py-4">{item.language}</td>
                  <td className="px-6 py-4">
                    <StarButton item={item} />
                  </td>
                </tr>
              )}
            />
          )}

          {searchQuery.data && (
            <Pagination
              currentPage={page - 1}
              setCurrentPage={(p) => setPageStr((p + 1).toString())}
              totalPages={Math.ceil(
                (searchQuery?.data?.total_count || per_page) / per_page
              )}
              edgePageCount={2}
              middlePagesSiblingCount={2}
              truncableText={''}
              className={'m-5 flex justify-center'}
            >
              <nav aria-label="Navigation">
                <ul className="flex items-center -space-x-px h-8 text-sm">
                  <Pagination.PageButton
                    activeClassName="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    inactiveClassName="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    className="cursor-pointer"
                  />
                </ul>
              </nav>
            </Pagination>
          )}
        </div>
      </main>
    </div>
  );
}
