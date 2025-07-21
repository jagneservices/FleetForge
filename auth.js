let currentSession = null;
let sessionChecked = false;

function redirectIfAuthPage() {
  const path = window.location.pathname;
  const isAuthPage = /(login|signup)(\.html)?$/.test(path);
  if (currentSession && isAuthPage) {
    window.location.href = 'dashboard.html';
  }
}

supabase.auth.getSession().then(({ data: { session } }) => {
  currentSession = session;
  sessionChecked = true;
  redirectIfAuthPage();
});

supabase.auth.onAuthStateChange((_event, session) => {
  currentSession = session;
  sessionChecked = true;
  redirectIfAuthPage();
});

function requireAuth() {
  return Promise.resolve(sessionChecked ? undefined :
    supabase.auth.getSession().then(({ data: { session } }) => {
      currentSession = session;
      sessionChecked = true;
    })
  ).then(() => {
    const path = window.location.pathname;
    const isAuthPage = /(login|signup)(\.html)?$/.test(path);

    if (!currentSession) {
      if (!isAuthPage) {
        window.location.href = 'login.html';
      }
      return Promise.reject();
    }

    if (isAuthPage) {
      window.location.href = 'dashboard.html';
      return Promise.reject();
    }

    return currentSession.user;
  });
}

async function requirePaid() {
  if (!currentSession) {
    window.location.href = 'login.html';
    return false;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('active')
    .eq('user_id', currentSession.user.id)
    .single();

  const active = !error && data && data.active;
  if (active) {
    return true;
  }

  window.location.href = 'pricing.html';
  return false;
}
