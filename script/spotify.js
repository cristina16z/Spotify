import {clientId, clientSecret} from '../env/client.js';

let tokenAcces="";
let llistaTracks="";
const btnBuscar = document.querySelector("#buscar");
const btnClear = document.querySelector("#eliminar");

const inputSong = document.querySelector("#inputSong");
const results = document.querySelector(".results");
const infoArtista = document.querySelector(".infoArtista");
const infoLlista= document.querySelector(".infoLlista");

let resultadosCargados = 0;
let resultadosTotales = 0;
let actualizar = false;
let quantitatSongs;




/************************************************************ Renderitzar Tracks ***************************************************************/


const renderitzarTracks = function(llistaTracks, total){
  
  // Limpia sólo el texto inicial
  if (results.textContent === "Fes una nova búsqueda") {
    results.textContent = ""; 
  }


  // Cogerá el min entre results cargados y total
  // evitará acceder a índices superiores que no existen, es decir, que no supere el total de canciones que hay en total
  const rangSongs = Math.min(resultadosCargados + 12, total);

  //Creació dels diferents elements de cançons amb la seva imatge, nom, artista, album..
  //Reneritzará les cancions partint de resultadosCargados hasta rangSongs 
  for(let i = resultadosCargados; i < rangSongs;  i++){
   
    const objDiv = document.createElement("div");
    objDiv.className="track";
    objDiv.addEventListener("click", function() {
      searchArtist(llistaTracks[i].artists[0].id)
    });
    objDiv.innerHTML=`<img src=${llistaTracks[i].album.images[0].url} class="track_img"/>
                     <h1 class="track_name">${llistaTracks[i].name}</h1>
                     <div class="track_artista">Artista : ${llistaTracks[i].artists[0].name}</div>
                     <div class="track_album">Àlbum: ${llistaTracks[i].album.name}</div>`;

    // Crear botó Afegir Cançó
    const btnAddTrack = document.createElement("button");
    btnAddTrack.className = "track_add";
    btnAddTrack.textContent = "+ Afegir Cançó";

    // Botó Afegir Cançó guardi el ID en el localStorage
    btnAddTrack.addEventListener("click", function() {
      console.log('afegir cançó en local storage:');
      const id_track = (llistaTracks[i].id);
      guardarLocalStorage(id_track);
    });         

    objDiv.appendChild(btnAddTrack);
    results.appendChild(objDiv);
  }

  
  resultadosCargados = rangSongs;                                 //Actualizamos las canciones cargadas
  
  //Creació del botó de info sobre les cançons cargades y el total de cançons trobades
  if(!actualizar){
    
    quantitatSongs = document.createElement("button");
    quantitatSongs.className="quantitatSongs";
    results.appendChild(quantitatSongs);

    //Funcionalitat del botó de cargar més cançons
    quantitatSongs.addEventListener("click", function () {
      if (resultadosCargados < resultadosTotales) {               //si hay canciones que no se han cargado aún 
        searchSpotifyTracks(inputSong.value, tokenAcces);
      }
    });

    actualizar = true;                                            //Evitar recrear el botón de cargar canciones nuevamente

  }else{
    results.appendChild(quantitatSongs);                          //reposicionar el botón abajo
  }


  quantitatSongs.textContent = `+ Cançons (${resultadosCargados} de ${total})`;
  if (resultadosCargados >= total) {                              //Si les carregades son més que el total, ya las hem carregat totes
    quantitatSongs.disabled = true;
    quantitatSongs.textContent = `+ Cançons (${resultadosCargados} de ${total})`;
  }
};


/*********************************************************** Local Storage *********************************************************************/


const guardarLocalStorage = function(id_track) {
  
  //Inicialitza o recupera lo que tenía abans
  let ids_localStorage = JSON.parse(localStorage.getItem("idTracks")) || { ids: [] };

  //Evita ids tracks duplicats
  if (!ids_localStorage.ids.includes(id_track)) {
   ids_localStorage.ids.push(id_track);
  }

  //Guarda l'objecte actualitzat en el local Storage
  localStorage.setItem("idTracks", JSON.stringify(ids_localStorage));
  console.log("ids de cançons:",ids_localStorage.ids);                    //comprovació desde la consola

};




/************************************************************ Renderitzar Artista ***************************************************************/

const renderizarArtista =  function(data){
  infoArtista.innerHTML = "";
 
  const objDivArt = document.createElement("div");
  //objDivArt .className="infoArtistaDades";
  objDivArt.innerHTML=`<img src=${data.images[0].url} class="track_img_profile"/>
                    <h1 class="track_name">${data.name}</h1>
                    <div class="track_popularity"> Popularitat: ${data.popularity}</div>
                    <div class="track_generes">Gèneres: ${data.genres}</div>
                    <div class="track_followers">Seguidors: ${data.followers.total.toLocaleString('es-ES')}</div>`
   
  infoArtista.appendChild(objDivArt);
};



/************************************************************ Renderitzar Top Tracks ***************************************************************/

const renderizarTopTracks =  function(data){
  infoLlista.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const objDivTopTrack = document.createElement("div");
    objDivTopTrack.className="track_top";
    objDivTopTrack.innerHTML=`<div> ${i + 1}. ${data.tracks[i].name}</div>`
    infoLlista.appendChild(objDivTopTrack );
  }
};


const searchArtist = function(idArtist){
  console.log(idArtist);
  buscarArtista(idArtist, tokenAcces);
  buscarTopSong(idArtist, tokenAcces);
}


