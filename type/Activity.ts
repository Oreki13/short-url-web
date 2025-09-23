import { ApiResponse, PagingData } from './ApiResponse';
import { ActivityTypeValue } from '@/lib/constants/activity';

export interface ActivityLogItem {
    id: string;
    user_id: string;
    activity_type: ActivityTypeValue;
    description: string;
    ip_address: string | null;
    user_agent: string | null;
    resource_id: string | null;
    resource_type: string | null;
    createdAt: string;
}

export interface ActivityLogResponseData {
    data: ActivityLogItem[];
    paging: PagingData;
}

export type ActivityLogResponse = ApiResponse & {
    data: ActivityLogResponseData | null;
};

export interface ActivityLogQueryParams {
    page?: string;
    limit?: string;
    sort?: 'asc' | 'desc';
    user_id?: string;
    activity_type?: ActivityTypeValue;
    search?: string;
}
