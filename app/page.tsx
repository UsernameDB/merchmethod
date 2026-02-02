import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <HowItWorks />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <ContactForm />
      <Footer />
    </>
  );
}
