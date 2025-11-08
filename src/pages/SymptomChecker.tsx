import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Send, Bot, User, Activity, AlertCircle, RefreshCw, Stethoscope, Pill, Ambulance, Sparkles } from "lucide-react";
import symptomBanner from "@/assets/symptom-checker-banner.jpg";

type Message = {
  role: "user" | "assistant";
  content: string;
  triageLevel?: "green" | "yellow" | "red";
};

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-symptoms", {
        body: { symptoms: input, userId: user?.id },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes("402")) {
          toast.error("AI service requires credits. Please contact support.");
        } else {
          toast.error("Failed to analyze symptoms. Please try again.");
        }
        throw error;
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.analysis,
        triageLevel: data.triageLevel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      toast.success("Analysis complete! Review the recommendations below.", {
        icon: <Sparkles className="h-4 w-4" />,
      });
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error analyzing your symptoms. Please try again or contact emergency services if this is urgent.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTriageColor = (level?: string) => {
    switch (level) {
      case "red": return "border-emergency bg-emergency/10";
      case "yellow": return "border-warning bg-warning/10";
      case "green": return "border-success bg-success/10";
      default: return "";
    }
  };

  const getTriageBadge = (level?: string) => {
    switch (level) {
      case "red":
        return (
          <Badge className="bg-emergency text-white flex items-center gap-1">
            <Ambulance className="h-3 w-3" />
            High Risk - Seek Immediate Care
          </Badge>
        );
      case "yellow":
        return (
          <Badge className="bg-warning text-white flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            Moderate - See Doctor Soon
          </Badge>
        );
      case "green":
        return (
          <Badge className="bg-success text-white flex items-center gap-1">
            <Pill className="h-3 w-3" />
            Low Risk - Monitor at Home
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleNewCheck = () => {
    setMessages([]);
    setInput("");
    toast.info("Starting a new symptom check", {
      description: "Previous conversation cleared",
    });
  };

  // Format markdown-like text for better readability
  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="mb-2">
            {parts.map((part, j) => 
              j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
            )}
          </p>
        );
      }
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return <li key={i} className="ml-4 mb-1">{line.replace(/^[•-]\s*/, '')}</li>;
      }
      // Numbered lists
      if (/^\d+\./.test(line.trim())) {
        return <li key={i} className="ml-4 mb-1">{line.replace(/^\d+\.\s*/, '')}</li>;
      }
      // Headers (lines ending with :)
      if (line.trim().endsWith(':') && line.trim().length > 5) {
        return <h3 key={i} className="font-semibold mt-3 mb-1 text-foreground">{line}</h3>;
      }
      // Regular paragraphs
      if (line.trim()) {
        return <p key={i} className="mb-2">{line}</p>;
      }
      return <br key={i} />;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Banner Section */}
      <div className="relative h-48 md:h-64 overflow-hidden animate-fade-in">
        <img 
          src={symptomBanner} 
          alt="Doctor consulting patient with AI technology" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 flex items-center justify-center">
          <div className="text-center text-primary-foreground px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 animate-scale-in">AI Symptom Checker</h1>
            <p className="text-lg md:text-xl animate-fade-in" style={{ animationDelay: "200ms" }}>
              Get instant health guidance powered by AI
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 animate-fade-in bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-4 animate-scale-in">
              <Stethoscope className="h-10 w-10 text-primary animate-pulse" />
              <Activity className="h-12 w-12 text-primary" />
              <Pill className="h-10 w-10 text-primary animate-pulse" style={{ animationDelay: "1s" }} />
            </div>
            <p className="text-muted-foreground mb-4 text-sm md:text-base">
              Describe your symptoms and get instant AI-powered health guidance
            </p>
            <div className="flex justify-center gap-3 mb-4">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNewCheck}
                  className="flex items-center gap-2 hover-scale transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Check
                </Button>
              )}
            </div>
            <div className="mt-4 p-4 bg-warning/10 border-2 border-warning/30 rounded-lg inline-flex items-start gap-2 max-w-2xl animate-fade-in shadow-lg">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5 animate-pulse" />
              <div className="text-xs md:text-sm text-left">
                <strong className="block mb-1 text-warning">⚠️ Important Medical Disclaimer</strong>
                <p className="text-muted-foreground leading-relaxed">This AI tool provides general health information only and is <strong>not a substitute for professional medical advice, diagnosis, or treatment</strong>. Always consult with a qualified healthcare provider for medical concerns. In case of emergency, call emergency services immediately.</p>
              </div>
            </div>
          </div>

          <Card className="shadow-medical animate-scale-in backdrop-blur-sm bg-card/95">
            <CardContent className="p-0">
              <div className="h-[500px] md:h-[600px] overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-20 animate-fade-in">
                    <Bot className="h-16 w-16 mx-auto mb-4 text-primary/50 animate-pulse" />
                    <p className="text-base md:text-lg font-medium">Start by describing your symptoms...</p>
                    <p className="text-xs md:text-sm mt-2 text-muted-foreground/80">I'll provide guidance and recommend appropriate care</p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 md:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 shadow-lg hover-scale">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[80%] rounded-lg p-3 md:p-4 transition-all duration-300 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground shadow-lg hover-scale"
                          : `bg-card border-2 ${getTriageColor(message.triageLevel)} shadow-md hover:shadow-lg transition-shadow`
                      }`}
                    >
                      {message.role === "assistant" && message.triageLevel && (
                        <div className="mb-3 animate-scale-in">
                          {getTriageBadge(message.triageLevel)}
                        </div>
                      )}
                      <div className="text-sm md:text-base leading-relaxed">
                        {message.role === "assistant" ? formatContent(message.content) : <p>{message.content}</p>}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-md hover-scale">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2 md:gap-3 justify-start animate-fade-in">
                    <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0 animate-pulse shadow-lg">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-card border-2 border-primary/20 rounded-lg p-3 md:p-4 shadow-md animate-scale-in">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">Analyzing your symptoms...</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-sm" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-sm" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce shadow-sm" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-3 md:p-4 border-t border-border bg-background/50 backdrop-blur-sm">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your symptoms in detail (e.g., fever, headache, duration)..."
                    className="min-h-[60px] md:min-h-[80px] resize-none text-sm md:text-base transition-all focus:ring-2 focus:ring-primary/50"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="gradient-hero self-end hover-scale shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Press Enter to send • Shift + Enter for new line
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SymptomChecker;