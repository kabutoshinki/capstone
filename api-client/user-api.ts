import { ChangePasswordPayload, ChangeUserStatus } from '@/types';
import axiosClient from './axios-client';

export const userApi = {
    changePassword: async (payload: ChangePasswordPayload) => {
        return await axiosClient.patch('/user/change-password', payload);
    },
    changeUserStatus: async (payload: ChangeUserStatus) => {
        return await axiosClient.patch('/user/change-user-status', payload);
    }
};
