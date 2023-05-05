import { useState, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";
import useUpdateEffect from "./CustomHooks";
import '../assets/css/Leaderboard.css';
import RowTable from "./RowTable";
import Testing from "./Testing";

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

		//Filtrage des runs par rapport à ce que contient le context
		var runsWithFilters = runs.filter((run) => {
			if (filters.categoryId !== "9kvrw802") {
				return run.values[filters.difficulty.key] == [filters.difficulty.value] &&
					run.values[filters.copy.key] == [filters.copy.value] &&
					run.values[filters.turbo.key] == [filters.turbo.value] &&
					run.values[filters.subCategory.key] == [filters.subCategory.value]
			} else {
				//Cas boss rush où l'on ne filtre pas par copy
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

		//Gestion de la position dans le classement
		var tempo;
		for (var i = 0; i < runsGood.length; i++) {
			if (i === 0) {
				runsGood[i].position = i + 1;
				continue;
			}
			if (runsGood[i].times.primary_t > runsGood[i - 1].times.primary_t) {
				runsGood[i].position = i + 1;
				tempo = undefined;
				continue;
			}
			if (runsGood[i].times.primary_t === runsGood[i - 1].times.primary_t) {
				if (tempo !== undefined) {
					runsGood[i].position = tempo;
				} else {
					tempo = i;
					runsGood[i].position = tempo;
					continue;
				}
			}
		}
		console.log(runsGood);

		//Set des runs filtrées
		setRunsFiltered(runsGood);
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

	useEffect(() => {
		//console.log(runsFiltered);
	}, [runsFiltered])

	if (!isLoaded) {
		return <div>En cours de chargement</div>
	} else if (runsFiltered.length == 0) {
		return <div className="noRun">No runs</div>
	} else {
		return (
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Player</th>
						{/* Cas Boss Rush */}
						{filters.categoryId !== "9kvrw802" ?
							<th>RTA</th>
							:
							<th>IGT</th>
						}
						<th>Lien</th>
					</tr>
				</thead>
				<tbody>
					{
						runsFiltered.map(run => {
							return <RowTable key={run.id} run={run} />
						})
					}
				</tbody>
			</table >
		);
	}
}
