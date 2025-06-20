import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '@/src/services/transaction.services'
import { QueryKey } from '@/src/enums/query-key.enum'

export const useGetTransactions = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [QueryKey.TRANSACTIONS, page, limit],
    queryFn: () => getTransactions(page, limit),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  })
}