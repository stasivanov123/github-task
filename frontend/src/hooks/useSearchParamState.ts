import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useSearchParamState(
  key: string,
  initialValue: string
): [string, (val: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //based on https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const value = searchParams.get(key) || initialValue;
  const setValue = (value: string) => {
    // noinspection JSIgnoredPromiseFromCall
    router.push(pathname + '?' + createQueryString(key, value));
  };

  return [value, setValue];
}
