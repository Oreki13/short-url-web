import {z} from "zod";
import {useState} from "react";
import useSWRMutation from "swr/mutation";
import ApiEndpoint from "@/lib/helpers/api_endpoint";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import ShortUrlProvider from "@/lib/provider/short_url";
import {AddShortUrlResponse} from "@/type/AddShortUrl";
import {useFetchListShortUrl} from "@/lib/hooks/useFetchListShortUrl";
import {useModalFormLinkStore} from "@/lib/stores/dashboard/modalFormLinkStore";
import {ApiResponse} from "@/type/ApiResponse";
import {useModalDeleteConfirmStore} from "@/lib/stores/dashboard/modalDeleteConfirm";

export enum TypeFormAddLink {
    add, edit
}

const schema = z.object({
    "Title": z.string().min(2),
    "Destination": z.string().min(2).url("Invalid URL"),
    "Path": z.string().min(2),
})


type FormFields = z.infer<typeof schema>;

export const useManageLink = () => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
    let idLink: string = "";
    const setClose = useModalFormLinkStore(state => state.setClose)
    const setCloseDeleteModal = useModalDeleteConfirmStore(state => state.setClose)


    const {mutate} = useFetchListShortUrl();
    const {trigger} = useSWRMutation(ApiEndpoint.short, ShortUrlProvider.addData)
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {
            errors,
            isSubmitting,
            isLoading,
        }
    } = useForm<FormFields>({
        resolver: zodResolver(schema)
    });

    const addLink: SubmitHandler<FormFields> = async (data) => {
        if (isLoading || isSubmitting) return
        setErrorMessage("")
        const resData: AddShortUrlResponse = await trigger({
            title: data.Title,
            destination: data.Destination,
            path: data.Path
        })
        if (resData != null) {
            if (resData.status === 'OK') {
                await mutate()
                reset()
                setClose()
            } else {
                setErrorMessage(resData.message ?? "Something went wrong")
            }
        }
    }

    const editLink: SubmitHandler<FormFields> = async (val) => {
        if (isLoading) return
        setErrorMessage("")
        const resData: AddShortUrlResponse = await ShortUrlProvider.editData(ApiEndpoint.short + "/" + idLink, {
            arg: {
                title: val.Title,
                destination: val.Destination,
                path: val.Path
            }
        })
        idLink = ""
        if (resData != null) {
            if (resData.status === 'OK') {
                await mutate()
                reset()
                setClose()
            } else {
                setErrorMessage(resData.message ?? "Something went wrong")
            }
        }
    }

    const deleteLink = async (id: string) => {
        if (isLoadingDelete) return
        setIsLoadingDelete(true)
        setErrorMessage("")
        const resData: ApiResponse = await ShortUrlProvider.deleteData(ApiEndpoint.short + "/" + id)
        setIsLoadingDelete(false)
        setCloseDeleteModal();
        if (resData != null) {
            if (resData.status === 'OK') {
                await mutate()
            } else {
                setErrorMessage(resData.message ?? "Something went wrong")
            }
        }
    }

    const setIdLink = (id: string) => {
        idLink = id;
    }

    return {
        register,
        setValue,
        errors,
        isSubmitting,
        isLoading,
        errorMessage,
        handleSubmit,
        addLink,
        editLink,
        setIdLink,
        deleteLink,
        isLoadingDelete,
    }
}