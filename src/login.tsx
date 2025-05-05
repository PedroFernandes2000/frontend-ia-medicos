import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Tipo para o usuário
type Usuario = {
  email: string;
  senha: string;
  nome?: string;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [estaCadastrando, setEstaCadastrando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const navigate = useNavigate();

  // Usuário padrão
  const usuarioPadrao: Usuario = {
    email: 'admin@ia.com',
    senha: '123456789'
  };

  // Função para obter usuários do localStorage
  const getUsuariosCadastrados = (): Usuario[] => {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  };

  // Função para salvar usuário no localStorage
  const salvarUsuario = (usuario: Usuario) => {
    const usuarios = getUsuariosCadastrados();
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica usuário padrão
    if (email === usuarioPadrao.email && senha === usuarioPadrao.senha) {
      navigate('/dashboard');
      return;
    }

    // Verifica usuários cadastrados
    const usuariosCadastrados = getUsuariosCadastrados();
    const usuarioEncontrado = usuariosCadastrados.find(
      (user) => user.email === email && user.senha === senha
    );

    if (usuarioEncontrado) {
      navigate('/dashboard');
    } else {
      setErro('Email ou senha incorretos');
    }
  };

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    
    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    // Verifica se email já existe
    const usuariosCadastrados = getUsuariosCadastrados();
    const usuarioExistente = usuariosCadastrados.find(
      (user) => user.email === email
    );

    if (usuarioExistente) {
      setErro('Este email já está cadastrado');
      return;
    }

    // Cria novo usuário
    const novoUsuario: Usuario = {
      nome,
      email,
      senha
    };

    // Salva no localStorage
    salvarUsuario(novoUsuario);
    
    // Limpa o formulário e mostra mensagem
    setNome('');
    setEmail('');
    setSenha('');
    setConfirmarSenha('');
    setErro('');
    setEstaCadastrando(false);
    
    alert('Cadastro realizado com sucesso! Faça login para continuar.');
  };

  return (
    <div className={"flex min-h-screen overflow-hidden"+ (estaCadastrando ? "" : " max-h-screen")}>
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-2">
            {estaCadastrando ? 'Crie sua conta' : 'Bem-vindo de volta!'}
          </h2>
          <p className="text-gray-500 mb-6">
            {estaCadastrando 
              ? 'Preencha os campos abaixo para se cadastrar.' 
              : 'Coloque seu email e senha para acessar a sua conta.'}
          </p>

          {erro && <div className="text-red-500 mb-2">{erro}</div>}

          <form className="space-y-4" onSubmit={estaCadastrando ? handleCadastro : handleLogin}>
            {estaCadastrando && (
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
            )}

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
                  placeholder={estaCadastrando ? "Crie uma senha (mín. 8 caracteres)" : "*********"}
                  required
                  minLength={estaCadastrando ? 8 : undefined}
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
            </div>

            {estaCadastrando && (
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
            )}

            {!estaCadastrando && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="lembrar" className="mr-2" />
                  <label htmlFor="lembrar" className="text-sm cursor-pointer">
                    Lembre-se de mim
                  </label>
                </div>
                <div>
                  <a href="#" className="text-sm text-blue-500 hover:underline">
                    Esqueci minha senha
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition"
            >
              {estaCadastrando ? 'Cadastrar' : 'Entrar'}
            </button>
          </form>

          <div className="my-6 text-center text-gray-500">ou</div>

          <div className="flex gap-4">
            <button className="flex-1 border px-1 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm">
                {estaCadastrando ? 'Cadastre-se com o Google' : 'Entre com o Google'}
              </span>
            </button>
          </div>

          <p className="text-sm text-center mt-6">
            {estaCadastrando 
              ? 'Já tem uma conta? ' 
              : 'Não tem uma conta? '}
            <button 
              onClick={() => {
                setEstaCadastrando(!estaCadastrando);
                setErro('');
              }}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              {estaCadastrando ? 'Faça login' : 'Inscreva-se'}
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

export default Login;