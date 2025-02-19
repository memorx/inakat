import React, { useState } from 'react';

import logoImage from '../../../assets/images/2-about/2.png';
import aboutBackground from '../../../assets/images/2-about/3.png';


const OurCompromises = () => {
    const [selected, setSelected] = useState(null);

    return (
        <section 
            className="bg-cover bg-center flex items-center justify-center py-10 relative"
            style={{ backgroundImage: `url(${aboutBackground})` }} >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[80%]">
                {/* Imagen decorativa izquierda (rotada -90°) */}
                <img 
                    src={logoImage} 
                    alt="Decoración izquierda" 
                    className="absolute left-[-5em] top-1/2 transform -translate-y-1/2 -rotate-90 w-1/6"
                />
                {/* Primera columna: Compromiso (alineado a la derecha) */}
                <div className="bg-primary-light-green p-8 rounded-lg shadow-lg flex items-center justify-end max-w-md ml-auto flex-1 h-full">
                    <p className="text-white text-left">
                        Nuestro compromiso con la excelencia en el
                        reclutamiento se refleja en nuestro enfoque
                        centrado en comprender la cultura y
                        objetivos de su empresa. Nuestro equipo de
                        expertos se esfuerza por identificar a los
                        profesionales idóneos que contribuirán
                        directamente al crecimiento de su empresa.
                    </p>
                </div>

                {/* Segunda columna: Con Transparencia */}
                <div className="bg-custom-beige p-8 rounded-lg shadow-lg flex items-center justify-start max-w-md flex-1 h-full">
                    <p className="text-black text-left">
                        Con transparencia, ética y respeto como
                        pilares fundamentales, construimos
                        relaciones sólidas basadas en la confianza
                        mutua. Si su empresa busca especialistas de
                        primer nivel, Inakat ofrece la dirección y el
                        apoyo necesarios para su éxito.
                    </p>
                </div>

                {/* Imagen decorativa derecha (rotada +90°) */}
                <img 
                    src={logoImage} 
                    alt="Decoración derecha" 
                    className="absolute right-[-5em] top-1/2 transform -translate-y-1/2 rotate-90 w-1/6"
                />
            </div>
        </section>
    );
};

export default OurCompromises;