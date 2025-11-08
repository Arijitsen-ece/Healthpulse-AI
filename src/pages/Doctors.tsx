import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, Hospital, CheckCircle, Calendar } from "lucide-react";
import doctorsBanner from "@/assets/doctors-banner.jpg";

type Doctor = {
  id: string;
  full_name: string;
  specialization: string;
  hospital_affiliation: string;
  years_experience: number;
  verified: boolean;
  bio: string;
  rating: number;
  available: boolean;
};

const Doctors = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctor_directory")
        .select("*")
        .eq("verified", true)
        .order("rating", { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      console.error("Error loading doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Banner with Light Blue Gradient Background */}
      <div className="relative h-64 md:h-80 overflow-hidden animate-fade-in">
        <img 
          src={doctorsBanner} 
          alt="Team of professional doctors in hospital" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/75 to-secondary/50 flex items-center">
          <div className="container mx-auto px-4 animate-scale-in">
            <Users className="h-12 w-12 text-secondary-foreground mb-4 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-secondary-foreground">Find Verified Doctors</h1>
            <p className="text-lg md:text-xl text-secondary-foreground/90 max-w-2xl">
              Browse our directory of certified healthcare professionals and book appointments
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 bg-gradient-to-br from-background via-background to-secondary/5 animate-fade-in">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No verified doctors available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-medical transition-smooth border-2 hover:border-primary/20 animate-scale-in hover-scale" style={{ animationDelay: `${doctors.indexOf(doctor) * 100}ms` }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                  <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {doctor.full_name}
                        {doctor.verified && (
                          <CheckCircle className="h-5 w-5 text-success" />
                        )}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-primary mt-1">
                        {doctor.specialization}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-warning fill-warning" />
                      <span className="font-semibold">{doctor.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hospital className="h-4 w-4" />
                    <span>{doctor.hospital_affiliation || "Private Practice"}</span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {doctor.bio || "Experienced healthcare professional dedicated to patient care."}
                  </p>

                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {doctor.years_experience}+ years exp.
                    </Badge>
                    <Badge variant="outline">Verified</Badge>
                  </div>

                  <Button 
                    className="w-full gradient-hero" 
                    disabled={!doctor.available}
                    onClick={() => {
                      if (!user) {
                        navigate("/auth");
                      } else {
                        // Future: Navigate to booking page
                        navigate("/profile");
                      }
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {doctor.available ? "Book Appointment" : "Currently Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;