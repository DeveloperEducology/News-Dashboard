import React, { useState, useCallback } from 'react';

// A constant array of all available categories
const ALL_CATEGORIES = [
    "Sports",
    "Entertainment",
    "Politics",
    "National",
    "International",
    "Telangana",
    "AndhraPradesh",
    "Viral",
];

/**
 * A recursive component to render form fields for a piece of data.
 * It handles nested objects and arrays, with special handling for the 'media' array.
 * @param {object} props - The component props.
 * @param {string[]} props.path - The path to the current field (e.g., ['data', 'user']).
 * @param {string} props.fieldKey - The key of the field (e.g., 'name').
 * @param {any} props.fieldValue - The value of the field.
 * @param {Function} props.onFieldChange - Callback to update a field's value.
 * @param {Function} props.onItemRemove - Callback to remove an item from an array.
 * @returns {JSX.Element}
 */
const FormField = ({ path, fieldKey, fieldValue, onFieldChange, onItemRemove }) => {
    const currentPath = [...path, fieldKey];
    const fieldId = currentPath.join('.');

    // --- MODIFIED: Special handling for arrays to allow item removal ---
    if (Array.isArray(fieldValue)) {
        return (
            <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-md font-semibold text-cyan-400 capitalize mb-2">{fieldKey.replace(/_/g, ' ')}</h4>
                {fieldValue.map((item, index) => {
                    // If the item in the array is an object, render its fields.
                    // Otherwise, render a single input for the primitive value (like a string in the categories array).
                    const isObjectItem = typeof item === 'object' && item !== null;
                    return (
                        <div key={index} className="relative bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-600">
                            <button
                                type="button"
                                onClick={() => onItemRemove(currentPath, index)}
                                title={`Remove this ${fieldKey.slice(0, -1)}`}
                                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isObjectItem ? (
                                Object.entries(item).map(([key, value]) => (
                                    <FormField
                                        key={key}
                                        path={[...currentPath, index]} // Path now includes the array index
                                        fieldKey={key}
                                        fieldValue={value}
                                        onFieldChange={onFieldChange}
                                        onItemRemove={onItemRemove}
                                    />
                                ))
                            ) : (
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => onFieldChange([...currentPath, index], e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        );
    }

    // Handle Objects (that are not arrays)
    if (typeof fieldValue === 'object' && fieldValue !== null) {
        return (
            <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-md font-semibold text-cyan-400 capitalize mb-2">{fieldKey.replace(/_/g, ' ')}</h4>
                {Object.entries(fieldValue).map(([key, value]) => (
                    <FormField
                        key={key}
                        path={currentPath}
                        fieldKey={key}
                        fieldValue={value}
                        onFieldChange={onFieldChange}
                        onItemRemove={onItemRemove}
                    />
                ))}
            </div>
        );
    }

    // Handle Primitives (strings, numbers, etc.)
    const isLongText = typeof fieldValue === 'string' && fieldValue.length > 100;
    const InputComponent = isLongText ? 'textarea' : 'input';

    return (
        <div className="mb-4">
            <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-1 capitalize">
                {fieldKey.replace(/_/g, ' ')}
            </label>
            <InputComponent
                id={fieldId}
                type="text"
                rows={isLongText ? 4 : undefined}
                value={fieldValue}
                onChange={(e) => onFieldChange(currentPath, e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200"
            />
        </div>
    );
};


/**
 * The main form component to edit the fetched tweet data.
 */
const TweetEditForm = ({ tweetData, setTweetData, onSave, isSaving, onReset }) => {
    const handleFieldChange = useCallback((path, newValue) => {
        setTweetData(currentData => {
            const newData = JSON.parse(JSON.stringify(currentData));
            let temp = newData;
            for (let i = 0; i < path.length - 1; i++) {
                temp = temp[path[i]];
            }
            temp[path[path.length - 1]] = newValue;
            return newData;
        });
    }, [setTweetData]);

    const handleItemRemove = useCallback((path, indexToRemove) => {
        setTweetData(currentData => {
            const newData = JSON.parse(JSON.stringify(currentData));
            let targetArray = newData;
            for (let key of path) {
                targetArray = targetArray[key];
            }
            if (Array.isArray(targetArray)) {
                targetArray.splice(indexToRemove, 1);
            }
            return newData;
        });
    }, [setTweetData]);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Tweet Data</h2>
                <button
                    onClick={onReset}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                    Fetch New
                </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                {Object.entries(tweetData).map(([key, value]) => (
                    <FormField
                        key={key}
                        path={[]}
                        fieldKey={key}
                        fieldValue={value}
                        onFieldChange={handleFieldChange}
                        onItemRemove={handleItemRemove}
                    />
                ))}
                <div className="text-center mt-8">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-8 rounded-lg transition-transform transform hover:scale-105 duration-300"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Main App Component
export default function FetchTweetApp() {
    const [tweetId, setTweetId] = useState('');
    const [type, setType] = useState('normal_post');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [tweetData, setTweetData] = useState(null);
    const [originalTweetData, setOriginalTweetData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(null);

    const handleInputChange = (event) => {
        const value = event.target.value;
        const regex = /(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)/;
        const match = value.match(regex);
        setTweetId(match ? match[1] : value);
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(cat => cat !== value)
        );
    };

    const handleReset = () => {
        setTweetData(null);
        setOriginalTweetData(null);
        setTweetId('');
        setSelectedCategories([]);
        setError(null);
        setSaveSuccess(null);
    }

    const fetchTweet = async () => {
        if (!tweetId || selectedCategories.length === 0) {
            setError('Please provide a Tweet ID and select at least one category.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setSaveSuccess(null);
        setTweetData(null);
        setOriginalTweetData(null);

        const apiUrl = 'https://twitterapi-node.onrender.com/api/formatted-tweet';
        const requestPayload = {
            tweet_ids: [tweetId],
            categories: selectedCategories,
            type: type,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let data = await response.json();

            // --- FIX 1: Remove 'variants' from media array ---
            if (data.media && Array.isArray(data.media)) {
                data.media = data.media.map(mediaItem => {
                    const { variants, ...rest } = mediaItem;
                    return rest;
                });
            }

            // --- FIX 2: Repair the split categories array from the backend ---
            if (data.categories && Array.isArray(data.categories)) {
                const joinedCategories = data.categories.join('');
                if (ALL_CATEGORIES.includes(joinedCategories)) {
                    data.categories = [joinedCategories];
                } else {
                    data.categories = ALL_CATEGORIES.filter(c => joinedCategories.includes(c));
                }
            }

            setOriginalTweetData(JSON.parse(JSON.stringify(data)));
            setTweetData(data);

        } catch (err) {
            setError(`Failed to fetch data: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSaveSuccess(null);

        console.log(" Modyfing Data (Original Fetched Data):", originalTweetData);
        console.log("📤 Saving updated data (Final Data):", tweetData);

        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSaving(false);
        setSaveSuccess("Data saved successfully! Check the console for the payload.");
        // Replace the timeout simulation above with your actual API call:
        // await fetch('YOUR_SAVE_API_ENDPOINT', { method: 'POST', body: JSON.stringify(tweetData) });
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                {tweetData ? (
                    <TweetEditForm
                        tweetData={tweetData}
                        setTweetData={setTweetData}
                        onSave={handleSave}
                        isSaving={isSaving}
                        onReset={handleReset}
                    />
                ) : (
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Tweet Data Fetcher</h1>
                            <p className="text-gray-400 mt-2">Enter a Tweet ID to fetch and edit its data.</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="tweetId" className="block text-sm font-medium text-gray-300 mb-2">Tweet ID or URL</label>
                                <input id="tweetId" type="text" value={tweetId} onChange={handleInputChange} placeholder="e.g., 1968713335798390839 or paste URL" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Categories</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                    {ALL_CATEGORIES.map((category) => (
                                        <label key={category} className="flex items-center space-x-2 cursor-pointer text-gray-200 hover:text-cyan-400 transition-colors">
                                            <input type="checkbox" value={category} checked={selectedCategories.includes(category)} onChange={handleCategoryChange} className="form-checkbox h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500" />
                                            <span>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                                <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-200">
                                    <option value="full_post">Full Post</option>
                                    <option value="normal_post">Normal Post</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-center mt-8">
                            <button onClick={fetchTweet} disabled={isLoading} className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-8 rounded-lg transition-transform transform hover:scale-105 duration-300">
                                {isLoading ? 'Fetching...' : 'Fetch Tweet'}
                            </button>
                        </div>
                    </div>
                )}
                <div className="mt-6 text-center">
                    {isLoading && (
                        <div className="flex justify-center items-center bg-gray-800 border border-gray-700 rounded-2xl p-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                            <span className="ml-4 text-gray-300">Loading data...</span>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-2xl" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    {saveSuccess && (
                        <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-2xl" role="alert">
                            <strong className="font-bold">Success: </strong>
                            <span className="block sm:inline">{saveSuccess}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}