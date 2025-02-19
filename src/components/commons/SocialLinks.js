import React from 'react';
import { FaWhatsapp, FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";

const iconStyles = "w-16 h-16 bg-custom-beige rounded-full flex items-center justify-center hover:bg-gray-300";
const iconSize = "text-button-green text-3xl";

const SocialLinks = () => {
    return (
        <div className="flex justify-center gap-6">
            <a href="https://wa.me/5200000000" target="_blank" rel="noopener noreferrer" className={iconStyles}>
                <FaWhatsapp className={iconSize} />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className={iconStyles}>
                <FaLinkedin className={iconSize} />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className={iconStyles}>
                <FaInstagram className={iconSize} />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className={iconStyles}>
                <FaFacebook className={iconSize} />
            </a>
        </div>
    );
};

export default SocialLinks;