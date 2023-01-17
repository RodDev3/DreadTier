import './App.css'
import Leaderboard from './components/Leaderboard'
import FilterProvider from './contexts/FilterContext'
import Filters from './components/Filters'
import Category from './components/Category'
import Testing from './components/Testing'


function App() {
	return (
		<div className="App">
			<FilterProvider>
				<Category/>
				<div className='allo'>
				<Filters/>
				<Leaderboard />
				</div>
			</FilterProvider>
		</div>
	)
}

export default App
/*
<Testing/>
*/
