import { useState, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";
import useUpdateEffect from "./CustomHooks";

export default function () {
	const [runs, setRuns] = useState([]);
	const [runsFiltered, setRunsFiltered] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [filters, setFilters] = useFilter();

	const startTime = new Date();
	console.log("début du render :" + isLoaded + " Résultat attendu false")

	function byTime(a, b) {
		return parseInt(a.times.primary_t) - parseInt(b.times.primary_t);
	}

	/**
	 * Fonction de fetch de l'Api de Speedrun.com
	 * @returns Liste des runs triée en fonction du temps
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
		console.log(requests);
		return requests;
	}

	function filterRuns() {
		const tab = new Set();
		// TODO Gerer le fait qu'en boss rush il n'y a pas de subctahégory donc pas de filtrage à faire
		//! Boss run ce qu'il faut faire :
		//! Afficher l'igt et pas le rta donc à faire dans le render
		//! Problème de filtrage avec le context vu qu'une des données n'existe pas
		//! Donc soit modifier le context lors que c'est le boss rush soit trouver un moyen de bypass le filtrage

		// Filtrage des runs en fonction des valeurs dans le context
		// Check afin qu'aucun runner n'ait plusieurs runs de présente

		var runsWithFilters = runs.filter((run) => {

			//Check pour le cas Boss rush, subCategory undefined dans le context
			if (run.values[filters.subCategory.key] !== undefined) {
				return run.values[filters.difficulty.key] == [filters.difficulty.value] &&
					run.values[filters.copy.key] == [filters.copy.value] &&
					run.values[filters.turbo.key] == [filters.turbo.value] &&
					run.values[filters.subCategory.key] == [filters.subCategory.value]

			} else {
				return run.values[filters.difficulty.key] == [filters.difficulty.value] &&
					run.values[filters.turbo.key] == [filters.turbo.value];
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

		console.log(runsGood);

		//Set des runs filtrées
		setRunsFiltered(runsGood);
	}

	function padTo2Digits(num) {
		return num.toString().padStart(2, "0");
	}

	function getPrettyTime(totalSeconds) {
		const secondes = Math.floor(totalSeconds % 60);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);

		let prettyTime;

		if (totalSeconds >= 3600) {
			return (prettyTime = hours + "h " + padTo2Digits(minutes) + "m " + padTo2Digits(secondes) + "s");
		} else {
			return (prettyTime =
				padTo2Digits(minutes) + "m " + padTo2Digits(secondes) + "s");
		}
	}

	// Lancement des calls api lors du premier render
	useEffect(() => {
		let runs = [];
		Promise.allSettled(getAllRunsByCategories())
			.then(results => {
				const endTime = new Date();
				const timeDiff = endTime - startTime;
				console.log(`Time taken: ${timeDiff / 1000} seconds`);

				//Filtre afin de n'avoir que des promesse fulfilled
				let runsFulfilled = results.filter(result => result.status === "fulfilled");
				runsFulfilled.map(allRun => {
					allRun.value.data.map(run => {
						runs.push(run)
					})
				});

				//Trie des runs par temps
				runs.sort(byTime);
				console.log(runs);

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
		console.log(runs);
		filterRuns();
	}, [filters, runs]);

	useUpdateEffect(() => {
		console.log(isLoaded)
	}, [isLoaded])

	useUpdateEffect(() => {
		if (runsFiltered != undefined) {
			console.log(runsFiltered)
		}
	}, [runsFiltered]);

	console.log(filters.categoryId)
	if (!isLoaded) {//TODO mettre le logo de chargement de Dread
		return <div>En cours de chargement</div>
	} else if (runsFiltered.length == 0) {
		return <div>No runs</div>
	} else if (filters.categoryId !== "9kvrw802") { //!! Enlever physical Digital ça ne sert a rien en boss rush
		return (
			<table>
				<thead>
					<tr>
						<th>Classement</th>
						<th>RTA</th>
						<th>Lien</th>
					</tr>
				</thead>
				<tbody>
					{runsFiltered.map((run) => {
						//TODO Mettre les liens des videos (si il y en a) et mettre icon youtube ou twitch avec code couleur en hover
						return (
							<tr key={run.id}>
								<td>{run.players.data[0].names.international}</td>
								<td>{getPrettyTime(run.times.primary_t)}</td>
								<td>
									<i className="fa-brands fa-youtube"></i>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	} else {
		return (
			<table>
				<thead>
					<tr>
						<th>Classement</th>
						<th>IGT</th>
						<th>Lien</th>
					</tr>
				</thead>
				<tbody>
					{runsFiltered.map((run) => {
						//TODO Mettre les liens des videos (si il y en a) et mettre icon youtube ou twitch avec code couleur en hover
						if(Object.keys(run.players.data[0]).length === 3){
							return (
								<tr key={run.id}>
									<td>{run.players.data[0].name}</td>
									<td>{getPrettyTime(run.times.primary_t)}</td>
									<td>
										<i className="fa-brands fa-youtube"></i>
									</td>
								</tr>
							);
						}else{
							return (
								<tr key={run.id}>
									<td>{run.players.data[0].names.international}</td>
									<td>{getPrettyTime(run.times.primary_t)}</td>
									<td>
										<i className="fa-brands fa-youtube"></i>
									</td>
								</tr>
							);
						}
					})}
				</tbody>
			</table>
		);
	}
}
