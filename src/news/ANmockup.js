import React, { useState, useEffect } from 'react';

// Helper component for SVG Icons
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

// Header Component
const Header = ({ toggleSidebar }) => (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center">
            <button onClick={toggleSidebar} className="text-gray-500 mr-4 lg:hidden">
                <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" />
            </button>
            <span className="text-red-500 font-bold text-lg">MYNEWS</span>
            <span className="hidden md:inline text-sm text-gray-500 ml-8">Last Push Notification At 11:00:30 PM</span>
        </div>
        <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
                 <span className="text-sm">Hi Vijay,</span>
                 <span className="text-sm text-red-500 ml-2">Session Expires in <span className="font-bold">00:15:15</span> Mins</span>
            </div>
            <button className="text-sm font-semibold flex items-center space-x-1">
                <span>LogOut</span>
                <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M15.75 9l-3 3m0 0l3 3m-3-3h12" className="w-5 h-5 inline-block text-red-500" />
            </button>
        </div>
    </header>
);


// Sidebar Component
const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
    const navItems = [
        { name: 'Home', icon: "M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955a.75.75 0 01-1.06 1.06l-1.5-1.5V21a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V11.56l-1.5 1.5a.75.75 0 01-1.06-1.06z" },
        { name: 'News', isTitle: true },
        { name: 'Articles', icon: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" },
        { name: 'Draft Articles', icon: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" },
        { name: 'Pullback Articles', icon: "M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" },
        { name: 'Push Notification', icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" },
        { name: 'Sticky', icon: "M15.372 1.524c-.623-.523-1.528-.8-2.433-.8s-1.81.277-2.433.802l-.114.095a.64.64 0 00-.317.513v1.444c0 .285.122.55.328.736l.24.181c.52.39 1.2.6 1.91.6h.01c.71 0 1.39-.21 1.91-.6l.24-.181a.97.97 0 00.328-.736V2.132a.64.64 0 00-.317-.513l-.114-.095z" },
        { name: 'Cricket Sticky', icon: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" },
        { name: 'Local', isTitle: true },
        { name: 'Reporters', icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-1.262c.529-.338.455-1.162-.066-1.394a1.88 1.88 0 00-2.32.124 7.772 7.772 0 01-3.138.868 7.76 7.76 0 01-3.41-1.028c-.529-.338-1.226.196-1.028.766A9.337 9.337 0 0015 19.128z" },
        { name: 'LocalReports', icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5" },
        { name: 'Retensions', icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
        { name: 'Configuration', icon: "M9.594 3.94c.09-.542.56-1.007 1.11-1.226.554-.22 1.196-.22 1.75 0 .554.22 1.02.684 1.11 1.226l.078.469c.346.216.68.462.994.742l.365-.231c.542-.344 1.22-.246 1.63.218.41.463.456 1.154.112 1.696l-.23.365c.28.314.526.648.742.994l.469.078c.542.09.962.528 1.182 1.072.22.544.22 1.18-.002 1.722-.22.544-.644 1.01-1.182 1.132l-.469.078c-.216.346-.462.68-.742.994l.23.365c.344.542.246 1.22-.218 1.63-.463.41-1.154.456-1.696.112l-.365-.23c-.314.28-.648.526-.994.742l-.078.469c-.09.542-.528.962-1.072 1.182-.544.22-1.18.22-1.722-.002-.544-.22-1.01-.644-1.132-1.182l-.078-.469c-.346-.216-.68-.462-.994-.742l-.365.231c-.542.344-1.22.246-1.63-.218-.41-.463-.456-1.154-.112-1.696l.23-.365c-.28-.314-.526-.648-.742-.994l-.469-.078c-.542-.09-.962-.528-1.182-1.072-.22.544-.22-1.18.002-1.722.22.544.644-1.01 1.182 1.132l.469.078c.216.346.462.68.742.994l.23.365c.344.542.246-1.22-.218-1.63-.463-.41-1.154-.456-1.696-.112l.365-.23c.314-.28.648-.526.994-.742l.078-.469zM12 15a3 3 0 100-6 3 3 0 000 6z" },
    ];

    const handleNavClick = (pageName) => {
        if (!pageName.isTitle) {
            setActivePage(pageName);
            if(window.innerWidth < 1024) { // close sidebar on mobile after click
                setIsOpen(false);
            }
        }
    };
    
    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`fixed lg:relative inset-y-0 left-0 bg-white border-r border-gray-200 p-4 space-y-2 w-64 transform transition-transform z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                {navItems.map((item, index) =>
                    item.isTitle ? (
                        <h3 key={index} className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-4 px-4">{item.name}</h3>
                    ) : (
                         <a href="#" key={index}
                            onClick={(e) => { e.preventDefault(); handleNavClick(item.name); }}
                            className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${activePage === item.name ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            {item.icon && <Icon path={item.icon} className="w-5 h-5" />}
                            <span>{item.name}</span>
                        </a>
                    )
                )}
            </aside>
        </>
    );
};


// Page: Articles
const ArticlesPage = ({setActivePage}) => {
    const stats = [
        { label: 'Published', value: 202, color: 'bg-orange-500' }, { label: 'Approved', value: 309, color: 'bg-green-500' },
        { label: 'Avg Time', value: '00:07:53', color: 'bg-yellow-500' }, { label: 'Followers', value: 0, color: 'bg-blue-500' },
        { label: 'Likes', value: 1497, color: 'bg-red-500' }, { label: 'Comments', value: 9, color: 'bg-indigo-500' },
        { label: 'Shares', value: 5853, color: 'bg-purple-500' }, { label: 'Downloads', value: 0, color: 'bg-pink-500' },
    ];
    const articles = [
        { no: 1, name: 'shivakumar B', category: 'Sports', title: 'ఆస్ట్రేలియా క్రికెట్ జట్టుకు భారీ షాక్..', publishTime: '9/28/25, 9:14 PM', comments: 0, users: 0, impressions: 0, share: 0 },
        { no: 2, name: 'Sai Vamshi', category: 'Health', title: 'మునగాకులో ఉండే పోషకాలు..', publishTime: '9/28/25, 11:04 PM', comments: 33, users: 35, impressions: 1, share: 0 },
        { no: 3, name: 'Bhaskar M', category: 'National', title: 'తెలంగాణలో పలు జిల్లాల్లో..', publishTime: '9/28/25, 10:59 PM', comments: 116, users: 137, impressions: 0, share: 0 },
        { no: 4, name: 'Sai Vamshi', category: 'Infotainment', title: 'పదేళ్ల వయసులో తల్లిదండ్రులను..', publishTime: '9/28/25, 10:56 PM', comments: 127, users: 155, impressions: 0, share: 0 },
        { no: 5, name: 'Vinay', category: 'Entertainment', title: 'ప్రభాస్ మూవీ నుంచి బిగ్ అప్డేట్..', publishTime: '9/28/25, 10:45 PM', comments: 198, users: 239, impressions: 0, share: 0 },
    ];

    return (
        <div className="p-4 md:p-6 bg-gray-50 flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                    <input type="text" placeholder="Search..." className="p-2 border rounded-md col-span-1 sm:col-span-2 lg:col-span-1" />
                    <select className="p-2 border rounded-md"><option>Telugu</option></select>
                    <select className="p-2 border rounded-md"><option>Select Writer</option></select>
                    <select className="p-2 border rounded-md"><option>Select Categories</option></select>
                    <input type="date" defaultValue="2025-09-28" className="p-2 border rounded-md" />
                    <input type="date" defaultValue="2025-09-28" className="p-2 border rounded-md" />
                </div>
                <div className="flex space-x-2 mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Clear</button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 my-6">
                {stats.map(stat => ( <div key={stat.label} className={`${stat.color} text-white p-4 rounded-lg text-center shadow`}> <p className="text-sm">{stat.label}</p> <p className="text-2xl font-bold">{stat.value}</p> </div> ))}
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600">
                            <tr>{['S No.', 'Name', 'Category', 'Title', 'Publish Time', 'Comments', 'Users', 'Impressions', 'Share', 'Actions'].map(h => <th key={h} className="p-3 whitespace-nowrap">{h}</th>)}</tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.no} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{article.no}</td><td className="p-3">{article.name}</td>
                                    <td className="p-3"><span className="bg-purple-200 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{article.category}</span></td>
                                    <td className="p-3 max-w-xs truncate">{article.title}</td><td className="p-3">{article.publishTime}</td>
                                    <td className="p-3">{article.comments}</td><td className="p-3">{article.users}</td>
                                    <td className="p-3">{article.impressions}</td><td className="p-3">{article.share}</td>
                                    <td className="p-3 flex items-center space-x-2"><a href="#" className="text-blue-500">Edit</a><a href="#" className="text-red-500">Delete</a><button className="bg-yellow-400 text-white px-3 py-1 rounded text-xs">Send</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={() => setActivePage('Add Article News')} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-20">
                <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-8 h-8"/>
            </button>
        </div>
    );
};

// Page: Draft Articles
const DraftArticlesPage = () => {
    const drafts = [
        { name: 'Bhaskar M', category: 'State', title: '40 మంది ప్రయాణికులతో వెళ్తున్న బస్సు..', created: '4:58 PM' }, { name: 'Naresh', category: 'National', title: 'జాతీయ రహదారిపై ఘోర రోడ్డు ప్రమాదం..', created: '12:23 PM' },
        { name: 'RajaMahender', category: 'State', title: 'గ్రానైట్ ఫ్యాక్టరీలో అగ్ని ప్రమాదం', created: '11:20 AM' }, { name: 'Anusha', category: 'Entertainment', title: 'కొత్త సినిమా ట్రైలర్ విడుదల', created: '10:15 AM'},
    ];
    return (
        <div className="p-4 md:p-6 bg-gray-50 flex-1">
             <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    <select className="p-2 border rounded-md"><option>Telugu</option></select>
                    <select className="p-2 border rounded-md"><option>Select Writer</option></select>
                    <select className="p-2 border rounded-md"><option>Select Categories</option></select>
                    <input type="text" placeholder="Title" className="p-2 border rounded-md" />
                    <div className="flex space-x-2 sm:col-span-2 lg:col-span-4">
                        <input type="date" defaultValue="2025-09-28" className="p-2 border rounded-md w-full" />
                        <input type="date" defaultValue="2025-09-28" className="p-2 border rounded-md w-full" />
                    </div>
                </div>
                 <div className="flex space-x-2 mt-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Submit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Clear</button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600"><tr>{['Name', 'Category', 'Title', 'Created', 'Actions'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
                        <tbody>
                            {drafts.map((draft, i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{draft.name}</td>
                                    <td className="p-3"><span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{draft.category}</span></td>
                                    <td className="p-3 max-w-xs truncate">{draft.title}</td><td className="p-3">{draft.created}</td>
                                    <td className="p-3 space-x-2"><a href="#" className="text-green-500">Publish</a><a href="#" className="text-red-500">Delete</a><a href="#" className="text-blue-500">Edit</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Page: Push Notification
const PushNotificationPage = () => {
    const stats = [
        { label: 'Push Count', value: 25, color: 'bg-orange-400' }, { label: 'Sent Count', value: 6852019, color: 'bg-blue-400' },
        { label: 'Delivered', value: 2858847, color: 'bg-green-400' }, { label: 'Opened', value: 16130, color: 'bg-red-400' },
        { label: 'Open%', value: '0.56', color: 'bg-purple-400' }, { label: 'Shares', value: 150, color: 'bg-pink-400' },
        { label: 'Clicks', value: 0, color: 'bg-indigo-400' }
    ];
    const notifications = [
        { name: 'Vinay', title: 'బ్రేకింగ్: ఎమ్మెల్యే అభ్యర్థుల జాబితా విడుదల!', category: 'State', time: 'Sep 28, 2025, 11:00:30 PM', sent: 274134, success: 114724, open: 197, failed: 159410 },
        { name: 'Bhaskar M', title: 'FLASH: మార్కెట్లోకి కొత్త 5G ఫోన్, ధర ఎంతంటే?', category: 'State', time: 'Sep 28, 2025, 10:47:39 PM', sent: 274133, success: 114723, open: 387, failed: 159410 },
    ];
    return (
        <div className="p-4 md:p-6 bg-gray-50 flex-1">
             <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                    <select className="p-2 border rounded-md"><option>Telugu</option></select>
                    <select className="p-2 border rounded-md"><option>Select Writer</option></select>
                    <select className="p-2 border rounded-md"><option>ALL</option></select>
                     <div className="flex space-x-2 sm:col-span-2 lg:col-span-4">
                        <input type="date" defaultValue="2025-09-28" className="p-2 border rounded-md w-full" />
                        <input type="date" defaultValue="2025-09-28" className="p-2 border rounded-md w-full" />
                    </div>
                </div>
                 <div className="flex space-x-2 mt-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Submit</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Clear</button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 my-6">
                {stats.map(stat => ( <div key={stat.label} className={`${stat.color} text-white p-4 rounded-lg text-center shadow`}> <p className="text-sm font-semibold">{stat.label}</p> <p className="text-2xl font-bold">{stat.value}</p> </div> ))}
            </div>
             <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600"><tr>{['Name', 'Title', 'Category', 'Time', 'Sent', 'Success', 'Open', 'Failed'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
                        <tbody>
                            {notifications.map((n, i) => (<tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-3">{n.name}</td><td className="p-3 max-w-sm truncate">{n.title}</td>
                                <td className="p-3">{n.category}</td><td className="p-3">{n.time}</td>
                                <td className="p-3">{n.sent}</td><td className="p-3 text-green-600">{n.success}</td>
                                <td className="p-3 text-blue-600">{n.open}</td><td className="p-3 text-red-600">{n.failed}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Page: Sticky
const StickyPage = () => {
    const stickies = [
        { lang: 'Telugu', title: 'దసరా శుభాకాంక్షలు - ఆల్ రౌండర్..', type: 'full_image', category: 'Infotainment', time: '28-09-2025 03:05:42 PM', shares: 96, downloads: 0, comments: 0, position: 3 },
        { lang: 'Telugu', title: 'ఓం నమశ్శివాయ', type: 'full_image', category: 'Devotional', time: '27-09-2025 06:28:50 PM', shares: 844, downloads: 0, comments: 0, position: 7 },
    ];
     return (
        <div className="p-4 md:p-6 bg-gray-50 flex-1">
             <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <select className="p-2 border rounded-md"><option>Telugu</option></select>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Clear</button>
            </div>
             <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600"><tr>{['Language', 'Title', 'Article Type', 'Category', 'Created Time', 'Shares', 'Downloads', 'Comments', 'Sticky Position'].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
                        <tbody>
                            {stickies.map((s, i) => (<tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-3">{s.lang}</td><td className="p-3 max-w-sm truncate">{s.title}</td>
                                <td className="p-3"><a href="#" className="text-blue-500 underline">{s.type}</a></td>
                                <td className="p-3">{s.category}</td><td className="p-3">{s.time}</td>
                                <td className="p-3">{s.shares}</td><td className="p-3">{s.downloads}</td>
                                <td className="p-3">{s.comments}</td><td className="p-3">{s.position}</td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// Page: Add Article News
const AddArticleNewsPage = () => {
    const [articleType, setArticleType] = useState('Image');
    const [subType, setSubType] = useState('Normal Post');
    const [videoType, setVideoType] = useState('Half Video');
    const [formData, setFormData] = useState({ title: '', description: '', category: '', sourceLink: ''});
    
    const handleInputChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const renderImageOptions = () => ( <div className="flex flex-wrap items-center gap-6"> {['Normal Post', 'Full Image', 'Image Gallery', 'Greetings', 'Polling', 'Survey'].map(opt => ( <label key={opt} className="flex items-center space-x-2"> <input type="radio" name="imageSubType" value={opt} checked={subType === opt} onChange={e => setSubType(e.target.value)} className="form-radio text-pink-500"/> <span>{opt}</span> </label> ))} </div> );
    const renderVideoOptions = () => ( <> <div className="flex flex-wrap items-center gap-6"> {['Half Video', 'Full Video', 'Video Gallery'].map(opt => ( <label key={opt} className="flex items-center space-x-2"> <input type="radio" name="videoSubType" value={opt} checked={videoType === opt} onChange={e => setVideoType(e.target.value)} className="form-radio text-pink-500"/> <span>{opt}</span> </label> ))} </div> <div className="mt-6 space-y-4"> <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-md" /> <p className="text-xs text-right text-gray-500">70 Characters Left</p> <textarea name="description" placeholder="Description" rows="3" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md"></textarea> <p className="text-xs text-right text-gray-500">350 Characters Left, Words :0</p> <div className="flex flex-col sm:flex-row items-center justify-between gap-4"> <select name="category" value={formData.category} onChange={handleInputChange} className="p-2 border rounded-md w-full sm:w-1/3"> <option value="">Select a Category</option> <option>National</option> <option>State</option> <option>Sports</option> </select> <div className="flex items-center space-x-4"> <label className="flex items-center space-x-2"><input type="radio" name="videoSource" className="form-radio"/><span>Youtube Video</span></label> <label className="flex items-center space-x-2"><input type="radio" name="videoSource" className="form-radio"/><span>File Video</span></label> </div> </div> <div className="flex items-center space-x-2"> <input type="checkbox" id="schedule"/> <label htmlFor="schedule">Scheduled</label> </div> </div> </> );
    const renderWebOptions = () => ( <div className="mt-6 space-y-4"> <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-md" /> <p className="text-xs text-right text-gray-500">70 Characters Left</p> <input type="text" name="sourceLink" placeholder="Source link" value={formData.sourceLink} onChange={handleInputChange} className="w-full p-2 border rounded-md" /> <select name="category" value={formData.category} onChange={handleInputChange} className="p-2 border rounded-md w-full sm:w-1/3"> <option value="">Select a Category</option> <option>National</option> <option>State</option> <option>Sports</option> </select> </div> );
    
    return(
        <div className="p-4 md:p-6 bg-gray-50 flex-1 flex flex-col lg:flex-row gap-6">
            <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-6">Add Article News</h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6"> {['Image', 'Video', 'Web'].map(type => ( <label key={type} className="flex items-center space-x-2"> <input type="radio" name="articleType" value={type} checked={articleType === type} onChange={e => setArticleType(e.target.value)} className="form-radio text-pink-500"/> <span>{type}</span> </label> ))} </div>
                {articleType === 'Image' && renderImageOptions()} {articleType === 'Video' && renderVideoOptions()} {articleType === 'Web' && renderWebOptions()}
                <div className="mt-8 flex space-x-4"> <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 shadow">Submit</button> <button className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 shadow">Save as draft</button> </div>
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
                <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                    <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                    <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div><div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div><div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                    <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                        <div className="bg-gray-200 h-1/2 w-full"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-100 flex justify-around items-center border-t">
                            <button className="text-gray-500"><Icon path="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.152a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/></button>
                            <button className="text-gray-500"><Icon path="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></button>
                            <button className="text-gray-500"><Icon path="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.023-.19-2.3-1.334-2.3s-1.904 1.277-1.334 2.3c.57 1.023.19 2.3 1.334 2.3s1.904-1.277 1.334-2.3zM12.75 9.062c.57-1.023-.19-2.3-1.334-2.3s-1.904 1.277-1.334 2.3c.57 1.023.19 2.3 1.334 2.3s1.904-1.277 1.334-2.3zM15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Main App Component
export default function ANmockup() {
    const [activePage, setActivePage] = useState('Articles');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderPage = () => {
        switch (activePage) {
            case 'Articles': return <ArticlesPage setActivePage={setActivePage}/>;
            case 'Draft Articles': return <DraftArticlesPage />;
            case 'Push Notification': return <PushNotificationPage />;
            case 'Sticky': return <StickyPage />;
            case 'Add Article News': return <AddArticleNewsPage />;
            default: return <div className="p-6">Select a page from the sidebar.</div>;
        }
    };

    return (
        <div className="h-screen w-full bg-gray-100 flex flex-col font-sans overflow-hidden">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
                <main className="flex-1 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}

