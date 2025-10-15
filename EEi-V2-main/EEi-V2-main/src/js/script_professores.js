const API_BASE = '/api'; // ajuste se necessário (ex: '/EEi-V2-main/api')

async function fetchJSON(url, opts={}) {
  const res = await fetch(url, opts);
  return res.json();
}

async function listar() {
  const out = document.getElementById('professores-list');
  out.innerHTML = 'Carregando...';
  try {
    const r = await fetchJSON(`${API_BASE}/professores_list.php`);
    if (!r.success) { out.innerHTML = 'Erro ao carregar'; return; }
    out.innerHTML = '';
    r.professores.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prof-card ' + (p.ativo==0 ? 'card-disabled' : '');
      card.innerHTML = `
        <div class="info">
          <div><strong>${p.nome_completo}</strong><br><small>${p.email}</small></div>
          <div><b>Código:</b> ${p.codigo ?? ''}</div>
          <div><b>Turno:</b> ${p.turno ?? ''}</div>
          <div><b>Especialidade:</b> ${p.especialidade ?? ''}</div>
          <div style="flex:1"></div>
          <div class="actions">
            <button class="btn-edit" data-usuario="${p.usuario_id}" data-prof="${p.professor_id}">✏️</button>
            <button class="btn-toggle" data-usuario="${p.usuario_id}" data-ativo="${p.ativo}">${p.ativo==1 ? 'Desativar' : 'Ativar'}</button>
          </div>
        </div>
      `;
      out.appendChild(card);
    });
  } catch(e) {
    document.getElementById('professores-list').innerHTML = 'Erro de conexão';
    console.error(e);
  }
}

document.addEventListener('click', async (ev) => {
  if (ev.target.matches('#btn-refresh')) { listar(); }
  if (ev.target.matches('#btn-adicionar')) {
    openModal('Adicionar professor');
  }
  if (ev.target.matches('#btn-cancel')) { closeModal(); }

  if (ev.target.matches('.btn-edit')) {
    const usuario_id = ev.target.dataset.usuario;
    const prof_id = ev.target.dataset.prof;
    // carregar dados do card (já estão na página) ou pedir API para detalhes
    // Para simplicidade, vamos pedir a lista e achar o registro
    const r = await fetchJSON(`${API_BASE}/professores_list.php`);
    const p = r.professores.find(x => String(x.usuario_id) === String(usuario_id));
    if (p) openModal('Editar professor', p);
  }

  if (ev.target.matches('.btn-toggle')) {
    const usuario_id = ev.target.dataset.usuario;
    const cur = parseInt(ev.target.dataset.ativo,10);
    const novo = cur ? 0 : 1;
    if (!confirm((novo? 'Ativar' : 'Desativar') + ' este professor?')) return;
    const res = await fetchJSON(`${API_BASE}/professores_toggle.php`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({usuario_id: Number(usuario_id), ativo: novo})
    });
    if (res.success) {
      listar();
    } else {
      alert(res.error || 'Erro');
    }
  }
});

function openModal(title, p=null) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal').classList.add('show');
  if (p) {
    document.getElementById('professor_id').value = p.professor_id || '';
    document.getElementById('usuario_id').value = p.usuario_id || '';
    document.getElementById('nome_completo').value = p.nome_completo || '';
    document.getElementById('email').value = p.email || '';
    document.getElementById('senha').value = '';
    document.getElementById('codigo').value = p.codigo || '';
    document.getElementById('turno').value = p.turno || '';
    document.getElementById('especialidade').value = p.especialidade || '';
  } else {
    document.getElementById('professor_id').value = '';
    document.getElementById('usuario_id').value = '';
    document.getElementById('nome_completo').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('codigo').value = '';
    document.getElementById('turno').value = '';
    document.getElementById('especialidade').value = '';
  }
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

document.getElementById('form-prof').addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario_id = document.getElementById('usuario_id').value || null;
  const professor_id = document.getElementById('professor_id').value || null;
  const payload = {
    email: document.getElementById('email').value,
    nome_completo: document.getElementById('nome_completo').value,
    senha: document.getElementById('senha').value,
    codigo: document.getElementById('codigo').value,
    turno: document.getElementById('turno').value,
    especialidade: document.getElementById('especialidade').value
  };

  if (!usuario_id) {
    // criar
    const res = await fetchJSON(`${API_BASE}/professores_create.php`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (res.success) {
      closeModal();
      listar();
      showNotificacao('Professor cadastrado com sucesso');
    } else {
      alert(res.error || 'Erro ao cadastrar');
    }
  } else {
    // atualizar
    payload.usuario_id = Number(usuario_id);
    const res = await fetchJSON(`${API_BASE}/professores_update.php`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if (res.success) {
      closeModal();
      listar();
      showNotificacao('Professor atualizado');
    } else {
      alert(res.error || 'Erro ao atualizar');
    }
  }
});

function showNotificacao(msg) {
  const n = document.getElementById('notificacao');
  n.textContent = msg;
  setTimeout(()=> n.textContent = '', 3500);
}

// carrega ao abrir
listar();
