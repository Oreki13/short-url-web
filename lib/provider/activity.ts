import ApiEndpoint from '@/lib/helpers/api_endpoint';
import { ActivityLogQueryParams, ActivityLogResponse } from '@/type/Activity';
import { DefaultHeader, Fetcher } from '.';

const buildQueryString = (params?: ActivityLogQueryParams): string => {
    if (!params) return '';

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'undefined' || value === null || value === '') {
            return;
        }

        searchParams.append(key, value.toString());
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
};

const ActivityProvider = {
    getActivityLog: async (params?: ActivityLogQueryParams): Promise<ActivityLogResponse> => {
        const queryString = buildQueryString(params);

        return Fetcher(`${ApiEndpoint.activityLog}${queryString}`, {
            method: 'GET',
            credentials: 'include',
            headers: DefaultHeader(),
            cache: 'no-cache',
        }) as Promise<ActivityLogResponse>;
    },
};

export default ActivityProvider;
