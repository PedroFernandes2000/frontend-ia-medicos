const backend_url = import.meta.env.VITE_BACKEND_URL;

export async function authLogin(email: string, password: string) {
    try {
        const response = await fetch(`${backend_url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }
        return data;
    } catch (error) {
        return error;
    }
}

export async function authRegister(name:string,email: string, password: string) {
    try {
        const response = await fetch(`${backend_url}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name,email, password }),
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }
        return data;
    } catch (error) {
        return error;
    }
}
