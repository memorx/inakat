import React from 'react';

// Importamos la imagen del logo para el footer
import logoFooter from '../../assets/images/logo/logo-footer.png';

// Iconos de redes sociales
import { FaFacebook, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-title-dark text-white py-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                
                {/* Logo del Footer */}
                <div className="mb-4 md:mb-0">
                    <img src={logoFooter} alt="INAKAT Logo" className="w-32 mx-auto md:mx-0" />
                </div>

                {/* Enlaces de Navegación */}
                <div className="mb-4 md:mb-0">
                    <nav className="flex flex-col md:flex-row gap-4">
                        <a href="/" className="hover:text-button-green">Inicio</a>
                        <a href="/about" className="hover:text-button-green">Sobre Nosotros</a>
                        <a href="/companies" className="hover:text-button-green">Empresas</a>
                        <a href="/talents" className="hover:text-button-green">Talentos</a>
                        <a href="/contact" className="hover:text-button-green">Contacto</a>
                    </nav>
                </div>

                {/* Redes Sociales */}
                <div className="flex gap-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-button-green">
                        <FaFacebook className="text-2xl" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-button-green">
                        <FaLinkedin className="text-2xl" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-button-green">
                        <FaInstagram className="text-2xl" />
                    </a>
                    <a href="https://wa.me/5200000000" target="_blank" rel="noopener noreferrer" className="hover:text-button-green">
                        <FaWhatsapp className="text-2xl" />
                    </a>
                </div>
            </div>

            {/* Derechos Reservados */}
            <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
                <p>© {new Date().getFullYear()} INAKAT. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;