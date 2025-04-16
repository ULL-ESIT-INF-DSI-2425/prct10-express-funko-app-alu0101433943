export enum FunkoType {
    Pop = "Pop!",
    PopRides = "Pop! Rides",
    VynilSoda = "Vynil Soda",
    VynilGold = "Vynil Gold"
  }
  
  export enum Genre {
    Animation = "Animación",
    TV = "Películas y TV",
    Videogames = "Videojuegos",
    Sports = "Deportes",
    Music = "Música",
    Anime = "Ánime"
  }
  
  export interface FunkoPop {
    id: number;
    name: string;
    description: string;
    type: FunkoType;
    genre: Genre;
    franchise: string;
    number: number;
    exclusive: boolean;
    specialFeatures: string;
    marketValue: number;
  }
  