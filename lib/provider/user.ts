import ApiEndpoint from '@/lib/helpers/api_endpoint';
import { DefaultHeader, Fetcher } from '.';
import { UserDetailResponse } from '@/type/User';

const UserProvider = {
    getUserDetail: async (userId: string): Promise<UserDetailResponse> => {
        if (!userId) {
            throw new Error('User id is required to fetch user detail');
        }

        return Fetcher(ApiEndpoint.userDetail(userId), {
            method: 'GET',
            credentials: 'include',
            headers: DefaultHeader(),
            cache: 'no-cache',
        }).then((res) => res as UserDetailResponse);
    },
};

export default UserProvider;
