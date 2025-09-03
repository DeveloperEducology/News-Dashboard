import { Route, Router, Routes } from "react-router-dom";
import NewsPage from "./news/NewsPage";
import ListNews from "./news/ListNews";
import ArticlesTable from "./news/ArticlesTable";
import NewDashboard from "./news/NewDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<NewDashboard />} />
      
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news-dashboard" element={<NewDashboard />} />
            
      <Route path="/news/list" element={<ListNews />} />
      <Route path="/ArticlesTable" element={<ArticlesTable />} />

    </Routes>
  );
}
export default App;

