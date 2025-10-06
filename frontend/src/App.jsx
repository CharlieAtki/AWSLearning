import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarketplacePage from './pages/marketplacePage';
import AccountCreationForm from './pages/accountCreationPage';
import LoginForm from './components/accountLoginForm';
import CheckoutPage from './pages/checkoutPage';

const App = ( ) => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={ <MarketplacePage /> } />
				<Route path='/accountCreation' element={ <AccountCreationForm /> } />
				<Route path='/accountLogin' element={ <LoginForm /> } />
				<Route path='checkout' element={ <CheckoutPage /> } />
			</Routes>
		</Router>
 	)
}

export default App;
