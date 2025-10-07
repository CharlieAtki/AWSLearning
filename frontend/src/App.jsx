import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarketplacePage from './pages/marketplacePage';
import AccountCreationForm from './pages/accountCreationPage';
import LoginForm from './components/accountLoginForm';
import CheckoutPage from './pages/checkoutPage';
import BusinessDashboard from './pages/businessDashboard';
import BusinessCreationPage from './pages/businessCreationPage';

const App = ( ) => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={ <MarketplacePage /> } />
				<Route path='/accountCreation' element={ <AccountCreationForm /> } />
				<Route path='/accountLogin' element={ <LoginForm /> } />
				<Route path='checkout' element={ <CheckoutPage /> } />
				<Route path='/businessDashboard' element={ <BusinessDashboard /> } />
				<Route path='/businessCreation' element={ <BusinessCreationPage /> } />
			</Routes>
		</Router>
 	)
}

export default App;
