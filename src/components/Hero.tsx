import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Activity, AlertCircle, ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-medical-team.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Professional medical team" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Health Assistant</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Health,
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Our Priority
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Get instant AI-powered symptom analysis, find nearby medical help, and access emergency services with just one tap. Your health companion, available 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="gradient-hero hover:opacity-90 transition-smooth shadow-medical"
              onClick={() => navigate("/symptom-checker")}
            >
              <Activity className="mr-2 h-5 w-5" />
              Check Symptoms
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 hover:bg-emergency hover:text-emergency-foreground hover:border-emergency transition-smooth"
              onClick={() => navigate("/emergency")}
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              Send SOS
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-sm">
            <div>
              <div className="text-2xl font-bold text-primary">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold text-primary">10k+</div>
              <div className="text-muted-foreground">Users Helped</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Verified Doctors</div>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="mt-16 flex flex-col items-center animate-bounce">
            <span className="text-sm text-muted-foreground mb-2">Explore More</span>
            <ChevronDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;