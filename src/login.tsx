import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação de backend (credenciais válidas)
    const usuarioValido = {
      email: 'admin@ia.com',
      senha: '123456789'
    };

    if (email === usuarioValido.email && senha === usuarioValido.senha) {
      navigate('/dashboard');
    } else {
      setErro('Email ou senha incorretos');
    }
  };

  return (
    <div className="flex min-h-screen max-h-screen overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h2>
          <p className="text-gray-500 mb-6">Coloque seu email e senha para acessar a sua conta.</p>

          {erro && <div className="text-red-500 mb-2">{erro}</div>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Coloque seu email"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="*********"
              />
              <div className="text-right mt-1">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Esqueci minha senha
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm">Lembre-se de mim</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
            >
              Entrar
            </button>
          </form>

          <div className="my-6 text-center text-gray-500">ou</div>

          <div className="flex gap-4">
            <button className="flex-1 border px-1 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm">Entre com o Google</span>
            </button>
          </div>

          <p className="text-sm text-center mt-6">
            Não tem uma conta?{' '}
            <a href="#" className="text-blue-500 hover:underline">Inscreva-se</a>
          </p>
        </div>
      </div>

      <div className="hidden md:block w-1/2">
        <img
          src="https://github.com/PedroFernandes2000/frontend-ia-medicos/blob/main/public/Cruz%20Digital%20com%20Linhas%20Circuitais.png?raw=true"
          alt="IA_medicos"
          className="object-cover w-full h-full rounded-l-[40px]"
        />
      </div>
    </div>
  );
};

export default Login;
