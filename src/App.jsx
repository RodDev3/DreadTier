//import './App.css'
import Leaderboard from './components/Leaderboard'
import FilterProvider from './contexts/FilterContext'
import Filters from './components/Filters'
import Category from './components/Category'


function App() {
	return (
		<div className="App">
			<FilterProvider>
				<Category />
				<div className='FiltersLeaderboard'>
					<Filters />
					<Leaderboard />
				</div>
			</FilterProvider>
		</div>
	)
}

export default App;
/*
<Testing/>
*/
