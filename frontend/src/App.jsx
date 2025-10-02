import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MarketplacePage from './pages/marketplace';

const App = ( ) => {
	return (
		<Router>
			<Routes>
				<Route path='/' element={ <MarketplacePage /> } />
			</Routes>
		</Router>
 	)
}

export default App;
