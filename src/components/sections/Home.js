import React from 'react';

import HeroHome from './home/HeroHomeSection';
import BusinessTalent from './home/BusinessTalentSection';
import Specialties from './home/SpecialtiesSection';
import WhyInakat from './home/WhyInakatSection';
import MapContact from './home/MapContactSection';
import Newsletter from './home/NewsletterSection';
import Footer from '../commons/Footer';



const Home = () => {
    return (
        <div>
            <HeroHome />
            <BusinessTalent />
            <Specialties />
            <WhyInakat />
            <MapContact />
            <Newsletter />
            <Footer />
        </div>
    );
};

export default Home;