/********************************************************  Funció botón Borrar *********************************************************************/

btnClear.addEventListener("click", function(){
  results.innerHTML = "";
  results.textContent = "Fes una nova búsqueda";

  infoArtista.innerHTML = "";
  infoArtista.textContent = "Informació Artista"

  infoLlista.innerHTML = "";
  infoLlista.textContent = "Informació Cançons";

  inputSong.value = "";
  resultadosCargados = 0;
  resultadosTotales = 0;
  actualizar = false;
});














/********************************************************************* ENDPOINT TOKEN  **************************************************/

const getSpotifyAccessToken = function (clientId, clientSecret) {
    // Url de l'endpont de spotify
    const url = "https://accounts.spotify.com/api/token";
    // ClientId i ClienSecret generat en la plataforma de spotify
    const credentials = btoa(`${clientId}:${clientSecret}`);
  
  
    //Es crear un header on se li passa les credencials
    const header = {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
  
  
   
    fetch(url, {// petició
      method: "POST",
      headers: header,  //li passem el clientID, ClientSecret
      body: "grant_type=client_credentials", // Paràmetres del cos de la sol·licitud
    })
      .then((response) => { // 1r Controla la resposta del status
        // Controlar si la petició ha anat bé o hi ha alguna error.
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Retorna la resposta com JSON
      })
      .then((data) => { //2nd then controla la informació del body, retorna la informació que vull mostrar per pantalla
        console.log('Get Token');
        // Al data retorna el token d'accés que necessitarem
        // Haurem d’habilitar els botons “Buscar” i “Borrar”
        tokenAcces = data.access_token;  //rep el acces_token de spotify
        btnBuscar.disabled = false;
        btnClear.disabled = false;
        btnPlaylist.disabled = false;
      })
      .catch((error) => {
        // SI durant el fetch hi ha hagut algun error arribarem aquí.
        console.error("Error a l'obtenir el token:", error);
      });
  };
  

  getSpotifyAccessToken(clientId, clientSecret)




/********************************************************************* ENDPOINT SEARCH  **************************************************/


  const searchSpotifyTracks = function (query, tokenAcces) {
    // Definim l’endpoint, la query és el valor de búsqueda.
    // Limitem la búsqueda a cançons i retornarà 12 resultats.
    const searchUrl =
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12&offset=${resultadosCargados}`;
                          //limite 12 canciones y parte de los resultados ya cargados si se ha hecho previamente una búsqueda
  
    // Al headers sempre s’ha de posar la mateixa informació.
    fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenAcces}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
       // Controlem si la petició i la resposta han anat bé. 
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Get Search');
        console.log(data)
       // Data retorna tota la informació de la consulta de l’API
        if (resultadosCargados == 0){
          llistaTracks = data.tracks.items;
          resultadosTotales = data.tracks.total;
        }else{
          llistaTracks = [...llistaTracks, ...data.tracks.items]; // Acumula las nuevas canciones
        }

        if (llistaTracks.length > 0) {
          renderitzarTracks(llistaTracks, resultadosTotales);
        }
      })
      .catch((error) => {
        console.error("No hi han resultats", error);
      });
  }
  
  btnBuscar.addEventListener("click", function(){

    let inputValor = inputSong.value;

    if (inputValor.length == 0 ){                             //Sino has introduit res, salta un alert
      alert(`Has d'introduir un nom d’una cançó`);
    } else if (inputValor.length < 2){                        //si nomès has introduit 1 sol caràcter saltará un alert
      alert('Has d’introduir almenys 2 caràcters');

    }else{
      results.innerHTML = ""; 
      resultadosCargados = 0; 
      resultadosTotales = 0;
      actualizar = false;
      searchSpotifyTracks(inputSong.value,tokenAcces);
    }
  });
  



/********************************************************************* ENDPOINT GET ARTIST  **************************************************/


const buscarArtista = function(idArtist, tokenAcces){
  const urlEndPointArtist = `https://api.spotify.com/v1/artists/${idArtist}`;

  // Al headers sempre s’ha de posar la mateixa informació.
  fetch(urlEndPointArtist, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenAcces}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
     // Controlem si la petició i la resposta han anat bé. 
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Get artist');
     // Data retorna tota la informació de la consulta de l’API
      renderizarArtista(data)
    })
    .catch((error) => {
      console.error("Error al obtenir dades de l'artista:", error);
    });
}



/********************************************************************* ENDPOINT GET TOP TRACKS  **************************************************/

const buscarTopSong = function(idArtist, tokenAcces){
  const urlEndPointTopTracks = `https://api.spotify.com/v1/artists/${idArtist}/top-tracks`;

  // Al headers sempre s’ha de posar la mateixa informació.
  fetch(urlEndPointTopTracks, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${tokenAcces}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
     // Controlem si la petició i la resposta han anat bé. 
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Get Tracks');
     // Data retorna tota la informació de la consulta de l’API
     renderizarTopTracks(data);
      
    })
    .catch((error) => {
      console.error("Error al renderitzar Top Tracks", error);
    });
} 





/*************************************************************************** PLAYLIST **********************************************************/



const URL = "https://accounts.spotify.com/authorize";
const redirectUri = "http://127.0.0.1:5501/playlist.html";
const scopes ="playlist-modify-private user-library-modify playlist-modify-public";

const btnPlaylist = document.querySelector("#playlist");

btnPlaylist.addEventListener("click", ()=> autoritzar())

const autoritzar = function () {
  const authUrl =
    URL +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scopes}`;


  window.location.assign(authUrl);
};
