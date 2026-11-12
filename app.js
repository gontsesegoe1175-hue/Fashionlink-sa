(() => {
  const $ = (s) => document.querySelector(s);
  const demoDesigners = [
    {name:'Amahle Mokoena',city:'Johannesburg',specialty:'Fashion Design',tagline:'Modern silhouettes with a proudly African point of view.',initials:'AM',tone:'rose'},
    {name:'Lwazi Khumalo',city:'Cape Town',specialty:'Streetwear',tagline:'Everyday essentials, reimagined with bold detail.',initials:'LK',tone:'sand'},
    {name:'Zanele Ndlovu',city:'Durban',specialty:'Styling',tagline:'Editorial styling and creative direction for new voices.',initials:'ZN',tone:'blue'},
    {name:'Thabo Radebe',city:'Pretoria',specialty:'Tailoring',tagline:'Thoughtful construction. Made-to-measure craft.',initials:'TR',tone:'green'},
    {name:'Naledi Jacobs',city:'Gqeberha',specialty:'Accessories',tagline:'Sculptural accessories made to start conversations.',initials:'NJ',tone:'lilac'},
    {name:'Mia Petersen',city:'Cape Town',specialty:'Pattern Making',tagline:'From first draft to a fit that feels just right.',initials:'MP',tone:'ochre'}
  ];
  let supabase = null, role = 'client', designers = demoDesigners;
  const configured = window.FASHIONLINK_CONFIG && window.FASHIONLINK_CONFIG.SUPABASE_URL && window.FASHIONLINK_CONFIG.SUPABASE_ANON_KEY && !window.FASHIONLINK_CONFIG.SUPABASE_ANON_KEY.includes('PASTE_');
  if (configured && window.supabase) supabase = window.supabase.createClient(window.FASHIONLINK_CONFIG.SUPABASE_URL, window.FASHIONLINK_CONFIG.SUPABASE_ANON_KEY);

  function renderDesigners() {
    const q = ($('#searchInput').value || '').toLowerCase(), cat = $('#categoryFilter').value, city = $('#cityFilter').value;
    const filtered = designers.filter(d => [d.name,d.city,d.specialty,d.tagline].join(' ').toLowerCase().includes(q) && (!cat || d.specialty === cat) && (!city || d.city === city));
    $('#designerGrid').innerHTML = filtered.length ? filtered.map(d => `<article class="designer-card"><div class="designer-art ${d.tone || 'sand'}"><span class="card-initials">${escapeHtml(d.initials || initials(d.name))}</span><span class="available">${d.verified ? '✓ VERIFIED' : 'CREATIVE PROFILE'}</span><span class="art-caption">${escapeHtml(d.specialty)}</span></div><div class="designer-info"><div><h3>${escapeHtml(d.name)}</h3><span class="location">⌖ ${escapeHtml(d.city || 'South Africa')}</span></div><span class="card-arrow">↗</span></div><p>${escapeHtml(d.tagline || 'Independent creative on FashionLink SA.')}</p></article>`).join('') : '<div class="empty-state">No designers match those filters yet. Try another search.</div>';
  }
  function escapeHtml(v='') { return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function initials(n='') { return n.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase(); }
  async function loadDesigners() {
    if (!supabase) return;
    const { data, error } = await supabase.from('profiles').select('id,full_name,city,specialty,bio,role,kyc_status').eq('role','designer').order('created_at',{ascending:false}).limit(24);
    if (error) { console.warn('Supabase profiles:', error.message); return; }
    if (data?.length) { designers = data.map(p=>({name:p.full_name || 'Fashion designer',city:p.city || 'South Africa',specialty:p.specialty || 'Fashion Design',tagline:p.bio || 'Independent creative on FashionLink SA.',initials:initials(p.full_name),verified:p.kyc_status === 'verified'})); renderDesigners(); $('#dataNote').textContent = 'Designer profiles are loading from your Supabase project.'; }
    else $('#dataNote').textContent = 'Your database is connected. Be the first to create a designer profile.';
  }
  function openModal() { $('#authModal').classList.add('show'); $('#authModal').setAttribute('aria-hidden','false'); $('#email').focus(); }
  function closeModal() { $('#authModal').classList.remove('show'); $('#authModal').setAttribute('aria-hidden','true'); }
  function toast(msg) { const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),3200); }
  ['#signupOpen','#heroJoin','#bannerJoin'].forEach(s=>$(s).addEventListener('click',openModal));
  $('#loginOpen').addEventListener('click',()=>{openModal();$('#modalTitle').textContent='Welcome back.';$('#authSubmit').innerHTML='Log in <span>↗</span>';});
  $('#modalClose').addEventListener('click',closeModal); $('#authModal').addEventListener('click',e=>{if(e.target.id==='authModal')closeModal();});
  document.querySelectorAll('.role').forEach(b=>b.addEventListener('click',()=>{role=b.dataset.role;document.querySelectorAll('.role').forEach(x=>x.classList.toggle('active',x===b));}));
  $('#authForm').addEventListener('submit',async e=>{
    e.preventDefault(); const email=$('#email').value.trim(), password=$('#password').value, msg=$('#authMessage'), isLogin=$('#modalTitle').textContent==='Welcome back.';
    msg.textContent='';
    if(!supabase){msg.textContent='Connect Supabase first: add your publishable key in config.js and run the SQL in supabase/schema.sql.';return;}
    $('#authSubmit').disabled=true; $('#authSubmit').textContent='Please wait…';
    try {
      const result = isLogin ? await supabase.auth.signInWithPassword({email,password}) : await supabase.auth.signUp({email,password,options:{data:{role}}});
      if(result.error) throw result.error;
      if(!isLogin && !result.data.session) msg.textContent='Check your email to confirm your account, then log in.';
      else { msg.textContent='Account ready. Welcome to FashionLink SA!'; toast('You're connected. Welcome in!'); setTimeout(closeModal,1300); }
    } catch(err) { msg.textContent=err.message || 'Something went wrong. Please try again.'; }
    finally { $('#authSubmit').disabled=false; $('#authSubmit').innerHTML=isLogin?'Log in <span>↗</span>':'Create account <span>↗</span>'; }
  });
  ['#searchInput','#categoryFilter','#cityFilter'].forEach(s=>$(s).addEventListener(s==='#searchInput'?'input':'change',renderDesigners));
  $('#year').textContent=new Date().getFullYear(); renderDesigners(); loadDesigners();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('./sw.js').catch(console.warn);
  if(!configured) $('#dataNote').textContent='Preview mode: add your Supabase publishable key to config.js and apply the database schema to enable live accounts and profiles.';
})();
