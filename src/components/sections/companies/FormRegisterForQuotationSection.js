import React from 'react';

const FormRegisterForQuotation = () => {
    return (
        <section className="py-16">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-title-dark text-center mb-12">
                    ÚNETE HOY Y DESCUBRE CÓMO PODEMOS <br />
                    TRANSFORMAR TU EQUIPO
                </h2>
                
                <div className="max-w-4xl mx-auto bg-lemon-green p-8 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">DATOS DEL USUARIO</h3>
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Apellido Paterno" 
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Apellido Materno" 
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                                <button className="bg-button-green text-white py-3 px-6 rounded-full hover:bg-green-700">
                                    CARGAR DOCUMENTO →
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-bold text-lg mb-4">DATOS DE LA EMPRESA</h3>
                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Nombre de la Empresa" 
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                                <input 
                                    type="email" 
                                    placeholder="Correo Electrónico" 
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Teléfono" 
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                                <button className="bg-button-green text-white py-3 px-6 rounded-full hover:bg-green-700">
                                    ENVIAR SOLICITUD →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FormRegisterForQuotation;