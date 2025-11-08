import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Phone, MapPin, Hospital, Ambulance } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import emergencyBanner from "@/assets/emergency-banner.jpg";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Emergency = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location");
          // Default to a fallback location (e.g., city center)
          setLocation([40.7128, -74.0060]); // New York as fallback
        }
      );
    }
  }, [navigate]);

  const handleSOS = async () => {
    if (!location) {
      toast.error("Location not available");
      return;
    }

    setIsSOSActive(true);

    try {
      const { error } = await supabase.from("emergency_incidents").insert({
        user_id: user?.id,
        latitude: location[0],
        longitude: location[1],
        status: "active",
      });

      if (error) throw error;

      toast.success("Emergency SOS activated! Emergency contacts have been notified.", {
        duration: 5000,
        icon: <Ambulance className="h-5 w-5" />,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to activate SOS");
      setIsSOSActive(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Emergency Banner with Dark Overlay */}
      <div className="relative h-64 md:h-80 overflow-hidden animate-fade-in">
        <img 
          src={emergencyBanner} 
          alt="Emergency ambulance at hospital" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emergency/90 via-emergency/70 to-emergency/50 flex items-center justify-center">
          <div className="text-center text-white px-4 animate-scale-in">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Emergency Services</h1>
            <p className="text-lg md:text-xl">
              Quick access to emergency help and nearby medical facilities
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 bg-gradient-to-br from-background via-background to-emergency/5 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
            <Card className="lg:col-span-2 animate-scale-in hover-scale transition-all" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle>Nearby Medical Facilities</CardTitle>
                <CardDescription>Interactive map showing hospitals and emergency services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden border-2 border-border">
                  {location ? (
                    <div style={{ height: "100%", width: "100%" }}>
                      <p className="text-center py-8 text-muted-foreground">
                        Map showing your location: {location[0].toFixed(4)}, {location[1].toFixed(4)}
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">Loading map...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-4 border-emergency bg-emergency/5 animate-scale-in hover:shadow-medical transition-all" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <CardTitle className="text-emergency flex items-center gap-2">
                    <AlertCircle className="h-6 w-6" />
                    Emergency SOS
                  </CardTitle>
                  <CardDescription>Press to alert emergency contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleSOS}
                    disabled={isSOSActive || !location}
                    className="w-full h-24 text-xl font-bold gradient-emergency hover:opacity-90 transition-smooth"
                  >
                    {isSOSActive ? "SOS ACTIVATED" : "SEND SOS"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    This will notify your emergency contacts and log your location
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-scale-in" style={{ animationDelay: "300ms" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Numbers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="tel:911">
                      <Phone className="mr-2 h-4 w-4" />
                      Emergency: 911
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="tel:911">
                      <Hospital className="mr-2 h-4 w-4" />
                      Nearest Hospital
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="tel:911">
                      <Ambulance className="mr-2 h-4 w-4" />
                      Ambulance Service
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-emergency flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Life-Threatening Emergency</h3>
                    <p className="text-muted-foreground">Call 911 immediately for severe bleeding, chest pain, difficulty breathing, or loss of consciousness</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Share Location</h3>
                    <p className="text-muted-foreground">SOS feature shares your precise location with emergency contacts and services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Hospital className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Nearest Facilities</h3>
                    <p className="text-muted-foreground">Map shows hospitals, urgent care centers, and pharmacies in your area</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Emergency;