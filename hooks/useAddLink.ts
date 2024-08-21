import {z} from "zod";
import {useState} from "react";
import useSWRMutation from "swr/mutation";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ShortUrlProvider from "@/lib/provider/short_url";
import {AddShortUrlResponse} from "@/type/AddShortUrl";

const schema = z.object({
    "Title": z.string().min(2),
    "Destination": z.string().min(2).url("Invalid URL"),
    "Path": z.string().min(2),
})

type FormFields = z.infer<typeof schema>;

export const useAddLink = (closeModal: ()=> any) => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const {trigger} = useSWRMutation(ApiEndpoint.short, ShortUrlProvider.addData)
    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
            isLoading,

        }
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        setErrorMessage("")
        const resData: AddShortUrlResponse = await trigger({
            title: data.Title,
            destination: data.Destination,
            path: data.Path
        })
        if (resData != null) {
            if (resData.status === 'OK') {
                closeModal()
                reset()
            } else {
                setErrorMessage(resData.message ?? "Something went wrong")
            }
        }

    }
    return {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        isLoading,
        onSubmit,
        errorMessage,
    }
}