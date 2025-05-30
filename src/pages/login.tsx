import React, { useState } from 'react';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Cookies } from 'react-cookie';
import { authLogin, authRegister } from '../services/authService';

const cookies = new Cookies();

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [estaCadastrando, setEstaCadastrando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  const validarEmail = (email:string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validarSenha = (senha:string) => {
    return senha.length >= 8;
  };

  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault();
    setErro('');


    if (!email) {
      setErro('Por favor, informe seu email');
      return;
    }

    if (!validarEmail(email)) {
      setErro('Por favor, informe um email válido');
      return;
    }

    if (!senha) {
      setErro('Por favor, informe sua senha');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authLogin(email, senha);

      if (response.accessToken) {
        cookies.set('accessToken', response.accessToken, {
          path: '/',
          maxAge: 60 * 60 * 24,
          secure: false,
          sameSite: 'lax',
        });
        window.location.href = "/";
        
      } else {
        setErro(response.error || 'Credenciais inválidas. Verifique seu email e senha.');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setErro('Erro ao conectar ao servidor. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCadastro = async (e:React.FormEvent) => {
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
      const response = await authRegister(nome, email, senha);
      
      console.log(response)
      if (response.user) {
        setNome('');
        setEmail('');
        setSenha('');
        setConfirmarSenha('');
        setErro('');
        setEstaCadastrando(false);
        
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
    <div className={"flex min-h-screen overflow-hidden" + (estaCadastrando ? "" : " max-h-screen")}>
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

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
              <p>{erro}</p>
            </div>
          )}

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
              {estaCadastrando && (
                <p className="mt-1 text-xs text-gray-500">
                  A senha deve ter pelo menos 8 caracteres
                </p>
              )}
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
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-blue-500' : 'bg-blue-700'} text-white py-2 rounded-md hover:bg-blue-800 transition flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {estaCadastrando ? 'Cadastrando...' : 'Entrando...'}
                </>
              ) : (
                estaCadastrando ? 'Cadastrar' : 'Entrar'
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
              disabled={isLoading}
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