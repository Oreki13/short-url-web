import { useRouter } from "next/router";
import { z } from "zod";
import useSWRMutation from "swr/mutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Auth from "@/lib/provider/auth";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import { ApiResponse } from "@/type/ApiResponse";
import { TokenManager } from "../utils/tokenManager";
import { useAuth } from "../context/AuthContext";

type Modify<T, R> = Omit<T, keyof R> & R;
type LoginResponse = Modify<ApiResponse, {
    data: {
        access_token: string,
        refresh_token: string,
        expires_in: number,
    } | null
}>

const schema = z.object({
    "E-Mail": z.string().email(),
    "Password": z.string().min(2),
})

type FormFields = z.infer<typeof schema>;

export const useFetchLogin = () => {
    const { login: authLogin } = useAuth()
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { trigger } = useSWRMutation(ApiEndpoint.login, Auth.login)
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
        try {
            const resData: LoginResponse = await trigger({
                email: data["E-Mail"],
                password: data.Password
            })

            if (resData != null) {
                if (resData.status === 'OK' && resData.data) {
                    // Set tokens first
                    TokenManager.setTokens({
                        access_token: resData.data.access_token,
                        refresh_token: resData.data.refresh_token,
                        expires_in: resData.data.expires_in
                    });

                    // Use AuthContext login for proper navigation
                    await authLogin(resData.data.access_token, undefined, '/');

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
        } catch (error) {
            console.error('Login error:', error);
            setIsOpenDialog(true);
            setErrorMessage("Login failed. Please try again.");
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