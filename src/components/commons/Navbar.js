import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo/logo.png'; // Asegúrate de tener tu logo aquí

const Navbar = () => {
    const location = useLocation(); // Detecta la URL actual

    // Función para determinar si estamos en la sección actual
    const getLinkClass = (path) => {
        return location.pathname === path 
            ? 'text-white bg-button-dark-green px-4 py-2 rounded'  // Si está activa, texto blanco y fondo verde oscuro
            : 'text-text-black'; // Si no está activa, texto negro
    };

    return (
        <nav className="fixed top-0 left-0 w-full bg-transparent backdrop-blur-md py-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="INAKAT" className="w-32" />
                </Link>

                {/* Menú */}
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className={`hover:text-button-dark-green ${getLinkClass('/')}`}>
                            INICIO
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className={`hover:text-button-dark-green ${getLinkClass('/about')}`}>
                            SOBRE NOSOTROS
                        </Link>
                    </li>
                    <li>
                        <Link to="/companies" className={`hover:text-button-dark-green ${getLinkClass('/companies')}`}>
                            EMPRESAS
                        </Link>
                    </li>
                    <li>
                        <Link to="/talents" className={`hover:text-button-dark-green ${getLinkClass('/talents')}`}>
                            TALENTOS
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className={`hover:text-button-dark-green ${getLinkClass('/contact')}`}>
                            CONTACTO
                        </Link>
                    </li>
                    {/* Botón de Log-in */}
                    <li>
                        <Link to="/login" className="bg-button-orange text-white px-4 py-2 rounded">
                            LOG-IN
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;