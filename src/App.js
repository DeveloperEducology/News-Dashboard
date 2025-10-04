import { Route, Router, Routes } from "react-router-dom";
import NewsPage from "./news/NewsPage";
import ListNews from "./news/ListNews";
import ArticlesTable from "./news/ArticlesTable";
import NewDashboard from "./news/NewDashboard";
import EmbedSocialPage from "./news/EmbedPage";
import TwitterNodeList from "./news/TwitterNodeList";
import FetchTweet from "./news/FetchTweet";
import NewArticle from "./news/NewArticle";
import Ft from "./news/Ft";
import ANmockup from "./news/ANmockup";
import NewsParse from "./news/NewsParse";
import NewsWeb from "./news/NewsWeb";
import AdminDashboard from "./Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewsWeb />} />
      <Route path="/admin" element={<AdminDashboard />} />
      
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news-dashboard" element={<NewDashboard />} />
      <Route path="/embed" element={<EmbedSocialPage />} />
      <Route path="/twi" element={<TwitterNodeList />} />
      <Route path="/ft" element={<FetchTweet />} />
      <Route path="/ft1" element={<Ft />} />
      <Route path="/new" element={<NewArticle />} />
      <Route path="/web" element={<NewsWeb />} />
      <Route path="/an" element={<ANmockup />} />
      <Route path="/np" element={<NewsParse />} />
            
      <Route path="/news/list" element={<ListNews />} />
      <Route path="/ArticlesTable" element={<ArticlesTable />} />

    </Routes>
  );
}
export default App;

