import { isAxiosError } from 'axios'

import type { Balance } from '@/src/interfaces/user.interface'
import axiosClient from '@/src/libs/axios.lib'
import { RecordModel } from 'pocketbase'

export const getMe = async () => {
  try {
    const { data } = await axiosClient.get<RecordModel>('/auth/me')

    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data
    }

    throw error
  }
}

export const getBalance = async () => {
  try {
    const { data } = await axiosClient.get<Balance>('/auth/me/balance')

    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data
    }
    throw error
  }
}