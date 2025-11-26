// RUTA: src/components/sections/talents/HeroTalentSection.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import talentsImage from '@/assets/images/4-talent/1.png';
import icoImage from '@/assets/images/logo/ico.png';

const HeroTalentSection = () => {
  return (
    <section className="bg-custom-beige py-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 relative">
        {/* Columna Izquierda: Texto */}
        <div className="md:w-1/3 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">¿BUSCAS EMPLEO?</h2>
          <p className="text-lg mb-6">
            Regístrate, crea tu perfil, sube tu currículum y en seguida nos
            contactaremos contigo.
          </p>

          {/* 🔥 BOTÓN ACTUALIZADO CON LINK */}
          <Link href="/register">
            <button className="bg-button-green text-white py-2 px-6 rounded-full hover:bg-green-700 transition-colors">
              REGÍSTRATE →
            </button>
          </Link>
        </div>

        {/* Columna Derecha: Imagen */}
        <div className="md:w-2/3 flex items-center relative">
          <Image
            src={talentsImage}
            alt="Talentos"
            className="w-full max-h-[300px] rounded-2xl shadow-lg object-cover"
          />

          {/* Imagen Rotada 90° en la Esquina Inferior Derecha */}
          <div className="absolute bottom-[-165px] right-[70px] transform -rotate-90">
            <Image src={icoImage} alt="Decoración" className="w-40 h-60" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTalentSection;
