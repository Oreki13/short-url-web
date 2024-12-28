import {useRouter} from "next/router";
import {z} from "zod";
import useSWRMutation from "swr/mutation";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {setCookie} from "cookies-next";
import {useState} from "react";
import Auth from "@/lib/provider/auth";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import {ApiResponse} from "@/type/ApiResponse";

type Modify<T, R> = Omit<T, keyof R> & R;
type LoginResponse = Modify<ApiResponse, {
    data: { token: string } | null
}>

const schema = z.object({
    "E-Mail": z.string().email(),
    "Password": z.string().min(2),
})

type FormFields = z.infer<typeof schema>;

export const useFetchLogin = () => {
    const router = useRouter()
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const {trigger} = useSWRMutation(ApiEndpoint.login, Auth.login)
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
            isLoading,
        }
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        const resData: LoginResponse = await trigger({email: data["E-Mail"], password: data.Password})
        if (resData != null) {
            if (resData.status === 'OK') {
                setCookie('token', resData.data, {secure: true, maxAge: 1300000, sameSite: 'strict', })
                await router.push('/')
            } else {
                if (resData.code === "INVALID_CREDENTIAL") {
                    setIsOpenDialog(true);
                    setErrorMessage("Invalid email or password")
                } else {
                    setIsOpenDialog(true);
                    setErrorMessage("Something went wrong")
                }
            }
        }
    }

    const onClickCloseDialog = () => {
        setIsOpenDialog(!isOpenDialog);
    }

    return {
        register,
        handleSubmit,
        onSubmit,
        isSubmitting,
        errors,
        isOpenDialog,
        onClickCloseDialog,
        errorMessage,
        isLoading
    }
}