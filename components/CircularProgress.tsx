export const CircularProgress = () => {
    return (
        <div className='flex flex-col items-center justify-center py-16 px-6'>
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-700 border-t-sky-500 rounded-full animate-spin"></div>
                <div className="w-12 h-12 border-4 border-transparent border-t-sky-400 rounded-full animate-spin absolute top-2 left-2" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-gray-400 mt-6 text-center">Loading your links...</p>
        </div>
    )
}