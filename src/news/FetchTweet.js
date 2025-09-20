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
 * A recursive component to render an input field for a given piece of data.
 * It handles nested objects by rendering headers for each level.
 * @param {object} props - The component props.
 * @param {string[]} props.path - The path to the current field (e.g., ['data', 'user']).
 * @param {string} props.fieldKey - The key of the field (e.g., 'name').
 * @param {any} props.fieldValue - The value of the field.
 * @param {Function} props.onFieldChange - The callback function to update state.
 * @returns {JSX.Element}
 */
const FormField = ({ path, fieldKey, fieldValue, onFieldChange }) => {
    const currentPath = [...path, fieldKey];
    const fieldId = currentPath.join('.');

    // Don't render fields for objects or arrays themselves, only their primitive contents.
    if (typeof fieldValue === 'object' && fieldValue !== null) {
        return (
            <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-md font-semibold text-cyan-400 capitalize mb-2">{fieldKey.replace(/_/g, ' ')}</h4>
                {/* Recursively render fields for the nested object */}
                {Object.entries(fieldValue).map(([key, value]) => (
                    <FormField key={key} path={currentPath} fieldKey={key} fieldValue={value} onFieldChange={onFieldChange} />
                ))}
            </div>
        );
    }

    // Render textareas for long strings, inputs for others.
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
 * @param {object} props - The component props.
 * @param {object} props.tweetData - The tweet data object to be edited.
 * @param {Function} props.setTweetData - Function to update the tweet data state.
 * @param {Function} props.onSave - Callback to handle the save action.
 * @param {boolean} props.isSaving - Flag to indicate if the save operation is in progress.
 * @param {Function} props.onReset - Callback to reset the form and fetch a new tweet.
 * @returns {JSX.Element}
 */
const TweetEditForm = ({ tweetData, setTweetData, onSave, isSaving, onReset }) => {
    // A memoized handler to prevent re-creation on every render.
    const handleFieldChange = useCallback((path, newValue) => {
        setTweetData(currentData => {
            // Deep copy to avoid direct state mutation
            const newData = JSON.parse(JSON.stringify(currentData));
            let temp = newData;
            // Navigate to the parent of the target property
            for (let i = 0; i < path.length - 1; i++) {
                temp = temp[path[i]];
            }
            // Update the final property
            temp[path[path.length - 1]] = newValue;
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
                    <FormField key={key} path={[]} fieldKey={key} fieldValue={value} onFieldChange={handleFieldChange} />
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
            const data = await response.json();
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
        console.log("📤 Saving updated data:", tweetData);

        // --- Backend Integration Point ---
        // Replace the timeout with your actual API call to save the data.
        // The API endpoint and method (POST/PUT) will depend on your backend implementation.
        // Example:
        // try {
        //   const response = await fetch('YOUR_SAVE_API_ENDPOINT', {
        //     method: 'POST', // or 'PUT'
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(tweetData),
        //   });
        //   if (!response.ok) throw new Error('Failed to save.');
        //   const result = await response.json();
        //   setSaveSuccess("Data saved successfully!");
        // } catch (err) {
        //   setError(`Save failed: ${err.message}`);
        // } finally {
        //   setIsSaving(false);
        // }

        // Simulating a network request for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setSaveSuccess("Data saved successfully! Check the console for the payload.");
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
