import { motion } from 'framer-motion';
import { Database, Scale, BarChart3, Bell, Send, Gauge, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Gestion des dossiers',
    desc: "CRUD complet des créances avec 6 statuts normalisés : à relancer, en relance, promesse de paiement, partiellement payé, payé, transfert en contentieux. Affectation aux agents et historique des interactions.",
  },
  {
    icon: Send,
    title: 'Moteur de relance multicanal',
    desc: "Scénarios paramétrables (Standard, Intensif, Amiable) avec déclencheurs sur délais relatifs (J-5, J+1…) et conditions sur le score client. Canaux SMS, email, WhatsApp et appel.",
  },
  {
    icon: Gauge,
    title: 'Scoring de risque (0-100)',
    desc: "Score pondéré sur 5 critères — montant, historique, ancienneté, réactivité, profil — qui classe chaque client en Fiable, À surveiller ou À risque pour prioriser vos actions.",
  },
  {
    icon: Scale,
    title: 'Suivi judiciaire',
    desc: "Agenda contentieux dédié pour suivre les dossiers transférés : échéances de procédure, intervenants et avancement consolidés.",
  },
  {
    icon: Bell,
    title: 'Veille réglementaire BCT & CTAF',
    desc: "Module de veille des circulaires Banque Centrale de Tunisie et CTAF, intégré dans la plateforme pour alimenter votre conformité.",
  },
  {
    icon: BarChart3,
    title: 'Reporting & analytics',
    desc: "Tableau de bord opérationnel et page Analytics avec indicateurs de performance, vues consolidées et exports prêts pour le régulateur.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="container-atr">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-20">
          <div className="lg:col-span-5">
            <span className="eyebrow mb-5 block">Modules de la plateforme</span>
            <h2 className="h-display">
              Six modules pensés pour le recouvrement bancaire en Tunisie
            </h2>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <p className="text-slate text-[17px] leading-[1.7] font-light mb-6">
              RecovTN couvre le cycle complet de la créance classifiée — de la
              première relance à la clôture du contentieux. Chaque module est
              opérationnel et conçu pour s'intégrer au workflow réel de vos
              équipes recouvrement.
            </p>
            <a href="#pricing" className="inline-flex items-center gap-2 text-crimson text-[13px] font-semibold uppercase tracking-wider">
              Voir les offres <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-sm overflow-hidden">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="group bg-white p-10 hover:bg-paper-soft transition-colors duration-300 cursor-pointer"
              >
                <Icon className="text-crimson mb-6" size={32} strokeWidth={1.4} />
                <h3 className="font-serif-display text-[22px] text-charcoal mb-3 group-hover:text-crimson transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate text-[15px] leading-relaxed font-light">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
