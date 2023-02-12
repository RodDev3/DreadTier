import React, { useEffect, useState } from "react";

//TODO mettre tous ça dans le programme princpale
export default function () {
    const startTime = new Date();
    
    
    function getAllRunsByCategories() {
        let requests = [];
        
        // J'aime pas du tout cette manière de faire, mais l'api à été mal faite donc rip
        for (let offset = 0; offset < 5000; offset += 200) {
            
            var url = "https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category=9kv83mjd&max=200&embed=players&offset=" + offset;
            
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
                })
                requests.push(request);
        }
        console.log(requests);
        return requests;
    }
    let runs = [];
    Promise.allSettled(getAllRunsByCategories())
        .then(results => {
            const endTime = new Date();
            const timeDiff = endTime - startTime;
            console.log(`Time taken: ${timeDiff / 1000} seconds`);
            //Filtre afin de n'avoir que des promesse fulfilled
            let runsFulfilled = results.filter(result => result.status === "fulfilled");
            runsFulfilled.map(allRun =>{
                allRun.value.data.map(run => {
                    runs.push(run)
                })
            });
            console.log(runs)
        })
        .catch(error => {
            console.error(error);
        });
}




/* Ancien code
function getPage(offset) {
		return fetch("https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category=" + filters.categoryId + "&max=200&embed=players&offset=" + offset)
			.then((response) => response.json())
			.then((data) => {
				console.log("Offset dans getpage = " + offset);
				return { data, offset };
			})
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	}

	function getAllRunsPromise() {
		return getPage(offset)
			.then((page) => {
				if (page.data.data.length == 0) {
					//Il n'y a plus de data dans le call api
					return page.data.data;
				} else {
					//Sinon on continue les calls
					offset += 200;
					return getAllRunsPromise().then((nextPageData) => {
						//console.log('page.data.data : ' + JSON.stringify(page.data.data))
						return page.data.data.concat(nextPageData);
					});
				}
			})
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	}

	function promiseAllRuns() {
		const start = new Date();

		Promise.all([getAllRunsPromise()])
			.then((allData) => {
				console.log(allData);

				//Trie du tableau, on le .flat() avant
				allData = allData.flat();
				allData.sort(byTime);

				setRuns(allData);
				const end = new Date();

				const diffTime = Math.abs(end - start);
				console.log("Avec promise.all : " + diffTime + "ms");
			})
			.catch((error) => {
				console.error(error);
			});
	}
*/



