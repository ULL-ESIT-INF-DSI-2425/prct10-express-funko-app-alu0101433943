import request from "request";

export type myFilter = {
  name?: string,
  gender?: string,
  race?: string,
  affiliation?: string
}

export const findCharacter = ( filter: myFilter ) => {
  return new Promise<request.Response>((resolve, reject) => {

      let url: string = "https://dragonball-api.com/api/characters?";

      for (const myKey in filter) {
        if (filter[myKey]) {
          url += `${myKey}=${filter[myKey]}&`;
        }
      }

      request({url, json: true}, (error, response) => {
        if (response.body.length === 0) {
          reject("No resultado");
        } else if (error) { 
          reject(error.message);
        } else {
          resolve(response)
        }
      });
  });
};

const filter: myFilter = { name: process.argv[2], gender: process.argv[3], race: process.argv[4], affiliation: process.argv[5]}

findCharacter(filter)
  .then((respuesta) => {
    console.log(respuesta.body)
  })
  .catch((error) => {
    console.log(error)
  })