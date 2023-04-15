import React, { FC, useEffect, useRef } from 'react'

interface TextInputParam {
    label: string
    type?: React.HTMLInputTypeAttribute | undefined
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
    name?: string | undefined
    isError?: boolean
    textOnError?: string | undefined
}

export const TextInput: FC<TextInputParam> = ({ label, type, onChange, name, isError, textOnError }) => {
    const textRef = useRef<HTMLInputElement>(null!)

    useEffect(() => {
        handleOnFieldError()
        return () => {
            isError
        }
    }, [isError])


    const handleOnFieldError = () => {
        if (isError) {
            textRef.current.classList.add("border-red-500")
            textRef.current.classList.remove("focus:outline-sky-800")
        } else {
            textRef.current.classList.remove('border-red-500')
            textRef.current.classList.add("focus:outline-sky-800")
        }
    }
    return (
        <div className='flex flex-col items-start w-full'>
            <span className='mb-1 font-semibold '>{label}</span>
            <input className='border-2 focus:outline-sky-800 px-2 py-1 w-full' type={type} onChange={onChange} name={name} ref={textRef} />
            {isError ? <p className='text-red-500 font-semibold inline-block text-xs mt-1'>{textOnError ?? "Please check this field"}</p> : <div></div>}
        </div>
    )
}
