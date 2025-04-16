// src/services/fileManager.ts
import { promises as fs } from "fs";
import path from "path";
import { FunkoPop } from "../models/funko.js";

// La clase FileManager gestiona la persistencia de Funkos en ficheros JSON.
export class FileManager {
  // Carpeta base donde se almacenan los datos (por ejemplo, "data")
  private static basePath = "./data";

  // Devuelve la ruta a la carpeta del usuario (ej.: ./data/juan)
  public static getUserFolder(user: string): string {
    return path.join(FileManager.basePath, user);
  }

  // Devuelve la ruta completa al fichero JSON de un Funko
  private static getFunkoPath(user: string, id: number): string {
    return path.join(this.getUserFolder(user), `${id}.json`);
  }

  // Guarda un Funko en el fichero correspondiente
  public static async saveFunko(user: string, funko: FunkoPop): Promise<void> {
    const userFolder = FileManager.getUserFolder(user);
    await fs.mkdir(userFolder, { recursive: true });
    const filePath = FileManager.getFunkoPath(user, funko.id);
    await fs.writeFile(filePath, JSON.stringify(funko, null, 2));
  }

  // Lee un Funko concreto; si no existe, devuelve undefined
  public static async readFunko(user: string, id: number): Promise<FunkoPop | undefined> {
    try {
      const data = await fs.readFile(FileManager.getFunkoPath(user, id), "utf-8");
      return JSON.parse(data) as FunkoPop;
    } catch (err) {
      return undefined;
    }
  }

  // Lee todos los Funkos de un usuario
  public static async readAllFunkos(user: string): Promise<FunkoPop[]> {
    const userFolder = FileManager.getUserFolder(user);
    try {
      const files = await fs.readdir(userFolder);
      const funkoPromises = files.map(file => fs.readFile(path.join(userFolder, file), "utf-8"));
      const funkoContents = await Promise.all(funkoPromises);
      return funkoContents.map(content => JSON.parse(content) as FunkoPop);
    } catch (err) {
      return [];
    }
  }

  // Elimina un Funko; devuelve true si se eliminó, false en caso contrario
  public static async deleteFunko(user: string, id: number): Promise<boolean> {
    try {
      await fs.unlink(FileManager.getFunkoPath(user, id));
      return true;
    } catch (err) {
      return false;
    }
  }

  // Comprueba si un Funko existe (basado en el fichero JSON)
  public static async exists(user: string, id: number): Promise<boolean> {
    try {
      await fs.access(FileManager.getFunkoPath(user, id));
      return true;
    } catch {
      return false;
    }
  }
}
