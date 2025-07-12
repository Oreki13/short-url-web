import { DefaultHeader, Fetcher } from ".";

const Auth = {

    login: async (url: string, { arg }: { arg: { email: string, password: string } }) => {
        return Fetcher(url, {
            method: 'POST',
            body: JSON.stringify(arg),
            headers: DefaultHeader(),
            cache: "no-cache",
        }).then(res => res).catch((e) => {
            console.log(e);
        })
    },
    verify: async (url: string) => {
        return Fetcher(url, {
            method: "GET",
            headers: DefaultHeader(),
            credentials: 'include',
        }).then(res => res).catch((e) => {
            console.log(e);
        });
    },
    logout: async (url: string) => {
        return Fetcher(url, {
            method: "POST",
            headers: DefaultHeader(),
            credentials: 'include',
        }).then(res => res).catch((e) => {
            console.log(e);
        });
    }
}

export default Auth




