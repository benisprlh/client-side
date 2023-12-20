import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import OrdersList from '../components/seller-components/OrdersList';
import OrderDetails from '../components/seller-components/OrderDetails';
import AddProduct from '../components/seller-components/AddProduct';
import ProductsList from '../components/seller-components/ProductsList';
import EditProduct from '../components/seller-components/EditProduct';
import SellerEditAccount from '../components/seller-components/SellerEditAccount';
import { redirect } from 'react-router-dom';
import ListSellerProducts from '../pages/ListSellerProducts';
import ShopSeller from '../pages/ShopSeller';
import Shipment from '../pages/Shipment';
import Register from '../pages/Register';
import Login from '../pages/Login';
import { getRole, getToken } from '../features/user/actions';

const router = createBrowserRouter([
	{
		path: '/',
		loader: () => {
			if (getToken() && getRole() === 'seller') {
				return redirect('/seller');
			}
			return null;
		},
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: '/products/:productId',
				element: <ListSellerProducts />,
			},
			{
				path: 'shop/:sellerId',
				element: <ShopSeller />,
			},
			{
				path: 'checkout/:invoiceId',
				loader: () => {
					return getToken() ? null : redirect('/login');
				},
				element: <Shipment />,
			},
			{
				path: 'transaction',
				loader: () => {
					return getToken() ? null : redirect('/login');
				},
				element: <OrdersList />,
			},
		],
	},
	{
		path: '/',
		loader: () => {
			if (getToken()) {
				if (getRole() === 'buyer') return redirect('/');
				if (getRole() === 'seller') return redirect('/seller');
			}
			return null;
		},
		children: [
			{
				path: 'register',
				element: <Register />,
			},
			{
				path: 'login',
				element: <Login />,
			},
		],
	},
	{
		path: '/seller',
		loader: () => {
			if (!getToken()) return redirect('/login');
			if (getRole() === 'buyer' && getToken()) {
				return redirect('/');
			}
			return null;
		},
		element: <Dashboard />,
		children: [
			{
				path: '',
				loader: () => redirect('/seller/transaction'),
			},
			{
				path: 'transaction',
				element: <OrdersList />,
			},
			{
				path: 'transaction/:id',
				element: <OrderDetails />,
			},
			{
				path: 'add-product',
				element: <AddProduct />,
			},
			{
				path: 'products',
				element: <ProductsList />,
			},
			{
				path: 'products/:id',
				element: <EditProduct />,
			},
			{
				path: 'account',
				element: <SellerEditAccount />,
			},
		],
	},
]);

export default router;
