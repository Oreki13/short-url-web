// import { CookieManager, authCookieManager } from '@/lib/utils/cookieManager';
// import { TokenManager } from '@/lib/utils/tokenManager';
// import useSWR from 'swr';

// /**
//  * Enhanced SWR fetcher dengan automatic cookie handling
//  */
// export const swrCookieFetcher = (cookieManager: CookieManager) => {
//     return async (url: string) => {
//         try {
//             // Use cookie manager's fetch method to handle Set-Cookie headers
//             const response = await cookieManager.fetchWithCookieHandling(url, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     ...TokenManager.getAuthHeader(),
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             return response.json();
//         } catch (error) {
//             console.error('SWR Cookie Fetch error:', error);
//             throw error;
//         }
//     };
// };

// /**
//  * Hook untuk login dengan automatic cookie handling
//  */
// export const useLoginWithCookieManager = () => {
//     // Custom cookie manager untuk login
//     const loginCookieManager = new CookieManager({
//         allowedKeys: [
//             'access_token',
//             'refresh_token',
//             'user_session',
//             'csrf_token',
//             'remember_me',
//             'last_login_time'
//         ],
//         keyMappings: {
//             'access_token': 'token',
//             'refresh_token': 'refresh_token',
//             'user_session': 'session_id',
//             'csrf_token': 'csrf',
//             'remember_me': 'remember',
//             'last_login_time': 'last_login'
//         },
//         defaultOptions: {
//             secure: true,
//             sameSite: 'strict',
//         },
//         transformers: {
//             'access_token': (value) => {
//                 console.log('Processing access token...');
//                 return value;
//             },
//             'last_login_time': (value) => {
//                 // Convert to ISO string if needed
//                 try {
//                     const date = new Date(value);
//                     return date.toISOString();
//                 } catch {
//                     return value;
//                 }
//             },
//         },
//     });

//     const loginUser = async (credentials: { email: string; password: string }) => {
//         try {
//             const response = await loginCookieManager.fetchWithCookieHandling('/api/v1/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(credentials),
//             });

//             if (!response.ok) {
//                 throw new Error('Login failed');
//             }

//             const data = await response.json();

//             // Cookie manager sudah otomatis memproses Set-Cookie headers
//             console.log('Login successful, cookies processed automatically');
//             console.log('Stored cookies:', loginCookieManager.getAllowedCookies());

//             return data;
//         } catch (error) {
//             console.error('Login error:', error);
//             throw error;
//         }
//     };

//     const logout = () => {
//         // Clear semua cookies yang diizinkan
//         loginCookieManager.clearAllowedCookies();
//         console.log('All auth cookies cleared');
//     };

//     const getCookieData = () => {
//         return loginCookieManager.getAllowedCookies();
//     };

//     return {
//         loginUser,
//         logout,
//         getCookieData,
//         cookieManager: loginCookieManager,
//     };
// };

// /**
//  * Hook untuk user preferences dengan cookie handling
//  */
// export const usePreferencesWithCookies = () => {
//     const preferencesCookieManager = new CookieManager({
//         allowedKeys: [
//             'theme',
//             'language',
//             'timezone',
//             'notifications_enabled',
//             'sidebar_collapsed',
//             'grid_view_preference'
//         ],
//         defaultOptions: {
//             secure: true,
//             sameSite: 'lax',
//             maxAge: 365 * 24 * 60 * 60, // 1 year
//         },
//         transformers: {
//             'notifications_enabled': (value) => {
//                 // Convert string to boolean
//                 return value.toLowerCase() === 'true' ? 'true' : 'false';
//             },
//             'sidebar_collapsed': (value) => {
//                 return value.toLowerCase() === 'true' ? 'true' : 'false';
//             },
//         },
//     });

//     // SWR untuk preferences dengan cookie handling
//     const { data: preferences, mutate } = useSWR(
//         '/api/user/preferences',
//         swrCookieFetcher(preferencesCookieManager),
//         {
//             revalidateOnFocus: false,
//             revalidateOnReconnect: false,
//         }
//     );

//     const updatePreference = async (key: string, value: string) => {
//         try {
//             const response = await preferencesCookieManager.fetchWithCookieHandling('/api/user/preferences', {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     ...TokenManager.getAuthHeader(),
//                 },
//                 body: JSON.stringify({ [key]: value }),
//             });

//             if (response.ok) {
//                 // Trigger SWR revalidation
//                 mutate();
//                 console.log(`Preference ${key} updated to ${value}`);
//             }
//         } catch (error) {
//             console.error('Error updating preference:', error);
//         }
//     };

//     return {
//         preferences,
//         updatePreference,
//         cookieManager: preferencesCookieManager,
//         getCookiePreferences: () => preferencesCookieManager.getAllowedCookies(),
//     };
// };

// /**
//  * Hook untuk analytics tracking dengan cookies
//  */
// export const useAnalyticsWithCookies = () => {
//     const analyticsCookieManager = new CookieManager({
//         allowedKeys: [
//             'analytics_id',
//             'session_id',
//             'visitor_id',
//             'campaign_source',
//             'referrer_url',
//             'first_visit_time'
//         ],
//         keyMappings: {
//             'analytics_id': 'ga_id',
//             'session_id': 'session',
//             'visitor_id': 'visitor',
//             'campaign_source': 'utm_source',
//             'referrer_url': 'ref',
//             'first_visit_time': 'first_visit'
//         },
//         defaultOptions: {
//             secure: true,
//             sameSite: 'lax',
//             maxAge: 365 * 24 * 60 * 60, // 1 year
//         },
//     });

//     const trackEvent = async (eventName: string, properties: Record<string, any>) => {
//         try {
//             await analyticsCookieManager.fetchWithCookieHandling('/api/analytics/track', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     event: eventName,
//                     properties,
//                     timestamp: new Date().toISOString(),
//                 }),
//             });
//         } catch (error) {
//             console.error('Analytics tracking error:', error);
//         }
//     };

//     return {
//         trackEvent,
//         getAnalyticsCookies: () => analyticsCookieManager.getAllowedCookies(),
//         cookieManager: analyticsCookieManager,
//     };
// };

// // Export pre-configured fetchers
// export const authSwrFetcher = swrCookieFetcher(authCookieManager);
