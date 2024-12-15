import CartPage from "../pages/Cart/CartPage";
import HomePage from "../pages/HomePage/HomePage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ProductListPage from "../pages/ProductListPage/ProductListPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import UserProfile from "../pages/UserProfile/UserProfile";

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
        path: '/order-success',
        page: OrderSuccess,
        adminManage: false
    }
];