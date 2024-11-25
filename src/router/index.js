import HomePage from "../pages/HomePage/HomePage";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import ProductListPage from "../pages/ProductListPage/ProductListPage";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";

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
    }, 
    {
        path: '/products',
        page: ProductListPage,
        adminManage: false
    }
];