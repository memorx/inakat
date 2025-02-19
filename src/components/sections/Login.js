import React from 'react';

import loginImage from '../../assets/images/6-login/1.png'; 
import logoIcon from '../../assets/images/6-login/logo-dark-green.png'; 

// Importar iconos de redes sociales
import { FaFacebook, FaLinkedin, FaGoogle } from "react-icons/fa";

const Login = () => {
    return (
        <section className="bg-custom-beige min-h-screen flex items-center justify-center">
            <div className="w-full max-w-4xl flex bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Columna Izquierda: Imagen y Texto */}
                <div className="relative w-1/2 hidden md:flex flex-col justify-center items-center p-8 bg-cover bg-center"
                    style={{ backgroundImage: `url(${loginImage})` }}>
                    
                    {/* Capa de Oscurecimiento */}
                    <div className="absolute inset-0 bg-black opacity-60"></div>

                    <h2 className="relative text-white text-2xl font-bold text-center z-10">
                        CONECTAMOS TALENTOS CON ESPECIALISTAS
                    </h2>
                </div>
                {/* Columna Derecha: Formulario */}
                <div className="w-full md:w-1/2 bg-soft-green p-10 flex flex-col justify-center items-center">
                    <div className="w-24 h-24 bg-lemon-green rounded-full flex items-center justify-center mb-4">
                        <img src={logoIcon} alt="Logo" className="w-10 h-14" />
                    </div>
                    <h2 className="text-white text-xl font-bold mb-6">INICIA SESIÓN</h2>

                    {/* Formulario */}
                    <form className="w-full max-w-xs space-y-4">
                        <input type="email" placeholder="E-mail"
                            className="w-full p-3 bg-white text-black border border-gray-300 rounded-full input-field" required />
                        <input type="password" placeholder="Contraseña"
                            className="w-full p-3 bg-white text-black border border-gray-300 rounded-full input-field" required />

                        {/* Olvidaste contraseña */}
                        <p className="text-white text-sm text-center cursor-pointer hover:underline">
                            ¿Olvidaste tu contraseña?
                        </p>

                        {/* Botón Ingresar */}
                        <button type="submit"
                            className="w-full bg-button-green text-white font-bold py-3 rounded-full hover:bg-green-700">
                            INGRESAR →
                        </button>
                    </form>
                    <div className="w-full max-w-xs space-y-4">
                        {/* Divider */}
                        <div className="flex items-center justify-center mt-4">
                            <hr className="w-1/4 border-white" />
                            <span className="text-white px-2 text-sm">Inicia sesión con</span>
                            <hr className="w-1/4 border-white" />
                        </div>

                        {/* Redes Sociales */}
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="w-12 h-12 bg-custom-beige rounded-full flex items-center justify-center">
                                <FaFacebook className="text-button-green text-2xl" />
                            </div>
                            <div className="w-12 h-12 bg-custom-beige rounded-full flex items-center justify-center">
                                <FaLinkedin className="text-button-green text-2xl" />
                            </div>
                        </div>

                        {/* Registrarse */}
                        <div className="text-center mt-4 w-full">
                            <p className="text-white text-sm">¿No tienes una cuenta?</p>
                            <a href="/register" className="w-full flex justify-center">
                                <button
                                    className="w-full bg-button-orange text-white font-bold py-3 rounded-full mt-2 hover:bg-orange-700"
                                >
                                    REGÍSTRATE →
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;