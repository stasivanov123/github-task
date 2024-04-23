import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback } from 'react';

function YellowStar() {
  return (
    <svg
      className="w-4 h-4 text-yellow-300 ms-1"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  );
}

function GrayStar() {
  return (
    <svg
      className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>
  );
}

export function StarButton(props: any) {
  const { item } = props;
  const starred = !!item?.isStarred;
  const starFn = useCallback(
    () =>
      axios.put(
        `http://localhost:3001/api/star/${item.owner.login}/${item.name}`
      ),
    [item]
  );
  const unStarFn = useCallback(
    () =>
      axios.delete(
        `http://localhost:3001/api/star/${item.owner.login}/${item.name}`
      ),
    [item]
  );

  const queryClient = useQueryClient();

  const defaultMutationOpts = {
    onError: (err: any) => alert(err?.response?.data?.message || err?.message),
    throwOnError: false,
    onMutate: (targetState: boolean) => {
      //optimistic mutations
      const queries = queryClient.getQueriesData({ queryKey: ['search'] });
      for (const q of queries) {
        const data = q[1] as any;
        const repo = data?.items?.find((i: any) => i.id === item.id);
        if (repo) {
          repo.isStarred = targetState;
          queryClient.setQueryData(q[0], data);
        }
      }
    },
    //todo rollback on error
  };

  const starMutation = useMutation({
    ...defaultMutationOpts,
    mutationFn: starFn,
  });
  const unStarMutation = useMutation({
    ...defaultMutationOpts,
    mutationFn: unStarFn,
  });
  if (starred) {
    return (
      <button onClick={() => unStarMutation.mutate(false)}>
        <YellowStar />
      </button>
    );
  } else {
    return (
      <button onClick={() => starMutation.mutate(true)}>
        <GrayStar />
      </button>
    );
  }
}
