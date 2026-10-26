// Stockage de l'espace accompagnement : copie locale (navigateur) + synchronisation Supabase.
// Sans PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY, l'espace fonctionne en mode local (rien ne quitte l'appareil).
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anonKey
  ? createClient(url, anonKey, { auth: { persistSession: true, detectSessionInUrl: true, flowType: 'implicit' } })
  : null;

const LOCAL_KEY = 'ca-accompagnement';
const TABLE = 'accompagnement_state';

export function readLocal() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch { return {}; }
}
function writeLocal(state) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); } catch { /* stockage indisponible : on garde l'état en mémoire */ }
}

/** Lit l'état enregistré de la personne connectée (null s'il n'existe pas encore). */
export async function loadRemote(user) {
  const { data, error } = await supabase.from(TABLE).select('data').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

/**
 * Magasin clé → valeur (chaînes) utilisé par l'interface.
 * Chaque modification est gardée localement tout de suite, puis envoyée à Supabase (regroupée, 800 ms).
 */
export function createStore({ user = null, initial = {}, onStatus = () => {} } = {}) {
  const state = { ...initial };
  let timer = null;

  async function push() {
    if (!supabase || !user) return;
    onStatus('saving');
    const { error } = await supabase
      .from(TABLE)
      .upsert({ user_id: user.id, data: state, updated_at: new Date().toISOString() });
    onStatus(error ? 'error' : 'saved');
  }

  writeLocal(state);
  return {
    get(key) { return key in state ? String(state[key]) : null; },
    set(key, value) {
      if (state[key] === value) return;
      state[key] = value;
      writeLocal(state);
      clearTimeout(timer);
      timer = setTimeout(push, 800);
    },
    flush: push,
  };
}
