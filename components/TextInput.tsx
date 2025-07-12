import React, { FC } from 'react'
import { UseFormRegister } from "react-hook-form";
import { Field, Input, Label } from "@headlessui/react";
import clsx from "clsx";

interface TextInputParam {
    label: string
    type?: React.HTMLInputTypeAttribute | undefined
    name?: string | undefined
    textOnError?: string | undefined
    register: UseFormRegister<any>
    value?: string | undefined
}

export const TextInput: FC<TextInputParam> = ({
    label,
    type,
    name,
    textOnError,
    register,
    value,
}) => {
    return (
        <Field className='flex flex-col items-start w-full'>
            <Label className="text-sm/6 font-medium text-gray-300 mb-2">{label}</Label>
            <Input
                {...register(name !== undefined ? name : label)}
                value={value}
                type={type}
                className={clsx(
                    'block w-full rounded-xl border border-gray-600 bg-gray-800/50 py-3 px-4 text-sm text-white placeholder-gray-400',
                    'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200',
                    'hover:border-gray-500'
                )}
            />
            {textOnError && (
                <p className='text-red-400 font-medium text-xs mt-2 flex items-center gap-1'>
                    <span className="text-red-400">⚠</span>
                    {textOnError ?? "Please check this field"}
                </p>
            )}
        </Field>
    )
}