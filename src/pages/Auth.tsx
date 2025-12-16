import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            setError(t('auth.errors.alreadyRegistered', 'Cet email est déjà enregistré.'));
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: t('auth.signUpSuccess', 'Inscription réussie'),
            description: t('auth.signUpSuccessDesc', 'Votre compte a été créé. Un administrateur vous attribuera un rôle.'),
          });
          setIsSignUp(false);
          setPassword('');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError(t('auth.errors.invalidCredentials', 'Email ou mot de passe incorrect.'));
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: t('auth.loginSuccess', 'Connexion réussie'),
            description: t('auth.loginSuccessDesc', 'Bienvenue dans l\'espace administrateur.'),
          });
          navigate('/admin');
        }
      }
    } catch (err) {
      setError(t('auth.errors.generic', 'Une erreur est survenue. Veuillez réessayer.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-parish p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✝️</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {t('auth.adminSpace', 'Espace Administrateur')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? t('auth.signUpSubtitle', 'Créez votre compte pour accéder au tableau de bord')
                : t('auth.loginSubtitle', 'Connectez-vous pour accéder au tableau de bord')
              }
            </p>
          </div>

          {isSignUp && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3 text-foreground">
              <Info size={20} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                {t('auth.roleInfo', 'Après votre inscription, un administrateur vous attribuera les droits d\'accès nécessaires.')}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@paroisse.fr"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password', 'Mot de passe')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  minLength={6}
                  required
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  {t('auth.passwordHint', 'Minimum 6 caractères')}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full btn-parish"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-spin">⏳</span>
              ) : isSignUp ? (
                <>
                  <UserPlus size={18} />
                  {t('auth.signUp', 'S\'inscrire')}
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  {t('auth.login', 'Se connecter')}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? t('auth.alreadyAccount', 'Déjà un compte ? Se connecter')
                : t('auth.noAccount', 'Pas de compte ? S\'inscrire')
              }
            </button>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            ← {t('auth.backToSite', 'Retour au site')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
