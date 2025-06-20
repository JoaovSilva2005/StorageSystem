import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const API_URL = "http://localhost:3001"; // Ajuste se seu back estiver em outra porta/host

function LoginRegister() {
  const [isActive, setIsActive] = useState(false);

  // Mostrar/ocultar senhas
  const [mostrarSenhaLogin, setMostrarSenhaLogin] = useState(false);
  const [mostrarSenhaRegister, setMostrarSenhaRegister] = useState(false);
  const [mostrarConfirmarSenhaRegister, setMostrarConfirmarSenhaRegister] =
    useState(false);

  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const [registerData, setRegisterData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    telefone: "",
  });

  // Registro
  const handleRegister = async () => {
    const { nome, email, senha, confirmarSenha, cpf, telefone } = registerData;

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nome || !email || !senha || !confirmarSenha || !cpf || !telefone) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Email inválido.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    if (!cpfRegex.test(cpf)) {
      alert("CPF inválido. Use o formato 999.999.999-99");
      return;
    }

    if (!telefoneRegex.test(telefone)) {
      alert("Telefone inválido. Use o formato (99) 99999-9999");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          cpf,
          telefone,
        }),
      });

      if (response.ok) {
        alert("Registro realizado com sucesso!");
        setIsActive(false);
        setRegisterData({
          nome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
          cpf: "",
          telefone: "",
        });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Erro no registro.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  // Login
  const handleLogin = async () => {
    const { email, senha } = loginData;
    if (!email || !senha) {
      alert("Preencha email e senha.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        // Salvar token JWT localmente para futuras requisições
        localStorage.setItem("token", data.token);
        alert("Login realizado com sucesso!");
        // Aqui você pode redirecionar para outra página ou atualizar estado
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Credenciais inválidas.");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  };

  const formatCpf = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-blue-200">
      <div className="relative w-[800px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        <div className="relative w-[400px] h-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-[800px] h-full flex transition-transform duration-700 ease-in-out ${
              isActive ? "-translate-x-[400px]" : "translate-x-0"
            }`}
          >
            {/* Login */}
            <div className="w-[400px] h-full flex flex-col items-center justify-center p-8">
              <h1 className="text-3xl font-bold mb-4">Login</h1>
              <div className="w-full space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />

                <div className="relative">
                  <input
                    type={mostrarSenhaLogin ? "text" : "password"}
                    placeholder="Senha"
                    className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={loginData.senha}
                    onChange={(e) =>
                      setLoginData({ ...loginData, senha: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setMostrarSenhaLogin(!mostrarSenhaLogin)}
                    aria-label={
                      mostrarSenhaLogin ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {mostrarSenhaLogin ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Entrar
                </button>
              </div>
            </div>

            {/* Registro */}
            <div className="w-[400px] h-full flex flex-col items-center justify-center p-8 overflow-y-auto">
              <h1 className="text-3xl font-bold mb-4">Registrar</h1>
              <div className="w-full space-y-4">
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={registerData.nome}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, nome: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />

                <div className="relative">
                  <input
                    type={mostrarSenhaRegister ? "text" : "password"}
                    placeholder="Senha"
                    className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={registerData.senha}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        senha: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() =>
                      setMostrarSenhaRegister(!mostrarSenhaRegister)
                    }
                    aria-label={
                      mostrarSenhaRegister ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {mostrarSenhaRegister ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={mostrarConfirmarSenhaRegister ? "text" : "password"}
                    placeholder="Confirmar senha"
                    className="w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={registerData.confirmarSenha}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmarSenha: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() =>
                      setMostrarConfirmarSenhaRegister(
                        !mostrarConfirmarSenhaRegister
                      )
                    }
                    aria-label={
                      mostrarConfirmarSenhaRegister
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {mostrarConfirmarSenhaRegister ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="CPF"
                  maxLength={14}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={registerData.cpf}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      cpf: formatCpf(e.target.value),
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Telefone celular"
                  maxLength={15}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={registerData.telefone}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      telefone: formatTelefone(e.target.value),
                    })
                  }
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[400px] h-full flex flex-col justify-center items-center bg-blue-500 text-white">
          {!isActive ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Novo aqui?</h2>
              <p className="mb-6 text-center px-6">Crie sua conta agora!</p>
              <button
                onClick={() => setIsActive(true)}
                className="px-8 py-3 bg-white text-blue-500 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Registrar
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Já tem conta?</h2>
              <p className="mb-6 text-center px-6">Faça login novamente!</p>
              <button
                onClick={() => setIsActive(false)}
                className="px-8 py-3 bg-white text-blue-500 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatCpf(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatTelefone(value) {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
}

export default LoginRegister;
