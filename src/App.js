import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Home from "./pages/Home/Home";
import Payment from "./pages/payment/Payment";
import Shop from "./pages/Shop/Shop";
import Navbar from "./components/navbar/Navbar";
import Navigation from "./components/navigation/Navigation";
import Products from "./pages/products/Products";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import Wishlist from "./pages/Wishlist/Wishlist";
import { Toaster} from "react-hot-toast";


const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Navigation />
      <ScrollRestoration />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// 404 Error Page Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* ==================== Header Navlink Start here =================== */}
      <Route index element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<About />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      {/* ==================== Header Navlink End here ===================== */}

      {/* Other Pages */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/my-list" element={<Wishlist />} />
      <Route path="/paymentgateway" element={<Payment />} />
      <Route path="/products" element={<Products />} />

      {/* Auth Routes - Now inside Layout */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />

      {/* 404 Error Route - Catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: '#000',
            color: '#fff',
          },
          error: {
            style: {
              background: '#FF4747',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;