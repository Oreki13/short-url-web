export const NoDataFound = () => {
    return (
        <div className='flex flex-col items-center justify-center py-16 px-6'>
            <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Links Found</h3>
            <p className="text-gray-400 text-center max-w-md">
                You haven't created any short links yet. Click the "Add New Link" button to get started.
            </p>
        </div>
    )
}