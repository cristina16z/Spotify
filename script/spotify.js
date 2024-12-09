import {clientId, clientSecret} from '../env/client.js';

let tokenAcces="";
const btnBuscar = document.querySelector("button");


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
      headers: header,
      body: "grant_type=client_credentials", // Paràmetres del cos de la sol·licitud
    })
      .then((response) => { // 1r retorna la resposta en un status
        // Controlar si la petició ha anat bé o hi ha alguna error.
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Retorna la resposta com JSON
      })
      .then((data) => { //2nd then controla la informació del body, retorna la informació que vull mostrar per pantalla
        // Al data retorna el token d'accés que necessitarem
        // Haurem d’habilitar els botons “Buscar” i “Borrar”
        tokenAcces = data.acces_token;
        btnBuscar.disabled = false;
        console.log(data.getSpotifyAccessToken)
      })
      .catch((error) => {
        // SI durant el fetch hi ha hagut algun error arribarem aquí.
        console.error("Error a l'obtenir el token:", error);
      });
  };
  

  getSpotifyAccessToken(clientId, clientSecret)