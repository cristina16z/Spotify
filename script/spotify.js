import {clientId, clientSecret} from '../env/client.js';

let tokenAcces="";
let llistaTracks="";
const btnBuscar = document.querySelector("#buscar");
const btnClear = document.querySelector("#eliminar");
const inputSong = document.querySelector("#inputSong");
const results = document.querySelector(".results");



const renderitzarTracks = function(llistaTracks){
  results.textContent = "";
  for(let i = 0; i < llistaTracks.length; i++){
    console.log(llistaTracks[i].album.images[0].url);
    const objDiv = document.createElement("div");
    objDiv.className="track";
    objDiv.addEventListener("click", function() {
      searchArtist(llistaTracks[i].artists[0].id)
    });
    objDiv.innerHTML=`<img src=${llistaTracks[i].album.images[0].url} class="track_img"/>
                     <h1 class="track_name">${llistaTracks[i].name}</h1>
                     <div class="track_artista">Artista : ${llistaTracks[i].artists[0].name}</div>
                     <div class="track_album">Àlbum: ${llistaTracks[i].album.name}</div>
                     <button class="track_add">+  Afegir Cançó</button`;
   
    results.appendChild(objDiv);

    // let name = llistaTracks[i].name;
    // console.log(name);
  }
}


const searchArtist = function(idArtist){
  console.log(idArtist);
  buscarArtista(idArtist);
  buscarTopSong();

}


/* Funció botón Borrar */
btnClear.addEventListener("click", function(){
  results.innerHTML = "";
  results.textContent = "Fes una nova búsqueda";
  inputSong.value = "";
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
        // Al data retorna el token d'accés que necessitarem
        // Haurem d’habilitar els botons “Buscar” i “Borrar”
        tokenAcces = data.access_token;  //rep el acces_token de spotify
        btnBuscar.disabled = false;
        btnClear.disabled = false;
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
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`;
  
  
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
        console.log(data)
       // Data retorna tota la informació de la consulta de l’API
        llistaTracks = data.tracks.items;
       //console.log(data);

        renderitzarTracks(llistaTracks);

      })
      .catch((error) => {
        console.error("Error al buscar cançons:", error);
      });
  }
  
  btnBuscar.addEventListener("click", function(){
    searchSpotifyTracks(inputSong.value,tokenAcces);
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
      console.log(data)
     // Data retorna tota la informació de la consulta de l’API
      
    })
    .catch((error) => {
      console.error("Error al buscar cançons:", error);
    });
}

/********************************************************************* ENDPOINT GET TOP TRACKS  **************************************************/


// const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks`;
// const header = {
//    Authorization: `Bearer ${token}`,
// };
