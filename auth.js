function requireAuth() {
  return supabase.auth.getUser().then(({ data }) => {
    if (!data || !data.user) {
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
