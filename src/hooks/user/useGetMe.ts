import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { QueryKey } from '@/src/enums/query-key.enum'
import { getMe } from '@/src/services/user.service'
import { RecordModel } from 'pocketbase'

interface UseGetMeProps {
  options?: Omit<UseQueryOptions<RecordModel>, 'queryKey' | 'queryFn'>
}

export const useGetMe = ({ options }: UseGetMeProps = {}) =>
  useQuery({
    queryKey: [QueryKey.GET_ME],
    queryFn: () => getMe(),
    refetchOnMount: 'always',
    ...options,
  })

export default useGetMe