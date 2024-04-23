import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useGithubSearch(params: any) {
  return useQuery<any, any>({
    queryKey: ['search', params],
    queryFn: async () =>
      (await axios.get('http://localhost:3001/api/search', { params })).data, //todo env
    enabled: !!params?.q,
    //to ease request limits
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
