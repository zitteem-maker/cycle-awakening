// Cloudflare Pages Function : POST /api/newsletter
// Inscription à la newsletter via Brevo en DOUBLE OPT-IN : Brevo envoie un email de confirmation,
// le contact n'est ajouté à la liste qu'après le clic. Aucune clé n'est exposée au navigateur.
//
// Variables (Cloudflare Pages > Settings > Variables and Secrets) :
//   BREVO_API_KEY          (Secret) clé API Brevo
//   BREVO_LIST_ID          identifiant numérique de la liste « Newsletter »
//   BREVO_DOI_TEMPLATE_ID  identifiant du modèle d'email de confirmation (type « double opt-in »)
//   BREVO_DOI_TEMPLATE_ID_EN  (optionnel) modèle de confirmation en anglais ; à défaut, le modèle français
//   PUBLIC_SITE_URL        URL du site (redirection après confirmation)
//
// Segmentation : l'attribut Brevo SOURCE reçoit l'emplacement du formulaire (home, blog, quiz…),
// l'attribut LANGUE la langue de la page (fr | en) pour envoyer les emails dans la bonne langue.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TEXTES = {
  fr: {
    illisible: 'Formulaire illisible.',
    email: 'Vérifie ton adresse email.',
    consentement: 'Coche la case pour accepter de recevoir la newsletter.',
    bientot: 'Les inscriptions ouvrent très bientôt. Reviens dans quelques jours, ou écris à hello@cycleawakening.com.',
    oups: 'Oups, l’inscription n’a pas fonctionné. Réessaie dans un instant ou écris à hello@cycleawakening.com.',
    pages: { envoyee: '/newsletter-envoyee', confirmee: '/newsletter-confirmee', erreur: '/newsletter-erreur' },
  },
  en: {
    illisible: 'The form could not be read.',
    email: 'Please check your email address.',
    consentement: 'Tick the box to agree to receive the newsletter.',
    bientot: 'Sign-ups open very soon. Come back in a few days, or write to hello@cycleawakening.com.',
    oups: 'Oops, the sign-up didn’t work. Try again in a moment or write to hello@cycleawakening.com.',
    pages: { envoyee: '/en/newsletter-sent', confirmee: '/en/newsletter-confirmed', erreur: '/en/newsletter-error' },
  },
};

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const reply = (status, message, redirect) =>
    wantsJson
      ? Response.json({ ok: status < 300, message }, { status })
      : Response.redirect(new URL(redirect, request.url), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(400, TEXTES.fr.illisible, TEXTES.fr.pages.erreur);
  }
  const lang = form.get('lang') === 'en' ? 'en' : 'fr';
  const tx = TEXTES[lang];

  // Piège à robots : un humain ne remplit jamais ce champ.
  if (form.get('site')) return reply(200, 'ok', tx.pages.envoyee);

  const email = String(form.get('email') || '').trim().toLowerCase();
  const source = String(form.get('source') || 'site').slice(0, 40).replace(/[^a-z0-9-]/gi, '');
  if (!EMAIL.test(email) || email.length > 254) return reply(400, tx.email, tx.pages.erreur);
  if (form.get('consent') !== 'oui') return reply(400, tx.consentement, tx.pages.erreur);

  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID || !env.BREVO_DOI_TEMPLATE_ID) {
    // Pas encore configuré : on ne fait pas semblant d'avoir inscrit la personne.
    return reply(503, tx.bientot, tx.pages.erreur);
  }

  const site = (env.PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, '');
  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email,
      includeListIds: [Number(env.BREVO_LIST_ID)],
      templateId: Number((lang === 'en' && env.BREVO_DOI_TEMPLATE_ID_EN) || env.BREVO_DOI_TEMPLATE_ID),
      redirectionUrl: `${site}${tx.pages.confirmee}`,
      attributes: { SOURCE: source, LANGUE: lang, CONSENTEMENT: new Date().toISOString() },
    }),
  });

  // 201 : email de confirmation envoyé. 204 : contact déjà connu (Brevo ne renvoie pas d'erreur).
  if (res.ok) return reply(200, 'ok', tx.pages.envoyee);

  console.error('Brevo', res.status, await res.text().catch(() => ''));
  return reply(502, tx.oups, tx.pages.erreur);
}

export function onRequest() {
  return new Response('Méthode non autorisée', { status: 405, headers: { allow: 'POST' } });
}
