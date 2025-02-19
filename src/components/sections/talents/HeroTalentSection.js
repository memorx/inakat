import React, { useState } from 'react';

// Imagenes
import talentsImage from '../../../assets/images/4-talent/1.png';

// Iconos
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaBookmark, FaEllipsisV } from "react-icons/fa";
const jobListings = [
    {
        id: 1,
        title: "Asistente Administrativo",
        company: "Walmart",
        location: "Monterrey, Nuevo León",
        salary: "$25,000 - $35,000 / mes",
        type: "Tiempo Completo",
        remote: true,
        rating: 4.3,
        description: "Estamos buscando un individuo altamente organizado y proactivo para unirse a nuestro equipo como Asistente Administrativo. En este rol, serás responsable de proporcionar apoyo administrativo crucial para garantizar el funcionamiento eficiente de nuestras operaciones diarias."+
                        "Buscamos a alguien con excelentes habilidades de comunicación, capacidad para manejar múltiples tareas y una fuerte atención al detalle."+
                        "Si te apasiona trabajar en un entorno dinámico y colaborativo, ¡esperamos conocerte pronto!"
        },
    {
        id: 2,
        title: "Analista de Recursos Humanos",
        company: "Amazon",
        location: "CDMX",
        salary: "$30,000 - $40,000 / mes",
        type: "Medio Tiempo",
        remote: false,
        rating: 4.7,
        description: "Buscamos a alguien con excelentes habilidades de comunicación y capacidad para manejar múltiples tareas...",
    },
];

const HeroTalent = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar vacantes por búsqueda
    const filteredJobs = jobListings.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Sección 1: Encabezado */}
            <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 relative">
                {/* Columna Izquierda: Texto */}
                <div className="md:w-1/3 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-4">¿BUSCAS EMPLEO?</h2>
                    <p className="text-lg mb-6">Regístrate, crea tu perfil, sube tu currículum y en seguida nos contactaremos contigo.</p>
                    <button className="bg-button-green text-white py-2 px-6 rounded-full hover:bg-green-700">
                        REGÍSTRATE →
                    </button>
                </div>

                {/* Columna Derecha: Imagen */}
                <div className="md:w-2/3 flex items-center relative">
                    <img 
                        src={talentsImage} 
                        alt="Talentos" 
                        className="w-full max-h-[300px] rounded-2xl shadow-lg object-cover bg-black opacity-900"
                    />
                    
                    {/* Imagen Rotada 90° en la Esquina Inferior Derecha */}
                    <div className="absolute bottom-[-165px] right-[70px] transform -rotate-90">
                        <img src={require('../../../assets/images/logo/ico.png')} alt="Decoración" className="w-40 h-60" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default HeroTalent;