import { Activity, MapPin, AlertCircle, Users, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

const features = [
  {
    icon: Activity,
    title: "AI Symptom Checker",
    description: "Advanced AI analyzes your symptoms and provides instant triage recommendations with confidence scores.",
    color: "text-primary"
  },
  {
    icon: MapPin,
    title: "Nearby Help",
    description: "Find hospitals, pharmacies, blood banks, and ambulances near you with real-time navigation.",
    color: "text-secondary"
  },
  {
    icon: AlertCircle,
    title: "SOS Emergency",
    description: "One-tap emergency button that captures your location and alerts your emergency contacts instantly.",
    color: "text-emergency"
  },
  {
    icon: Users,
    title: "Doctor Directory",
    description: "Browse verified doctors by specialty, read reviews, and book appointments directly through the platform.",
    color: "text-accent"
  },
  {
    icon: Calendar,
    title: "Appointments",
    description: "Schedule and manage appointments with doctors, receive confirmations, and access teleconsultations.",
    color: "text-success"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your health data is encrypted and secure. Full control over data retention and export capabilities.",
    color: "text-warning"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Health Management
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive healthcare tools powered by AI and designed for your safety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-medical transition-smooth border-2 hover:border-primary/20">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;