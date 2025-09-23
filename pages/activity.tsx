import { FormEvent, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import HeadHtml from '@/components/HeadHtml';
import HeaderDashboard from '@/components/HeaderDashboard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth, withAuth } from '@/lib/context/AuthContext';
import { useActivityLog } from '@/lib/hooks/useActivityLog';
import { ActivityRoleAccess, ActivityType, ActivityTypeValue, normalizeRoleName } from '@/lib/constants/activity';
import { useRouter } from 'next/router';

const ActivityPage = () => {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const roleName = useMemo(() => normalizeRoleName(user?.role?.name ?? null), [user?.role?.name]);
    const isAuthorized = useMemo(() => roleName ? ActivityRoleAccess.has(roleName) : false, [roleName]);

    useEffect(() => {
        if (!authLoading && user && !isAuthorized) {
            router.replace('/');
        }
    }, [authLoading, isAuthorized, router, user]);

    const {
        logs,
        paging,
        isLoading: activityLoading,
        isValidating,
        filters,
        setFilters,
        resetFilters,
        error,
    } = useActivityLog(undefined, isAuthorized);

    const [searchValue, setSearchValue] = useState(filters.search ?? '');

    useEffect(() => {
        setSearchValue(filters.search ?? '');
    }, [filters.search]);

    const activityTypeOptions = useMemo(() => ['ALL', ...Object.values(ActivityType)], []);

    if (authLoading || !user) {
        return <LoadingSpinner message="Loading activity log..." fullScreen />;
    }

    if (!isAuthorized) {
        return <LoadingSpinner message="Redirecting..." fullScreen />;
    }

    const isBusy = activityLoading || isValidating;

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFilters({ search: searchValue.trim(), page: '1' });
    };

    const handleActivityTypeChange = (value: string) => {
        setFilters({ activity_type: value === 'ALL' ? undefined : value as ActivityTypeValue, page: '1' });
    };

    const handleSortChange = (value: 'asc' | 'desc') => {
        setFilters({ sort: value, page: filters.page });
    };

    const handleLimitChange = (value: string) => {
        setFilters({ limit: value, page: '1' });
    };

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (!paging) return;

        const currentPage = paging.current_page;
        if (direction === 'prev' && currentPage > 1) {
            setFilters({ page: String(currentPage - 1) });
        }
        if (direction === 'next' && currentPage < paging.total_page) {
            setFilters({ page: String(currentPage + 1) });
        }
    };

    const handleResetFilters = () => {
        resetFilters();
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
            <HeadHtml title='Activity Log' />

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-32 right-24 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-32 left-16 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <HeaderDashboard title='Activity Log' />

            <main className="relative">
                <div className='max-w-6xl mx-auto px-6 py-6 space-y-6'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold text-white'>Activity Overview</h1>
                            <p className='text-gray-400'>Track system interactions and user actions in real-time.</p>
                        </div>
                        <button
                            onClick={handleResetFilters}
                            className='inline-flex items-center gap-2 self-start sm:self-auto bg-gray-800/60 text-gray-300 hover:text-white border border-gray-700 rounded-xl px-4 py-2 transition-colors duration-200'
                            type='button'
                        >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 4v5h.582M20 20v-5h-.581M5 9a7 7 0 0111.906-3.032M19 15a7 7 0 01-11.906 3.032' />
                            </svg>
                            Reset Filters
                        </button>
                    </div>

                    <div className='bg-gray-900/40 backdrop-blur-xs border border-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-black/20'>
                        <div className='border-b border-gray-800 p-4 sm:p-6'>
                            <form
                                onSubmit={handleSearchSubmit}
                                className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'
                            >
                                <div className='flex flex-col sm:flex-row gap-4 sm:items-center flex-1'>
                                    <div className='flex-1'>
                                        <label className='block text-sm text-gray-400 mb-1'>Search</label>
                                        <div className='flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 focus-within:border-sky-500'>
                                            <svg className='w-4 h-4 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-4.35-4.35M18 11a7 7 0 11-14 0 7 7 0 0114 0z' />
                                            </svg>
                                            <input
                                                type='text'
                                                value={searchValue}
                                                onChange={(event) => setSearchValue(event.target.value)}
                                                placeholder='Search activity description or IP...'
                                                className='bg-transparent w-full text-sm text-white placeholder:text-gray-600 focus:outline-hidden'
                                            />
                                        </div>
                                    </div>

                                    <div className='sm:w-44'>
                                        <label className='block text-sm text-gray-400 mb-1'>Activity Type</label>
                                        <div className='relative'>
                                            <select
                                                value={filters.activity_type ?? 'ALL'}
                                                onChange={(event) => handleActivityTypeChange(event.target.value)}
                                                className='w-full appearance-none bg-gray-900 border border-gray-700 text-sm text-gray-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-sky-500'
                                            >
                                                {activityTypeOptions.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type.replace(/_/g, ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className='sm:w-36'>
                                        <label className='block text-sm text-gray-400 mb-1'>Sort</label>
                                        <div className='relative'>
                                            <select
                                                value={filters.sort ?? 'desc'}
                                                onChange={(event) => handleSortChange(event.target.value as 'asc' | 'desc')}
                                                className='w-full appearance-none bg-gray-900 border border-gray-700 text-sm text-gray-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-sky-500'
                                            >
                                                <option value='desc'>Newest first</option>
                                                <option value='asc'>Oldest first</option>
                                            </select>
                                            <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    <div className='sm:w-36'>
                                        <label className='block text-sm text-gray-400 mb-1'>Per Page</label>
                                        <div className='relative'>
                                            <select
                                                value={filters.limit ?? '10'}
                                                onChange={(event) => handleLimitChange(event.target.value)}
                                                className='w-full appearance-none bg-gray-900 border border-gray-700 text-sm text-gray-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-sky-500'
                                            >
                                                {['10', '20', '50', '100'].map((limitOption) => (
                                                    <option key={limitOption} value={limitOption}>
                                                        {limitOption}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500'>
                                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type='submit'
                                    className='inline-flex items-center justify-center gap-2 bg-linear-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                    Apply
                                </button>
                            </form>
                        </div>

                        <div className='relative overflow-x-auto'>
                            {isBusy && (
                                <div className='absolute inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs z-10'>
                                    <LoadingSpinner message='Fetching activities...' size='sm' />
                                </div>
                            )}

                            {error && (
                                <div className='px-6 py-4 text-sm text-red-400 border-b border-red-500/30 bg-red-500/5'>
                                    {error}
                                </div>
                            )}

                            <table className='min-w-full divide-y divide-gray-800'>
                                <thead className='bg-gray-900/70'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Activity</th>
                                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Description</th>
                                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Metadata</th>
                                        <th className='px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider'>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-gray-900/30 divide-y divide-gray-800'>
                                    {logs.length === 0 && !isBusy ? (
                                        <tr>
                                            <td colSpan={4} className='px-6 py-10 text-center text-gray-500 text-sm'>
                                                No activity records found for the selected filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log.id} className='hover:bg-gray-800/40 transition-colors duration-150'>
                                                <td className='px-6 py-4'>
                                                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-200 text-xs font-semibold uppercase tracking-wide'>
                                                        {log.activity_type.replace(/_/g, ' ')}
                                                    </div>
                                                    <p className='text-xs text-gray-500 mt-2'>User ID: {log.user_id}</p>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <p className='text-sm text-gray-200'>{log.description}</p>
                                                    {log.resource_type && (
                                                        <p className='text-xs text-gray-500 mt-1'>Resource: {log.resource_type}{log.resource_id ? ` • ${log.resource_id}` : ''}</p>
                                                    )}
                                                </td>
                                                <td className='px-6 py-4 text-sm text-gray-300'>
                                                    <p className='truncate max-w-xs'>IP: {log.ip_address ?? 'Unknown'}</p>
                                                    <p className='truncate max-w-xs text-xs text-gray-500 mt-1'>Agent: {log.user_agent ?? 'Unknown'}</p>
                                                </td>
                                                <td className='px-6 py-4 text-sm text-gray-300'>
                                                    <p>{dayjs(log.createdAt).format('DD MMM YYYY HH:mm:ss')}</p>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-gray-800 bg-gray-900/60'>
                            <div className='text-xs text-gray-500'>
                                Page {paging?.current_page ?? 1} of {paging?.total_page ?? 1} • Total records: {paging?.total_data ?? logs.length}
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    type='button'
                                    onClick={() => handlePageChange('prev')}
                                    disabled={!paging || paging.current_page <= 1}
                                    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed'
                                >
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
                                    </svg>
                                    Prev
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handlePageChange('next')}
                                    disabled={!paging || paging.current_page >= paging.total_page}
                                    className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed'
                                >
                                    Next
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default withAuth(ActivityPage);
