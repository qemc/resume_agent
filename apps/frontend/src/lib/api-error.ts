import axios from 'axios';
import type { ApiErrorBody } from '@/types/api';

export function getApiErrorMessage(error: unknown, fallback: string): string {
    if (axios.isAxiosError<ApiErrorBody>(error) && error.response?.data?.message) {
        return error.response.data.message;
    }
    return fallback;
}
