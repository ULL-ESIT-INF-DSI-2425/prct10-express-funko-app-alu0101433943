import { promises as fs } from "fs";
import path from "path";
import { FunkoPop } from "../models/funko.js";

/**
 * Clase FileManager para gestionar la lectura y escritura de archivos de Funkos.
 * Utiliza el sistema de archivos para almacenar los datos de los Funkos de cada usuario.
 * Cada usuario tiene su propia carpeta donde se guardan los archivos JSON de sus Funkos.
 * Los archivos se nombran con el ID del Funko y contienen la información del Funko en formato JSON.
 */
export class FileManager {
  private static basePath = "./data";

  /**
   * Obtiene la ruta de la carpeta del usuario.
   * @param user - Nombre del usuario.
   * @returns Ruta de la carpeta del usuario.
   */
  public static getUserFolder(user: string): string {
    return path.join(FileManager.basePath, user);
  }

  /**
   * Obtiene la ruta del archivo del Funko.
   * @param user - Nombre del usuario.
   * @param id - ID del Funko.
   * @returns Ruta del archivo del Funko.
   */
  private static getFunkoPath(user: string, id: number): string {
    return path.join(this.getUserFolder(user), `${id}.json`);
  }

  /**
   * Guarda un Funko en el sistema de archivos.
   * @param user - Nombre del usuario.
   * @param funko - Objeto FunkoPop a guardar.
   */
  public static async saveFunko(user: string, funko: FunkoPop): Promise<void> {
    const userFolder = FileManager.getUserFolder(user);
    await fs.mkdir(userFolder, { recursive: true });
    const filePath = FileManager.getFunkoPath(user, funko.id);
    await fs.writeFile(filePath, JSON.stringify(funko, null, 2));
  }

  /**
   * Lee un Funko del sistema de archivos.
   * @param user - Nombre del usuario.
   * @param id - ID del Funko a leer.
   * @returns Objeto FunkoPop leído o undefined si no existe.
   */
  public static async readFunko(user: string, id: number): Promise<FunkoPop | undefined> {
    try {
      const data = await fs.readFile(FileManager.getFunkoPath(user, id), "utf-8");
      return JSON.parse(data) as FunkoPop;
    } catch {
      return undefined;
    }
  }

  /**
   * Lee todos los Funkos de un usuario.
   * @param user - Nombre del usuario.
   * @returns Array de objetos FunkoPop.
   */
  public static async readAllFunkos(user: string): Promise<FunkoPop[]> {
    const userFolder = FileManager.getUserFolder(user);
    try {
      const files = await fs.readdir(userFolder);
      const funkoPromises = files.map(file => fs.readFile(path.join(userFolder, file), "utf-8"));
      const funkoContents = await Promise.all(funkoPromises);
      return funkoContents.map(content => JSON.parse(content) as FunkoPop);
    } catch {
      return [];
    }
  }

  /**
   * Elimina un Funko del sistema de archivos.
   * @param user - Nombre del usuario.
   * @param id - ID del Funko a eliminar.
   * @returns true si se eliminó correctamente, false si no existía.
   */
  public static async deleteFunko(user: string, id: number): Promise<boolean> {
    try {
      await fs.unlink(FileManager.getFunkoPath(user, id));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si un Funko existe en el sistema de archivos.
   * @param user - Nombre del usuario.
   * @param id - ID del Funko a verificar.
   * @returns true si existe, false si no.
   */
  public static async exists(user: string, id: number): Promise<boolean> {
    try {
      await fs.access(FileManager.getFunkoPath(user, id));
      return true;
    } catch {
      return false;
    }
  }
}
