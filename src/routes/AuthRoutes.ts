import express from "express";
import AuthService from "../services/RegisterService";
import { CustomerData } from "../interfaces/CustomerData";

const router = express.Router();
const authService = new AuthService();

// Rota para o registro de usuário
router.post("/register", async (req, res) => {
  try {
    const userData: CustomerData = req.body;
    const newUser = await authService.registerUser(userData);
    res.json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      // Verifique se 'error' é uma instância de 'Error'
      res.status(400).json({ error: error.message });
    } else {
      // Se não for uma instância de 'Error', retorne um erro genérico
      res.status(400).json({ error: "An error occurred" });
    }
  }
});

export default router;
