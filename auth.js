window.currentCompany = null;

async function updateNav(user) {
  const link = document.getElementById('loginLink');
  if (!link) return;
  if (user) {
    link.textContent = 'Logout';
    link.href = '#';
    link.onclick = async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
    };
  } else {
    link.textContent = 'Login';
    link.href = 'login.html';
    link.onclick = null;
  }
}

// Initial navigation/company sync
supabase.auth.getUser().then(async ({ data }) => {
  const user = data ? data.user : null;
  if (user) {
    window.currentCompany = await getCompany(user.id);
  }
  updateNav(user);
});

// Keep state in sync on auth changes
supabase.auth.onAuthStateChange(async (_event, session) => {
  const user = session ? session.user : null;
  if (user) {
    window.currentCompany = await getCompany(user.id);
  } else {
    window.currentCompany = null;
  }
  updateNav(user);
});

function requireAuth() {
  return supabase.auth.getUser().then(({ data }) => {
    const path = window.location.pathname;
    const isAuthPage = /(login|signup)(\.html)?$/.test(path);

    if (!data || !data.user) {
      if (!isAuthPage) {
        window.location.href = 'login.html';
      }
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

async function getCompany(userId) {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', userId)
    .single();
  return error ? null : data;
}

async function requireCompany() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'login.html';
    return Promise.reject();
  }

  const company = await getCompany(user.id);
  if (!company) {
    if (!/register-company(\.html)?$/.test(window.location.pathname)) {
      window.location.href = 'register-company.html';
      return Promise.reject();
    }
    return null;
  }
  window.currentCompany = company;
  return company;
}

supabase.auth.onAuthStateChange(async (_event, session) => {
  if (session && session.user) {
    const company = await getCompany(session.user.id);
    window.currentCompany = company;
    if (company) {
      if (/login(\.html)?$/.test(window.location.pathname) ||
          /signup(\.html)?$/.test(window.location.pathname) ||
          /register-company(\.html)?$/.test(window.location.pathname)) {
        window.location.href = 'dashboard.html';
      }
    } else {
      if (!/register-company(\.html)?$/.test(window.location.pathname)) {
        window.location.href = 'register-company.html';
      }
    }
  }
});
