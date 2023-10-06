import express from "express";
import RegisterService from "../services/RegisterService";
import AuthService from "../services/AuthService";
import { CustomerData } from "../interfaces/CustomerData";

const router = express.Router();
const authService = new AuthService();
const registerService = new RegisterService();

// Rota para o registro de usuário
router.post("/register", async (req, res) => {
  try {
    const userData: CustomerData = req.body;
    const newUser = await registerService.registerUser(userData);
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o email existe no banco de dados
    const user = await authService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: "Email não encontrado" });
    }

    // Verifica se a senha está correta
    const isPasswordValid = await authService.verifyPassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Gera um token de autenticação
    const token = authService.generateAuthToken(user.id);

    res.json({ id: user.id, name: user.fullName, email: user.email, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Ocorreu um erro" });
    }
  }
});

export default router;
