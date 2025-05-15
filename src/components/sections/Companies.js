import Footer from '../commons/Footer';
import AreYouLookingNewTalent from './companies/AreYouLookingNewTalentSection';
import RegisterForQuotation from './companies/RegisterForQuotationSection';
import Advantages from './companies/AdvantagesSection';
import SatisfiedCustomers from './companies/SatisfiedCustomersSection';
import FindProfessionals from './companies/FindProfessionalsSection';
import FormRegisterForQuotation from './companies/FormRegisterForQuotationSection';


const Companies = () => {
    return (
        <>
        <div className="bg-custom-beige text-text-black">
            <AreYouLookingNewTalent />
            <RegisterForQuotation />
            <Advantages />
            <SatisfiedCustomers />
            <FindProfessionals />
            <FormRegisterForQuotation />
        </div>
        
        <Footer />
        </>
    );
};

export default Companies;