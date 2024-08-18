const host = process.env.NEXT_PUBLIC_BE_HOST

const ApiEndpoint = {
    login: host + '/auth/login',
    verify: host + '/auth/verify',
    listShortUrl: host + '/short'
}

export default ApiEndpoint