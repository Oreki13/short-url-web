import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import ActivityProvider from '@/lib/provider/activity';
import { ActivityLogQueryParams, ActivityLogResponse } from '@/type/Activity';

const DEFAULT_PARAMS: ActivityLogQueryParams = {
    page: '1',
    limit: '10',
    sort: 'desc',
};

const mergeParams = (
    base: ActivityLogQueryParams,
    updates: Partial<ActivityLogQueryParams>
): ActivityLogQueryParams => {
    const next = { ...base } as ActivityLogQueryParams;

    Object.entries(updates).forEach(([key, value]) => {
        const typedKey = key as keyof ActivityLogQueryParams;
        if (value === undefined || value === null || value === '') {
            delete next[typedKey];
        } else {
            next[typedKey] = value;
        }
    });

    return { ...DEFAULT_PARAMS, ...next };
};

export const useActivityLog = (initialParams?: ActivityLogQueryParams, enabled: boolean = true) => {
    const [filters, setFiltersState] = useState<ActivityLogQueryParams>(
        mergeParams(DEFAULT_PARAMS, initialParams ?? {})
    );

    const swrKey = useMemo(() => (enabled ? ['activity-log', filters] : null), [enabled, filters]);

    const { data, error, isLoading, isValidating, mutate } = useSWR<ActivityLogResponse>(
        swrKey,
        () => ActivityProvider.getActivityLog(filters),
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    const updateFilters = useCallback((updates: Partial<ActivityLogQueryParams>) => {
        setFiltersState((prev) => mergeParams(prev, updates));
    }, []);

    const resetFilters = useCallback(() => {
        setFiltersState({ ...DEFAULT_PARAMS });
    }, []);

    const responseError = useMemo(() => {
        if (error instanceof Error) {
            return error.message;
        }
        if (data && data.status !== 'OK') {
            return data.message || 'Failed to load activity log';
        }
        return null;
    }, [data, error]);

    const payload = data?.data;

    return {
        filters,
        setFilters: updateFilters,
        resetFilters,
        logs: payload?.data ?? [],
        paging: payload?.paging ?? null,
        isLoading,
        isValidating,
        error: responseError,
        refresh: mutate,
    };
};
