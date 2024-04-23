export function ResultsTable(props: {
  searchQuery: any,
  element: (item: any) => JSX.Element
}) {
  return <div className="relative overflow-x-auto mt-3">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          Repo name
        </th>
        <th scope="col" className="px-6 py-3">
          Stars
        </th>
        <th scope="col" className="px-6 py-3">
          Watchers
        </th>
        <th scope="col" className="px-6 py-3">
          Forks
        </th>
        <th scope="col" className="px-6 py-3">
          Language
        </th>
        <th scope="col" className="px-6 py-3">
          Starred
        </th>
      </tr>
      </thead>
      <tbody>
      {props.searchQuery.data.items?.map(props.element)}
      </tbody>
    </table>
  </div>;
}
