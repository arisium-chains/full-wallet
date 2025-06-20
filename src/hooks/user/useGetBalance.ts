import type { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

import { QueryKey } from '@/src/enums/query-key.enum'
import type { Balance } from '@/src/interfaces/user.interface'
import { getBalance } from '@/src/services/user.service'

interface UseGetBalanceProps {
  options?: Omit<UseQueryOptions<Balance>, 'queryKey' | 'queryFn'>
}

export const useGetBalance = ({ options }: UseGetBalanceProps = {}) =>
  useQuery({
    queryKey: [QueryKey.GET_BALANCE],
    queryFn: () => getBalance(),
    refetchOnMount: 'always',
    ...options,
  })

export default useGetBalance