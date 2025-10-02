import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarketplacePage from './pages/marketplacePage';
import AccountCreationForm from './pages/accountCreationPage';
import LoginForm from './components/accountLoginForm';

const App = ( ) => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={ <MarketplacePage /> } />
				<Route path='/accountCreation' element={ <AccountCreationForm /> } />
				<Route path='/accountLogin' element={ <LoginForm /> } />
			</Routes>
		</Router>
 	)
}

export default App;
