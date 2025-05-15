import React, { useState } from 'react';

import aboutImage from '../../../assets/images/2-about/1.png';

const AboutUs = () => {
    const [selected, setSelected] = useState(null);

    return (
        <section className="py-20">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="relative md:col-span-2">
                    <img 
                        src={aboutImage} 
                        alt="Equipo INAKAT" 
                        className="shadow-lg w-full" style={{ borderRadius: "30px" }}
                    />
                    <div className="absolute inset-0 bg-soft-green opacity-60 rounded-lg" style={{ borderRadius: "30px" }}></div>
                </div>
                <div className="md:col-span-1">
                    <h2 className="text-4xl font-bold mb-6 text-title-dark">¿QUIÉNES <br />SOMOS?</h2>
                    <p className="text-lg">
                        En Inakat, somos más que una empresa
                        de reclutamiento. Somos un puente
                        entre el talento individual y las
                        empresas que aspiran a alcanzar
                        nuevas alturas de éxito. Inspirados por
                        la comunidad wayuu, valoramos y
                        respetamos las habilidades únicas de
                        cada persona.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;