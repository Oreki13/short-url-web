import { useRouter } from "next/router";
import { z } from "zod";
import useSWRMutation from "swr/mutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Auth from "@/lib/provider/auth";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import { ApiResponse } from "@/type/ApiResponse";

type Modify<T, R> = Omit<T, keyof R> & R;

type RegisterResponse = Modify<ApiResponse, {
    data: {
        id: string,
        name: string,
        email: string,
        role: {
            name: string
        }
    } | null
}>;

const schema = z.object({
    "Username": z.string().min(2, "Username must be at least 2 characters"),
    "E-Mail": z.string().email("Enter a valid email address"),
    "Password": z.string().min(6, "Password must be at least 6 characters"),
    "Confirm Password": z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.Password === data["Confirm Password"], {
    message: "Passwords do not match",
    path: ["Confirm Password"],
});

type FormFields = z.infer<typeof schema>;

export const useFetchRegister = () => {
    const router = useRouter();
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { trigger, isMutating } = useSWRMutation(ApiEndpoint.register, Auth.register);

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
            const resData: RegisterResponse = await trigger({
                name: data.Username,
                email: data["E-Mail"],
                password: data.Password,
            });

            if (resData) {
                if (resData.status === "OK" && resData.code === "SUCCESS") {
                    await router.push('/login');
                    return;
                }

                if (resData.code === "USER_ALREADY_EXISTS") {
                    setErrorMessage("User already exists. Please try logging in instead.");
                } else {
                    setErrorMessage(resData.message ?? "Registration failed. Please try again.");
                }

                setIsOpenDialog(true);
            }
        } catch (error) {
            console.error('Register error:', error);
            setErrorMessage("Registration failed. Please try again.");
            setIsOpenDialog(true);
        }
    };

    const onClickCloseDialog = () => {
        setIsOpenDialog(false);
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        isSubmitting,
        isLoading,
        isMutating,
        errors,
        isOpenDialog,
        onClickCloseDialog,
        errorMessage,
    };
};
