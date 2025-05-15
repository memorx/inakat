import React from 'react';

const testimonials = [
    {
        name: 'Ana García',
        role: 'Gerente de RH',
        comment: 'El proceso de reclutamiento fue muy eficiente y profesional. Encontramos excelentes candidatos que se ajustaron perfectamente a nuestras necesidades.',
        image: '/testimonials/ana.jpg'
    },
    {
        name: 'Carlos Martínez',
        role: 'Director de Operaciones',
        comment: 'La plataforma es muy intuitiva y el equipo de soporte siempre está disponible. Los resultados superaron nuestras expectativas.',
        image: '/testimonials/carlos.jpg'
    },
    {
        name: 'Laura Pérez',
        role: 'CEO',
        comment: 'Gracias a INAKAT pudimos escalar nuestro equipo rápidamente sin comprometer la calidad. Su servicio es excepcional.',
        image: '/testimonials/laura.jpg'
    }
];

const SatisfiedCustomers = () => {
    return (
        <section className="py-16 bg-soft-green">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-12">
                    CLIENTES SATISFECHOS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center mb-4">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="font-bold text-title-dark">{testimonial.name}</h3>
                                    <p className="text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-700">{testimonial.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SatisfiedCustomers;