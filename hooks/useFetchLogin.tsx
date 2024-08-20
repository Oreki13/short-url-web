import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import { useRouter } from 'next/router'
import {setCookie} from "cookies-next";
import {Api_response} from "@/type/api_response";
import useSWRMutation from "swr/mutation";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import Auth from "@/lib/provider/auth";


type Modify<T, R> = Omit<T, keyof R> & R;
type LoginResponse = Modify<Api_response, {
    data: { token: string } | null
}>

const schema = z.object({
    "E-Mail": z.string().email(),
    "Password": z.string().min(8),
})

type FormFields = z.infer<typeof schema>;

export const useFetchLogin = () => {
    const router = useRouter()
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const { trigger } = useSWRMutation(ApiEndpoint.login, Auth.login)
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        }
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    });

    const onSubmit:SubmitHandler<FormFields> =async (data)=>{
        // setLoading(true)
        const resData: LoginResponse = await trigger({ email: data["E-Mail"], password: data.Password })
        if (resData != null) {
            if (resData.status === 'OK') {
                setCookie('token', resData.data?.token)
                await router.push('/')
            } else {
                if (resData.code === "INVALID_CREDENTIALS") {
                    // setIsEmailError(true)
                    setIsOpenDialog(true);
                } else{
                    setIsOpenDialog(true);

                }
            }
        }
    }

    const onClickCloseDialog= ()=>{
        setIsOpenDialog(!isOpenDialog);
    }

    return {register, handleSubmit, onSubmit, isSubmitting, errors, isOpenDialog, onClickCloseDialog}
}