const host = process.env.NEXT_PUBLIC_API_URL

const ApiEndpoint = {
    login: host + '/api/v1/auth/login',
    logout: host + '/api/v1/auth/logout',
    verify: host + '/api/v1/auth/verify',
    short: host + '/api/v1/short',
    csrfToken: host + '/csrf-token',
    userDetail: (id: string) => host + `/api/v1/user/${id}`,
    activityLog: host + '/api/v1/activity/log'
}

export default ApiEndpoint
