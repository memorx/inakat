import React from 'react';
import Footer from '../commons/Footer';
import AboutUs from './aboutus/AboutUsSection';
import OurCompromise from './aboutus/OurCompromiseSection';
import Specialties from './aboutus/SpecialtiesSection';
import Experts from './aboutus/ExpertsSection';
import SelectionProcess from './aboutus/SelectionProcessSection';
import Location from './aboutus/LocationSection';
import ContactInfo from './aboutus/ContactInfoSection';

const About = () => {
    return (
        <>
            <div className="bg-custom-beige text-text-black">
                <AboutUs />
                <OurCompromise />
                <Specialties />
                <Experts />
                <SelectionProcess />
                <Location />
                <ContactInfo />
            </div>
            <Footer />
        </>
    );
};

export default About;