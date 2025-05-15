import React from 'react';

const advantages = [
    { icon: '🎯', title: 'Reclutamiento Estratégico' },
    { icon: '💼', title: 'Gestión de Talento' },
    { icon: '📊', title: 'Análisis de Mercado' },
    { icon: '🤝', title: 'Soporte Continuo' },
    { icon: '⚡', title: 'Proceso Ágil' },
    { icon: '✨', title: 'Calidad Garantizada' }
];

const Advantages = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-title-dark mb-6">
                        DESCUBRE LOS <br />
                        BENEFICIOS DE INAKAT
                    </h2>
                    <p className="text-lg max-w-2xl mx-auto">
                        Potencia tu empresa con nuestras soluciones integrales de reclutamiento. 
                        Descubre cómo podemos ayudarte a encontrar el talento perfecto para tu equipo.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {advantages.map((advantage, index) => (
                        <div key={index} className="bg-soft-green p-6 rounded-xl text-center">
                            <div className="text-4xl mb-3">{advantage.icon}</div>
                            <h3 className="text-white font-semibold">{advantage.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Advantages;