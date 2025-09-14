// App.tsx
import { Routes, Route,} from "react-router-dom";
import HomePage from "./pages/home";
import { SignIn } from "./pages/signIn";
import { SignUp } from "./pages/signUp";
import { JournalForm } from "./pages/JournalForm";
import JournalSearchPage from "./pages/ListOfJournal";
import MoodTrendsPage from "./pages/moodTrends";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/journalForm" element={<JournalForm/>}></Route>
      <Route path="/listofJournal" element={<JournalSearchPage/>}></Route>
      <Route path="/MoodTrends" element={<MoodTrendsPage/>}></Route>
      <Route path="*" element={<p>404 - Page Not Found</p>} />
    </Routes>
  );
}

export default App;
