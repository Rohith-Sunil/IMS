// import Home from "./components/Home";
// import Navbar from "./components/Navbar";
// import Products from "./components/Products";
// import InsertProduct from "./components/InsertProduct";
// import UpdateProduct from "./components/UpdateProduct";
// // import About from "./components/About";
// import Search from "./components/Search";
// import Projects from "./components/Projects";
// import { UniProject } from "./components/mincomponents/Project";
// import InsertProject from "./components/InsertProject";
// import Product from "./components/mincomponents/Product";
// import Purchases from "./components/Purchases";
// import UpdateProject from "./components/UpdateProject";
// import LandingPage from "./components/LandingPage";

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// function App() {
//   return (
//     <Router>
//       <div className="App ">
//         <Route path="landing" element={<LandingPage />} />
//         <Navbar title="IMS" about="About" />
//         <div className="container mx-auto px-4 py-5">
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/purchases" element={<Purchases />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/product/:id" element={<Product />} />
//             <Route path="/insertproduct" element={<InsertProduct />} />
//             <Route path="/updateproduct/:id" element={<UpdateProduct />} />
//             <Route path="/projects/:id" element={<UniProject />} />
//             <Route path="/projects/:id/update" element={<UpdateProject />} />
//             {/* <Route path="/about" element={<About />} /> */}
//             <Route path="/projects" element={<Projects />} />
//             <Route path="/insertproject" element={<InsertProject />} />
//             <Route path="/search" element={<Search />} />{" "}
//             {/* ✅ Add Search Route */}
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import InsertProduct from "./components/InsertProduct";
import UpdateProduct from "./components/UpdateProduct";
import Search from "./components/Search";
import Projects from "./components/Projects";
import { UniProject } from "./components/mincomponents/Project";
import InsertProject from "./components/InsertProject";
import Product from "./components/mincomponents/Product";
import Purchases from "./components/Purchases";
import UpdateProject from "./components/UpdateProject";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Standalone Landing Page (no Navbar, no layout) */}
        <Route path="/landing" element={<LandingPage />} />

        {/* ✅ All other routes use layout with Navbar */}
        <Route
          path="*"
          element={
            <div className="App">
              <Navbar title="IMS" about="About" />
              <div className="container mx-auto px-4 py-5">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/purchases" element={<Purchases />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/insertproduct" element={<InsertProduct />} />
                  <Route
                    path="/updateproduct/:id"
                    element={<UpdateProduct />}
                  />
                  <Route path="/projects/:id" element={<UniProject />} />
                  <Route
                    path="/projects/:id/update"
                    element={<UpdateProject />}
                  />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/insertproject" element={<InsertProject />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
