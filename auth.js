function requireAuth() {
  return supabase.auth.getUser().then(({ data }) => {
    if (!data || !data.user) {
      const sess = localStorage.getItem('sb-session');
      if (sess) {
        return supabase.auth.setSession(JSON.parse(sess).session).then(() => {
          return supabase.auth.getUser().then(({ data }) => {
            if (data && data.user) return data.user;
            window.location.href = 'login.html';
            return Promise.reject();
          });
        });
      }
      window.location.href = 'login.html';
      return Promise.reject();
    }
    return data.user;
  });
}

function requirePaid() {
  const paid = localStorage.getItem('paid');
  if (!paid) {
    window.location.href = 'pricing.html';
    return false;
  }
  return true;
}
