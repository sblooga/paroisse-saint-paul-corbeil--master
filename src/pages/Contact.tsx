import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    newsletter: false,
    rgpd: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.rgpd) {
      toast({
        title: "Consentement requis",
        description: "Veuillez accepter la politique de confidentialité.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false,
      rgpd: false,
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-primary py-20 px-4">
          <div className="container-parish text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-primary-foreground mb-4">Contactez-nous</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                Une question, une demande ? N'hésitez pas à nous contacter. 
                Nous sommes à votre écoute.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding">
          <div className="container-parish">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Map & Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Google Maps */}
                <div className="rounded-xl overflow-hidden shadow-lg mb-8 aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.2922926!3d48.8583701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1702123456789!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation de la paroisse"
                  />
                </div>

                {/* Contact Info Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="card-parish p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <MapPin className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Adresse</h4>
                        <p className="text-muted-foreground text-sm">
                          12 Rue de l'Église<br />
                          75000 Paris, France
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-parish p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        <Phone className="text-secondary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Téléphone</h4>
                        <a 
                          href="tel:+33123456789" 
                          className="text-muted-foreground text-sm hover:text-primary transition-colors"
                        >
                          +33 1 23 45 67 89
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="card-parish p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Mail className="text-accent" size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Email</h4>
                        <a 
                          href="mailto:contact@paroisse-stpaul.fr" 
                          className="text-muted-foreground text-sm hover:text-primary transition-colors"
                        >
                          contact@paroisse-stpaul.fr
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="card-parish p-5">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Clock className="text-primary" size={24} />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-1">Horaires</h4>
                        <p className="text-muted-foreground text-sm">
                          Lun-Ven: 9h-12h / 14h-17h<br />
                          Sam: 9h-12h
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="card-parish p-8">
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Jean Dupont"
                          required
                          className="bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="jean@exemple.fr"
                          required
                          className="bg-background"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Demande de renseignements"
                        required
                        className="bg-background"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Votre message..."
                        rows={5}
                        required
                        className="bg-background resize-none"
                      />
                    </div>

                    {/* Newsletter Opt-in */}
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, newsletter: checked as boolean }))
                        }
                      />
                      <div className="space-y-1">
                        <Label htmlFor="newsletter" className="cursor-pointer font-medium">
                          S'inscrire à la newsletter
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Recevez les actualités de la paroisse par email (1-2 fois par mois)
                        </p>
                      </div>
                    </div>

                    {/* RGPD Consent */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="rgpd"
                        checked={formData.rgpd}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, rgpd: checked as boolean }))
                        }
                        required
                      />
                      <Label htmlFor="rgpd" className="text-sm text-muted-foreground cursor-pointer">
                        J'accepte que mes données soient utilisées pour traiter ma demande 
                        conformément à la{' '}
                        <a href="#" className="text-primary hover:underline">
                          politique de confidentialité
                        </a>
                        . *
                      </Label>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-parish"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={16} className="text-secondary" />
                  <span>Réponse sous 48h ouvrées</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default Contact;
