import Products from "../pages/AdminPage/Products";
import Orders from "../pages/AdminPage/Orders";
import Users from "../pages/AdminPage/Users";
import CartPage from "../pages/Cart/CartPage";
import HomePage from "../pages/HomePage/HomePage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ProductListPage from "../pages/ProductListPage/ProductListPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import UserProfile from "../pages/UserProfile/UserProfile";
import Brands from "../pages/AdminPage/Brands";
import AddProduct from "../pages/AdminPage/AddProduct";
import DetailProduct from "../pages/AdminPage/DetailProduct";
import Dashboard from "../pages/AdminPage/DashBoard";
import ProductSpecifications from "../pages/AdminPage/ProductSpecifications";
import MyOrders from "../pages/MyOrders/MyOrders";
import OrderDetails from "../pages/OrderDetails/OrderDetails";

export const routes = [
    {
        path: '/',
        page: HomePage,
        adminManage: false
    },
    {
        path: '/sign-in',
        page: SignIn,
        adminManage: false
    },
    {
        path: '/sign-up',
        page: SignUp,
        adminManage: false
    },
    {
        path: '/product/product-details/:productId',
        page: ProductDetails,
        adminManage: false
    },
    {
        path: '/user/profile',
        page: UserProfile,
        adminManage: false
    },
    {
        path: '/products',
        page: ProductListPage,
        adminManage: false
    },
    {
        path: '/cart',
        page: CartPage,
        adminManage: false
    },
    {
        path: '/admin/dashboard',
        page: Dashboard,
        adminManage: true
    },
    {
        path: '/admin/brands',
        page: Brands,
        adminManage: true
    },
    {
        path: '/admin/products',
        page: Products,
        adminManage: true
    },
    {
        path: '/admin/products/create',
        page: AddProduct,
        adminManage: true
    },
    {
        path: '/admin/orders',
        page: Orders,
        adminManage: true
    },
    {
        path: '/admin/users',
        page: Users,
        adminManage: true
    },
    {
        path: '/admin/products/detail/:productId',
        page: DetailProduct,
        adminManage: true
    },
    {
        path: '/admin/products/specifications/:productId',
        page: ProductSpecifications,
        adminManage: true
    },
    {
        path: '/order-success',
        page: OrderSuccess,
        adminManage: false
    },
    {
        path: '/my-orders',
        page: MyOrders,
        adminManage: false
    },
    {
        path: '/order/details/:orderId',
        page: OrderDetails,
        adminManage: false
    }
];