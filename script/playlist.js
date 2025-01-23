
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";
//const accesToken = accesToken.split("acces_token=")[1];
const accesToken = window.location.href.split("acces_token=")[1];

console.log(accesToken);

//funcions per mostrar per pantalla


//funcions async
const renderTracksSelected = function(tracks){

}


/****************************************** Retorna la llista de playlist de l'usuari *******************/
const getPlayList = function(){
    console.log("getPlayList");
}


const getIdtracksLocalStorage = function(){
    return localStorage.getItem("idTracks");
}

const getTrack = async function(llistatracks){
    const urlEndpoint = `${API_URL_SEVERAL_TRACKS}?ids=${llistatracks}`;
    console.log(urlEndpoint);
    //cridar la api

    try{
        const resposta = await fetch(urlEndpoint, 
            {
              "method":"GET",
              "headers":{
                Authorization: `Bearer ${accesToken }`,
              }
            }
      
        );

         //tractar la resposta
        if(!resposta.ok){
            throw Error("Error al fer la consulta", resposta.status);
        }

        //consultar la informació
        const tracks = await resposta.json();
        console.log(tracks);

    
        //mostrar la informació per pantalla
        renderTracksSelected(tracks);
    

    }catch (error){
        console.log(error);
    }
   

}


/************************************************ Retorna les cançons guardades al localStorage *******************/

const getTrackSelected = function(){
    let llistatracks = getIdtracksLocalStorage();
    console.log(llistatracks);
    let llistatracksJSON = JSON.parse(llistatracks);
    console.log(llistatracksJSON.ids.join(","));
    //llistatracks = llistatracks.replaceAll(";", ",")


    //getTrackSelected();
    //get tracks localstorage
    //cridar l'endpoint https://api.spotify.com/v1/tracks

    const url = `https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
    
}



console.log('inici del programa');
getPlayList();
console.log('meitat del programa');
getTrackSelected();
console.log('final del programa');

