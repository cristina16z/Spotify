
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";
const accesToken = window.location.href.split("access_token=")[1];
let idUser="";
console.log(accesToken);


const getUser = async function () {
    const urlMe = "https://api.spotify.com/v1/me";
    
    try {
        const response = await fetch(urlMe, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${accesToken}`,
            },
        });
    
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    
        const data = await response.json();
  

        if (data) {
            idUser = data.id;
        } else {
            console.log("No hi ha ID de l'usuari");
        }
    } catch (error) {
      console.error("Error en obtenir l'usuari:", error);
    }
};



/********************************** FUNCIONS DE RENDERITZACIÓ ******************************************/


const renderTracksSelected = function(tracks){

    const obj_results = document.querySelector(".canciones_selecionadas");
    

    for(let track of tracks.tracks){
        const createTrack = document.createElement("div");
        createTrack.className = "track_selected";
        createTrack.innerHTML = ` <h2 class="track_name">${track.name} - ${track.artists[0].name}</h2>
                                    <button class="bttn bttn_add">ADD</button>
                                    <button class="bttn bttn_del">DEL</button> `;
        obj_results.appendChild(createTrack);
    }
}



const renderTracks = function(idPlaylist){

    const obj_results = document.querySelector(".canciones_playlist");
    obj_results.innerHTML = "";

    for(let track of tracks.tracks){
        const createTrack = document.createElement("div");
        createTrack.className = "track_playlist";
        createTrack.innerHTML = ` <h2 class="track_playlist_name">${track.name} - ${track.artists[0].name}</h2>
                                    <button class="bttn_del">DEL</button> `;
        obj_results.appendChild(createTrack);
    }
}



const renderPlaylist = function(dada){

    const obj_results = document.querySelector(".playlists");
    obj_results.innerHTML = "";

    for(let item of dada.items){
        const createTrack = document.createElement("div");
        createTrack.className = "playlist";
        createTrack.innerHTML = ` <h2 class="playlist_name"></h2>`;
        obj_results.appendChild(createTrack);
    }
}



/********************************************** ENDPOINT PLAYLIST DE L'USUARI ************************************/

const getPlayListByUser = async function(){
    const url = `https://api.spotify.com/v1/users/${idUser}/playlists`;
    console.log(url);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${accesToken}`,
            },
        });
    
        if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    
        const data = await response.json();
  

        if (data) {
            console.log(data);
        } else {
            console.log("No hi ha ID de l'usuari");
        }
    } catch (error) {
      console.error("Error en obtenir l'usuari:", error);
    }
}

const getPlayList = function(){
    getUser().then(function(){
        getPlayListByUser();
    });
}


const getIdtracksLocalStorage = function(){
    return localStorage.getItem("idTracks");
}


const getTrack = async function(llistatracks){
    const urlEndpoint = `${API_URL_SEVERAL_TRACKS}?ids=${llistatracks}`;
    console.log("url get Track  " + urlEndpoint);
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
        // renderTracks(tracks);
    
    }catch (error){
        console.log(error);
    }
   

}


/************************************************ ENDPOINT DE LES CANÇONS SELECCIONADES DEL LOCALSTORAGE *******************/

const getTrackSelected = async function(){
    let llistatracks = getIdtracksLocalStorage();
    let llistatracksJSON = JSON.parse(llistatracks);
    console.log("get track selected " + llistatracksJSON.ids.join(","));
    //llistatracks = llistatracks.replaceAll(";", ",")
    let trackIds = llistatracksJSON.ids.join(",");

    const url2 = `${API_URL_SEVERAL_TRACKS}?ids=${trackIds}`;
    try{
        const response = await fetch(url2, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accesToken}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la consulta: ${response.status}`);
        }

        const tracks = await response.json();
        console.log(tracks);
        renderTracksSelected(tracks);
    } catch (error) {
        console.error("Error al obtenir les cançons:", error);
    }
}




console.log('inici del programa');
getPlayList();
console.log('meitat del programa');
getTrackSelected();
console.log('final del programa');