function requireAuth() {
  return supabase.auth.getUser().then(({ data }) => {
    const path = window.location.pathname;
    const isAuthPage = /(login|signup)(\.html)?$/.test(path);

    if (!data || !data.user) {
      const sess = localStorage.getItem('sb-session');
      if (sess) {
        return supabase.auth.setSession(JSON.parse(sess).session).then(() => {
          return supabase.auth.getUser().then(({ data }) => {
            if (data && data.user) {
              if (isAuthPage) {
                window.location.href = 'dashboard.html';
                return Promise.reject();
              }
              return data.user;
            }
            window.location.href = 'login.html';
            return Promise.reject();
          });
        });
      }
      window.location.href = 'login.html';
      return Promise.reject();
    }

    if (isAuthPage) {
      window.location.href = 'dashboard.html';
      return Promise.reject();
    }

    return data.user;
  });
}

async function requirePaid() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'login.html';
    return false;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('active')
    .eq('user_id', user.id)
    .single();

  const active = !error && data && data.active;
  if (active) {
    return true;
  }

  window.location.href = 'pricing.html';
  return false;
}
