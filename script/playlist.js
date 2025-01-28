
const API_URL_SEVERAL_TRACKS = "https://api.spotify.com/v1/tracks";
const accesToken = window.location.href.split("access_token=")[1];
let idUser="";


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


const renderTracksSelected = function(data){

    const obj_canciones_selecionadas = document.querySelector(".canciones_selecionadas");
    /*obj_canciones_selecionadas.innerHTML = ""; */
    
    for(let track of data.tracks){
        const createTrack_selected = document.createElement("div");
        createTrack_selected.className = "track_selected";
        createTrack_selected.innerHTML = ` <h2 class="track ">${track.name} - ${track.artists[0].name}</h2>`;


        // Creació botó ADD
        const bttnAdd_track = document.createElement("button");
        bttnAdd_track.className = "bttn bttn_add track_add";
        bttnAdd_track.textContent = "ADD";

        // Funció del botó ADD
        bttnAdd_track.addEventListener("click", function() {
            console.log('Afegir cançó seleccionada');
            addTrack_selected();
        }); 


        // Creació botó DEL
        const bttnDel_track = document.createElement("button");
        bttnDel_track.className = "bttn bttn_del track_del";
        bttnDel_track.textContent = "DEL";

        // Funció del botó DEL
        bttnDel_track.addEventListener("click", function() {
            console.log('Eliminar cançó seleccionada');
            deleteTrack_selected();
        }); 
        

        createTrack_selected.appendChild(bttnAdd_track);
        createTrack_selected.appendChild(bttnDel_track);
        obj_canciones_selecionadas.appendChild(createTrack_selected);
    }
}



const renderTracks = function(idPlaylist){

    const obj_canciones_playlist = document.querySelector(".cancion_playlist");
    obj_canciones_playlist.innerHTML = "";

    for(let item of idPlaylist.items){
        const createTrack = document.createElement("div");
        createTrack.className = "track_playlist";
        createTrack.innerHTML = `<h2 class="track ">${item.track.name} - ${item.track.artists[0].name} - ${item.added_at}</h2>`;

        // Creació botó DEL
        const bttnDel_trackPlaylist = document.createElement("button");
        bttnDel_trackPlaylist.className = "bttn bttn_del track_playlist_del";
        bttnDel_trackPlaylist.textContent = "DEL";

        // Funció del botó DEL
        bttnDel_trackPlaylist.addEventListener("click", function() {
            deleteTrack_from_Playlist(idPlaylist);
        });         


        createTrack.appendChild(bttnDel_trackPlaylist);
        obj_canciones_playlist.appendChild(createTrack);    
    }
}



const renderPlaylist = function(dada){

    const obj_q_playlist = document.querySelector(".q_playlist"); 

    for(let item of dada.items){
        const createPlaylist = document.createElement("div");
        createPlaylist.className = "playlist";
        createPlaylist.innerHTML = `<h2 class="track">${item.name}</h2>`;
        createPlaylist.addEventListener("click", function() {                   /*guardamos el id de la playlist*/
            getTrack(item.id); 
        });
        obj_q_playlist.appendChild(createPlaylist);
    }
}



/********************************************** ENDPOINT PLAYLIST DE L'USUARI ************************************/

const getPlayListByUser = async function(){
    const url = `https://api.spotify.com/v1/users/${idUser}/playlists`;
    
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
            console.log("OBJECT ENDPOINT PLAYLIST DE L'USUARI");
            console.log(data);
            renderPlaylist(data);
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




/*************************************************** ENDPOINT CANÇONS DE LA PLAYLIST *********************************/


const getTrack = async function(idPlaylist){
    const urlEndpoint = `https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`;

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
        const data = await resposta.json();
        console.log("OBJECT ENDPOINT CANÇONS DE LA PLAYLIST");
        console.log(data);
        
        //mostrar la informació per pantalla
        renderTracks(data);
    
    }catch (error){
        console.log(error);
    }
}


/************************************************ ENDPOINT DE LES CANÇONS SELECCIONADES DEL LOCALSTORAGE *******************/

const getIdtracksLocalStorage = function(){
    return localStorage.getItem("idTracks");
}

const getTrackSelected = async function(){
    let llistatracks = getIdtracksLocalStorage();
    let llistatracksJSON = JSON.parse(llistatracks);
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
        console.log("OBJECT ENDPOINT DE LES CANÇONS SELECCIONADES DEL LOCALSTORAGE");
        console.log(tracks);
        renderTracksSelected(tracks);
    } catch (error) {
        console.error("Error al obtenir les cançons:", error);
    }
}



getPlayList();
getTrackSelected();

/*************************************************** CANÇONS DE LA PLAYLIST - BUTTON DEL *********************************/


const deleteTrack_from_Playlist = async function(id_playList) {
     //La variable selectedPlayList és la playlist que hem seleccionem
    const url = `https://api.spotify.com/v1/playlists/${id_playList}/tracks`;

    const confirmDelete_trackPlaylist = confirm("Estàs segur que vols eliminar la cançó de la playlist?");
    if (!confirmDelete_trackPlaylist) return; 

    try{
        // Realizar la solicitud a la API
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accesToken}`
            },
            body: JSON.stringify({
                tracks: [{ uri:trackUri }] // Afegir la URIs que volem eliminar
            })
        });


        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
         // Actualizar la lista de canciones
         getTrack(id_playList);

    } catch (error) {
        console.error("Error al eliminar la canción de la playlist:", error);
    }
};



/*************************************************** CANÇONS SELECCIONADES - BUTTON DEL *********************************/


const deleteTrack_selected= async function(id_playList) {
    //La variable selectedPlayList és la playlist que hem seleccionem
   const url = `https://api.spotify.com/v1/playlists/${id_playList}/tracks`;

   const confirmDelete_track = confirm("Estàs segur que vols eliminar la cançó de la llista de cançons guardades?");
   if (!confirmDelete_track) return; 

   try{
       // Realizar la solicitud a la API
       const response = await fetch(url, {
           method: "DELETE",
           headers: {
               Authorization: `Bearer ${accesToken}`
           },
           body: JSON.stringify({
               tracks: [{ uri:trackUri }] // Afegir la URIs que volem eliminar
           })
       });


       if (!response.ok) {
           throw new Error(`Error ${response.status}: ${response.statusText}`);
       }
        // Actualizar canciones seleccionadas
        getTrackSelected(id_playList);

   } catch (error) {
       console.error("Error al eliminar la canción seleccionada:", error);
   }
};


/******************************************************** CANÇONS SELECCIONADES - BUTTON ADD ****************************************************/

const addTrack_selected= async function(id_playList) {
    //La variable selectedPlayList és la playlist que hem seleccionem
    const url = `https://api.spotify.com/v1/playlists/${selectedPlayList}/tracks`;

    const confirmAdd= confirm("Estàs segur que vols afegir la cançó a la playlist?");
    if (!confirmAdd) return; 
    
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accesToken}`,
            },
            body: JSON.stringify({
                uris: [trackUri], // Afegir la llista de URIs que volem afegir
            }),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Actualizar canciones seleccionadas
        getTrackSelected(id_playList);


    } catch (error) {
        console.error("Error al añadir la canción seleccionada:", error);
    }
};
 

/*************** BUTTON TORNAR ENRERE ***************/

const btnBack = document.querySelector(".bttn_back");

btnBack.addEventListener("click", ()=> back())

const back = function () {
    window.history.back();
};
