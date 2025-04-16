import { FunkoPop } from "./funko.js";

export type ResponseType = {
  success: boolean;
  message?: string;
  funko?: FunkoPop;
  funkoPops?: FunkoPop[];
};
