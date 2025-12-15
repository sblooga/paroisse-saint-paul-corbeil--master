import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const isFrench = i18n.language === 'fr';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-8">
            {isFrench ? 'Politique de Confidentialité' : 'Polityka Prywatności'}
          </h1>

          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Collecte des données' : 'Zbieranie danych'}
              </h2>
              <p>
                {isFrench 
                  ? 'Nous collectons les données personnelles que vous nous fournissez volontairement via notre formulaire de contact ou lors de votre inscription à notre newsletter.'
                  : 'Zbieramy dane osobowe, które dobrowolnie nam przekazujesz poprzez nasz formularz kontaktowy lub podczas zapisywania się do naszego newslettera.'}
              </p>
              <p>
                {isFrench 
                  ? 'Les données collectées peuvent inclure : nom, prénom, adresse email, numéro de téléphone, et le contenu de vos messages.'
                  : 'Zbierane dane mogą obejmować: imię, nazwisko, adres email, numer telefonu oraz treść Twoich wiadomości.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Utilisation des données' : 'Wykorzystanie danych'}
              </h2>
              <p>
                {isFrench 
                  ? 'Vos données personnelles sont utilisées pour :'
                  : 'Twoje dane osobowe są wykorzystywane do:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isFrench ? 'Répondre à vos demandes de contact' : 'Odpowiadania na Twoje zapytania kontaktowe'}</li>
                <li>{isFrench ? 'Vous envoyer notre newsletter (si vous y êtes inscrit)' : 'Wysyłania Ci naszego newslettera (jeśli jesteś zapisany)'}</li>
                <li>{isFrench ? 'Améliorer nos services' : 'Ulepszania naszych usług'}</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Conservation des données' : 'Przechowywanie danych'}
              </h2>
              <p>
                {isFrench 
                  ? 'Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément à la législation en vigueur.'
                  : 'Twoje dane są przechowywane przez czas niezbędny do realizacji celów, dla których zostały zebrane, zgodnie z obowiązującymi przepisami.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Vos droits' : 'Twoje prawa'}
              </h2>
              <p>
                {isFrench 
                  ? 'Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :'
                  : 'Zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych (RODO), przysługują Ci następujące prawa:'}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>{isFrench ? 'Droit d\'accès à vos données' : 'Prawo dostępu do swoich danych'}</li>
                <li>{isFrench ? 'Droit de rectification' : 'Prawo do sprostowania'}</li>
                <li>{isFrench ? 'Droit à l\'effacement' : 'Prawo do usunięcia'}</li>
                <li>{isFrench ? 'Droit à la portabilité des données' : 'Prawo do przenoszenia danych'}</li>
                <li>{isFrench ? 'Droit d\'opposition' : 'Prawo do sprzeciwu'}</li>
              </ul>
              <p className="mt-4">
                {isFrench 
                  ? 'Pour exercer ces droits, contactez-nous via notre formulaire de contact ou par email.'
                  : 'Aby skorzystać z tych praw, skontaktuj się z nami poprzez formularz kontaktowy lub email.'}
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-2xl font-semibold text-foreground mb-4">
                {isFrench ? 'Sécurité' : 'Bezpieczeństwo'}
              </h2>
              <p>
                {isFrench 
                  ? 'Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés.'
                  : 'Wdrażamy odpowiednie środki bezpieczeństwa w celu ochrony Twoich danych osobowych przed nieuprawnionym dostępem, modyfikacją, ujawnieniem lub zniszczeniem.'}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default PrivacyPolicy;
