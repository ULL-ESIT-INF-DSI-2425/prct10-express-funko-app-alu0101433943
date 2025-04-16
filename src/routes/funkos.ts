// src/routes/funkos.ts
import { Router, Request, Response } from "express";
import { FunkoPop } from "../models/funko.js";
import { ResponseType } from "../models/response.js";
import { FileManager } from "../services/fileManager.js";

const router = Router();

// GET /funkos
// Si se envía "id" en query, devuelve un Funko concreto; de lo contrario, lista todos los Funkos del usuario.
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const user = req.query.user as string;
  if (!user) {
    res.status(400).json({ success: false, message: "Falta el parámetro 'user'" });
    return;
  }

  if (req.query.id) {
    const id = Number(req.query.id);
    const funko = await FileManager.readFunko(user, id);
    if (!funko) {
      res.status(404).json({ success: false, message: "Funko no encontrado" });
      return;
    }
    res.json({ success: true, funko });
    return;
  }

  const funkoPops = await FileManager.readAllFunkos(user);
  res.json({ success: true, funkoPops });
});

// POST /funkos
// Añade un nuevo Funko a la lista de un usuario. Se espera que "user" se envíe en la query y los datos del Funko en el body.
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const user = req.query.user as string;
  const funko: FunkoPop = req.body;
  
  if (!user) {
    res.status(400).json({ success: false, message: "Falta el parámetro 'user'" });
    return;
  }

  if (await FileManager.exists(user, funko.id)) {
    res.status(409).json({ success: false, message: "Funko ya existe" });
    return;
  }

  await FileManager.saveFunko(user, funko);
  res.status(201).json({ success: true, message: "Funko añadido con éxito" });
});

// DELETE /funkos
// Elimina un Funko de la lista de un usuario.
// Se esperan "user" e "id" en la query.
router.delete("/", async (req: Request, res: Response): Promise<void> => {
  const user = req.query.user as string;
  const id = Number(req.query.id);
  if (!user || !req.query.id) {
    res.status(400).json({ success: false, message: "Falta el parámetro 'user' o 'id'" });
    return;
  }

  const deleted = await FileManager.deleteFunko(user, id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Funko no encontrado" });
    return;
  }
  res.json({ success: true, message: "Funko eliminado con éxito" });
});

// PATCH /funkos
// Modifica un Funko existente. Se espera "user" en la query y, en el body, los datos a actualizar (incluyendo el id)
router.patch("/", async (req: Request, res: Response): Promise<void> => {
  const user = req.query.user as string;
  const updatedFunko: FunkoPop = req.body;
  
  if (!user) {
    res.status(400).json({ success: false, message: "Falta el parámetro 'user'" });
    return;
  }

  if (!(await FileManager.exists(user, updatedFunko.id))) {
    res.status(404).json({ success: false, message: "Funko no encontrado" });
    return;
  }

  await FileManager.saveFunko(user, updatedFunko);
  res.json({ success: true, message: "Funko actualizado con éxito" });
});

export default router;
