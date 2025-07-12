const host = process.env.NEXT_PUBLIC_API_URL

const ApiEndpoint = {
    login: host + '/api/v1/auth/login',
    verify: host + '/api/v1/auth/verify',
    short: host + '/api/v1/short',
    csrfToken: host + '/csrf-token'
}

export default ApiEndpoint