import './App.css'
import WelcomePage from "./pages/WelcomePage.tsx";
import MainPage from "./pages/MainPage.tsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {


  return (
      <Router>
        <Routes>
          <Route path="/" Component={WelcomePage} />
            <Route path="/MainPage" Component={MainPage} />
        </Routes>
      </Router>
  )


}

export default App
