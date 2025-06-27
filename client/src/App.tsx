import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Footer  from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/notFound";
import UpdatePost from "./pages/UpdatePost";


export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        {/*routes*/}
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/projects" element={<Projects/>} />
        <Route path="/notFound" element={<NotFound />} />
        <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard/>} />
        </Route>

        <Route element={<AdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>

      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
