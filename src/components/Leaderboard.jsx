import { useState, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";
import useUpdateEffect from "./CustomHooks";

export default function () {
	const [runs, setRuns] = useState([]);
	const [runsFiltered, setRunsFiltered] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [filters, setFilters] = useFilter();

	function byTime(a, b) {
		return parseInt(a.times.primary_t) - parseInt(b.times.primary_t);
	}

	/**
	 * Fonction de fetch de l'Api de Speedrun.com
	 * @return Liste des runs triée en fonction du temps
	 */
	function getAllRunsByCategories() {
		let requests = [];

		// J'aime pas du tout cette manière de faire, mais l'api à été mal faite donc rip
		for (let offset = 0; offset < 5000; offset += 200) {

			var url = "https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category=" + filters.categoryId + "&max=200&embed=players&offset=" + offset;

			const request = fetch(url)
				.then(response => response.json())
				.then(data => {
					// Check si des runs sont encore présente
					if (data.pagination.size === 0) {

						//Création d'une erreur si il n'y a plus de runs présente
						throw new Error('No runs left');
					} else {
						return data;
					}
				});
			requests.push(request);
		}
		return requests;
	}

	function filterRuns() {
		const tab = new Set();
		var runsWithFilters = runs.filter((run) => {

			if (filters.categoryId !== "9kvrw802") {
				return run.values[filters.difficulty.key] == [filters.difficulty.value] &&
					run.values[filters.copy.key] == [filters.copy.value] &&
					run.values[filters.turbo.key] == [filters.turbo.value] &&
					run.values[filters.subCategory.key] == [filters.subCategory.value]
			} else {
				return run.values[filters.difficulty.key] == [filters.difficulty.value] &&
					run.values[filters.turbo.key] == [filters.turbo.value] &&
					run.values[filters.subCategory.key] == [filters.subCategory.value];
			}
		});

		//Filtre permettant de ne pas avoir plusieurs runs depuis le même runnner
		var runsGood = runsWithFilters.filter((element) => {
			const isDuplicate = tab.has(element.players.data[0].id);
			tab.add(element.players.data[0].id);

			if (!isDuplicate) {
				return true;
			}
			return false;
		});

		//Set des runs filtrées
		setRunsFiltered(runsGood);
	}

	function padTo2Digits(num) {
		return num.toString().padStart(2, "0");
	}

	/**
	 * Fonction prennant le temps en miliseconde et renvoie le temps sous format heure minute seconde
	 * @param {*} totalSeconds
	 * @returns String
	 */
	function getPrettyTime(totalSeconds) {
		const secondes = Math.floor(totalSeconds % 60);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);

		let prettyTime;

		if (totalSeconds >= 3600) {
			return (prettyTime = hours + "h " + padTo2Digits(minutes) + "m " + padTo2Digits(secondes) + "s");
		} else {
			return (prettyTime = padTo2Digits(minutes) + "m " + padTo2Digits(secondes) + "s");
		}
	}

	// Lancement des calls api lors du premier render
	useEffect(() => {
		let runs = [];
		Promise.allSettled(getAllRunsByCategories())
			.then(results => {

				//Filtre afin de n'avoir que des promesse fulfilled
				let runsFulfilled = results.filter(result => result.status === "fulfilled");
				runsFulfilled.map(allRun => {
					allRun.value.data.map(run => {
						runs.push(run)
					})
				});

				//Trie des runs par temps
				runs.sort(byTime);

				//Update des states runs et isLoaded
				setRuns(runs);
				setIsLoaded(true);
			})
			.catch(error => {
				console.error(error);
			});
	}, [filters.categoryId]);

	// Filtre des runs lorsque runs est défini ou les filtres sont modifiés
	useEffect(() => {
		filterRuns();
	}, [filters, runs]);

	if (!isLoaded) {
		return <div>En cours de chargement</div>
	} else if (runsFiltered.length == 0) {
		return <div className="noRun">No runs</div>
	} else { //Cas hors Boss Rush
		return (
			<table>
				<thead>
					<tr>
						<th>Classement</th>
						{filters.categoryId !== "9kvrw802" ?
							<th>RTA</th>
							:
							<th>IGT</th>
						}
						<th>Lien</th>
					</tr>
				</thead>
				<tbody>
					{runsFiltered.map((run) => {
						return (
							<tr key={run.id}>
								<td className="player">
									{/* Cas où le user à été supprimer */}
									{run.players.data[0].rel !== "user" ?
										run.players.data[0].name
										:
										run.players.data[0].names.international
									}
								</td>
								<td className="time">{getPrettyTime(run.times.primary_t)}</td>
								<td className="link">
									{/* Cas où la run ne possède pas de vidéo */}
									{run.videos !== null &&
										Object.entries(run.videos)[0].includes('links') &&
										<a href={run.videos.links[0].uri}>
											{/* Changement d'icon en fonction de l'url */}
											{run.videos.links['0'].uri.includes("youtu") ?
												<i className="fa-brands fa-youtube"></i>
												: run.videos.links['0'].uri.includes("twitch") ?
													< i className="fa-brands fa-twitch"></i>
													: run.videos.links['0'].uri.includes("imgur") ?
														<i className="fa-regular fa-image"></i>
														: <i class="fa-solid fa-video"></i>
											}
										</a>

									}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table >
		);
	}
}
