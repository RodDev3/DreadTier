export default function () {

    var offset = 0;
    function getPage(offset){
        console.log("FETCH DANS LENTRER DE LA FUCTION " + offset)
        return fetch("https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category=9kv83mjd&max=200&embed=players&offset="+offset)
        .then(response => response.json())
        .then(data => {
            console.log("Offset dans getpage = " + offset)
            return {data, offset}
        })
        .catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
        }
    
    
    function apiWithPromise(){
        console.log("Offset dans apiwithpromise = " + offset)
        return getPage(offset).then(page =>{
            console.log("JE FETCH L'OFFSET " + offset)
            console.log(page.data.data)
            if(page.data.data.length == 0){
                //Il n'y a plus de data dans le call api
                console.log("NOPE")
                return [];
            }else{
                //Sinon on continue les calls
                offset += 200
                console.log("increment " +offset)
                return apiWithPromise().then(nextPageData => {
                    console.log("Concat offset " + offset + ' avec ' + nextPageData.length +" runs")
                    //console.log('page.data.data : ' + JSON.stringify(page.data.data))
                    return page.data.data.concat(nextPageData)
                })
            }
        })
        .catch(error => {
            console.error(error)
            return Promise.reject(error)
        })


        const end = new Date();
        console.log('Avec Promesse : ' + end - start + 'ms')

    }
    function testPromise(){

        const start = new Date();
        
        Promise.all([apiWithPromise()])
        .then(allData => {
            console.log(allData)
            const end = new Date();
            
            const diffTime = Math.abs(end - start);
            console.log('Avec promise.all : ' + diffTime + 'ms')
        })
        .catch(error => {
            console.error(error)
        })
        
    }

    async function apiWithFetch(){
        const start = new Date();
        var loop = 0;
        var results = [];

        var url = "https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category=9kv83mjd&max=200&embed=players"
        
        while(url){

            var response = await fetch(url) // response.json() => pagination
            console.log(fetch(url))

            var data = await response.json();
            
            var nextUrl = await data.pagination.links
            
            if (nextUrl.length > 1) {
                url = await nextUrl[1].uri
            }else if (nextUrl[0].rel === "next") {
                url = await nextUrl[0].uri
            }else{
                url = undefined;
            }
            
            results.push(...data.data);
        }

        const end = new Date();

        const diffTime = Math.abs(end - start);
        console.log('Avec fetch : ' + diffTime + 'ms')
        console.log(results)
    }

    testPromise();
    //apiWithFetch(); /// 3132 runs


}