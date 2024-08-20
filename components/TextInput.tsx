import React, {FC} from 'react'
import {UseFormRegister} from "react-hook-form";
import {Field, Input, Label} from "@headlessui/react";
import clsx from "clsx";

interface TextInputParam {
    label: string
    type?: React.HTMLInputTypeAttribute | undefined
    name?: string | undefined
    textOnError?: string | undefined
    register: UseFormRegister<any>
}

export const TextInput: FC<TextInputParam> = ({
                                                  label,
                                                  type,
                                                  name,
                                                  textOnError,
                                                  register,
                                              }) => {
    return (
        <Field className='flex flex-col items-start w-full'>
            <Label className="text-sm/6 font-semibold ">{label}</Label>
            <Input
                {...register(label)}
                type={type}
                className={clsx(
                    'mt-3 block w-full rounded-lg border-blue-200 bg-black/10 py-1.5 px-3 text-sm/6 text-black',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
                )}
            />
            {textOnError && (
                <p className='text-red-500 font-semibold inline-block text-xs mt-1'>{textOnError ?? "Please check this field"}</p>
            )}
        </Field>
    )
}