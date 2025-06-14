import { useState } from "react";
import { authRegister } from "../../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validarEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validarSenha = (senha: string) => {
    return senha.length >= 8;
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome) {
      setErro('Por favor, informe seu nome completo');
      return;
    }

    if (!email) {
      setErro('Por favor, informe seu email');
      return;
    }

    if (!validarEmail(email)) {
      setErro('Por favor, informe um email válido');
      return;
    }

    if (!senha) {
      setErro('Por favor, informe uma senha');
      return;
    }

    if (!validarSenha(senha)) {
      setErro('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authRegister(nome, email, senha, confirmarSenha);

      console.log(response);
      if (response.user) {
        setNome('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');
        setErro('');
         window.location.href = '/login';
      } else {
        if (response.error === 'EMAIL_EXISTS') {
          setErro('Este email já está cadastrado. Tente fazer login.');
        } else {
          setErro(response.message || 'Erro ao realizar cadastro. Por favor, tente novamente.');
        }
      }
    } catch (error) {
      console.error('Erro durante o cadastro:', error);
      setErro('Erro ao conectar ao servidor. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">
            Crie sua conta
          </h2>
          <p className="text-gray-500 mb-6">
            Preencha os campos abaixo para se cadastrar.
          </p>
          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
              <p>{erro}</p>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleCadastro}>
            <div>
              <label className="block mb-1 text-sm font-medium">Nome Completo</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Coloque seu email"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Senha</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  placeholder="Crie uma senha (mín. 8 caracteres)"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                A senha deve ter pelo menos 8 caracteres
              </p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Confirmar Senha</label>
              <div className="relative">
                <input
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  aria-label={mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-blue-500' : 'bg-blue-700'} text-white py-2 rounded-md hover:bg-blue-800 transition flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </>
              ) : (
                <p>Cadastrar</p>
              )}
            </button>
          </form>
          <div className="my-6 text-center text-gray-500">ou</div>
          <div className="flex gap-4">
            <button
              disabled={isLoading}
              className="flex-1 border px-1 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm">
                Cadastre-se com o Google
              </span>
            </button>
          </div>
          <p className="text-sm text-center mt-6">
            Já tem uma conta?
            <button
              onClick={() => {
                window.location.href = "/login"
                setErro('');
              }}
              className="text-blue-500 hover:underline focus:outline-none"
              disabled={isLoading}
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
      <div className="hidden md:block w-1/2">
        <img
          src="/Cruz Digital com Linhas Circuitais.png"
          alt="IA Médicos"
          className="object-cover w-full h-full rounded-l-[40px]"
        />
      </div>
    </div>
  );
};

export default Register;