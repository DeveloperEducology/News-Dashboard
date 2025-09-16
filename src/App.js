import { Route, Router, Routes } from "react-router-dom";
import NewsPage from "./news/NewsPage";
import ListNews from "./news/ListNews";
import ArticlesTable from "./news/ArticlesTable";
import NewDashboard from "./news/NewDashboard";
import EmbedSocialPage from "./news/EmbedPage";
import TwitterNodeList from "./news/TwitterNodeList";
import FetchTweet from "./news/FetchTweet";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewDashboard />} />
      
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news-dashboard" element={<NewDashboard />} />
      <Route path="/embed" element={<EmbedSocialPage />} />
      <Route path="/twi" element={<TwitterNodeList />} />
  <Route path="/fetch-tweet" element={<FetchTweet />} />
      <Route path="/news/list" element={<ListNews />} />
      <Route path="/ArticlesTable" element={<ArticlesTable />} />

    </Routes>
  );
}
export default App;

