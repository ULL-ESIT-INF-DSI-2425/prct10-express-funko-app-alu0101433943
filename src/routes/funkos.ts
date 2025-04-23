import { Router, Request, Response } from "express";
import { FunkoPop } from "../models/funko.js";
import { FileManager } from "../services/fileManager.js";

const router = Router();

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
