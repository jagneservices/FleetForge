// Shared authentication helpers for FleetForge

function storeCompany(company) {
  if (!company) return;
  const name = company.company_name || company.name || '';
  localStorage.setItem('ff_company_id', company.id);
  localStorage.setItem('ff_company_name', name);
}

function clearCompany() {
  localStorage.removeItem('ff_company_id');
  localStorage.removeItem('ff_company_name');
  localStorage.removeItem('ff_user_id');
}

async function getCurrentUser() {
  const { data } = await client.auth.getUser();
  return data ? data.user : null;
}

// Local auth check based on saved user id
function requireLocalAuth() {
  const userId = localStorage.getItem('ff_user_id');
  if (!userId) {
    window.location.href = 'login.html';
    return null;
  }
  const nav = document.querySelector('nav');
  if (nav) nav.classList.remove('hidden');
  return userId;
}

async function requireAuth() {
  const { data } = await client.auth.getSession();
  if (!data || !data.session) {
    window.location.href = 'login.html';
    return Promise.reject();
  }
  return { user: data.session.user, session: data.session };
}

async function getCompanyForUser(userId) {
  const { data, error } = await client
    .from('companies')
    .select('id, company_name, name')
    .eq('user_id', userId)
    .single();
  if (error) return null;
  return { id: data.id, name: data.company_name || data.name };
}

async function loadCompany() {
  const id = localStorage.getItem('ff_company_id');
  const name = localStorage.getItem('ff_company_name');
  if (id) return { id, name };
  const user = await getCurrentUser();
  if (!user) return null;
  const company = await getCompanyForUser(user.id);
  if (company) storeCompany(company);
  return company;
}

async function requireCompany() {
  const company = await loadCompany();
  if (!company) {
    if (!/register-company|company-registration/.test(window.location.pathname)) {
      window.location.href = 'register-company.html';
    }
    return Promise.reject();
  }
  return company;
}

client.auth.onAuthStateChange((_event, session) => {
  if (!session) {
    clearCompany();
  }
});

async function logout() {
  clearCompany();
  await client.auth.signOut();
}

async function navigate(url) {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
  } else {
    window.location.href = url;
  }
}

async function requirePaid() {
  // placeholder subscription check
  return true;
}
