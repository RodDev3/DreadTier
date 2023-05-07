//import './App.css'
import FilterProvider from './contexts/FilterContext'
import Category from './components/Category'
import Filters from './components/Filters'
import Leaderboard from './components/Leaderboard'
import DeviceProvider, { useDevice } from './contexts/DeviceContext'

import "../src/assets/css/mobile.css"

function App() {
	const device = useDevice();

	if (device !== undefined) {
		return (
			<DeviceProvider>
				<FilterProvider>
					{device.device === "isDesktop" ?
						/* Affichage Bureau */
						<div id="desktop">
							<Category />
							<div className="FiltersLeaderboard">
								<Filters />
								<Leaderboard />
							</div>
						</div>

						: device.device === "isTablet" ?
							/* Affichage Tablette */
							<div>TABLETTE</div>

							: device.device === "isMobile" &&
							/* Affichage Mobile */
							<div id="mobile">
								<div id='cateAndFilters'>
									<Category />
									<Filters />
								</div>
								<div className="FiltersLeaderboard">
									<Leaderboard />
								</div>
							</div>

					}
				</FilterProvider >
			</DeviceProvider>
		)
	}
}

export default App;