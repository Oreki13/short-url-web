import { DefaultHeader } from ".";

const Auth = {

    login: async (url: string, { arg }: { arg: { email: string, password: string } }) => {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(arg),
            cache:"no-cache",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        }).then(res => res.json()).catch((e) => {
            console.log(e);
        })
    },
    verify: async (url: string) => {
        return fetch(url, {
            method: "GET",
            headers: DefaultHeader()
        }).then(res => res.json()).catch((e) => console.log(e)
        )
    }
}

export default Auth




