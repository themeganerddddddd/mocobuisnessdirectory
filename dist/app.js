'use strict';
const $ = id => document.getElementById(id);
const industryOrder = ['Life Sciences','Satellite','Defense','Technology'];
let businesses = [], page = 1;
const pageSize = 12;
const pin = '<svg viewBox="0 0 20 24" fill="none" aria-hidden="true"><path d="M17 9c0 6-7 12-7 12S3 15 3 9a7 7 0 1 1 14 0Z"/><circle cx="10" cy="9" r="2.5"/></svg>';
const escape = s => String(s ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function filteredBusinesses(){
  const q = $('keyword').value.trim().toLocaleLowerCase(), industry = $('industry').value, city = $('city').value;
  return businesses.filter(c => (!industry || c.industry===industry) && (!city || c.city===city) && (!q || [c.name,c.specialty,c.description,c.industry,c.city].join(' ').toLocaleLowerCase().includes(q))).sort((a,b)=>{
    if($('sort').value==='name-desc') return b.name.localeCompare(a.name);
    const field = $('sort').value==='industry'?'industry':$('sort').value==='city'?'city':'name';
    return a[field].localeCompare(b[field]) || a.name.localeCompare(b.name);
  });
}
function makeCard(c){
  const card = document.createElement('article');
  card.className = 'company-card industry-'+c.industry.toLowerCase().replaceAll(' ','-');
  const fallback = `<span class="company-name-fallback">${escape(c.name)}</span>`;
  const words=c.name.split(' '), tail=words.pop();
  const linkedName=(words.length?escape(words.join(' '))+' ':'')+`<span class="name-tail">${escape(tail)} <span class="external-arrow" aria-hidden="true">↗</span></span>`;
  card.innerHTML = `<div class="logo-panel"><span class="card-number">${String(c.number).padStart(2,'0')}</span>${c.logo ? `<img src="${escape(c.logo)}" alt="${escape(c.name)} logo" loading="lazy">` : fallback}</div><div class="card-body"><span class="card-label">${escape(c.industry)}</span><h3><a href="${escape(c.website)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(c.name)} official website (opens in a new tab)">${linkedName}</a></h3><p class="card-description">${escape(c.description)}</p><div class="card-meta"><span class="city-label">${pin}${escape(c.city)}, MD</span><span class="specialty-label">${escape(c.specialty)}</span></div></div>`;
  const logoPanel = card.querySelector('.logo-panel');
  if(c.logo && c.darkLogo)logoPanel.classList.add('dark-logo');
  const img = card.querySelector('img');
  if(img) img.addEventListener('error',()=>{logoPanel.classList.remove('dark-logo');img.outerHTML=fallback},{once:true});
  return card;
}
function render(){
  const list = filteredBusinesses(), totalPages = Math.ceil(list.length/pageSize);
  page = Math.max(1,Math.min(page,totalPages||1));
  const start = (page-1)*pageSize;
  $('company-grid').replaceChildren(...list.slice(start,start+pageSize).map(makeCard));
  $('empty-state').hidden = list.length>0;
  $('results-count').innerHTML = list.length ? `Showing <strong>${start+1}–${Math.min(start+pageSize,list.length)}</strong> of <strong>${list.length}</strong> businesses` : 'Showing <strong>0</strong> businesses';
  $('clear-filters').hidden = !($('industry').value || $('city').value || $('keyword').value);
  document.querySelectorAll('.industry-tab').forEach(b=>{const selected = b.dataset.industry===$('industry').value;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
  const nav = $('pagination');nav.replaceChildren();
  if(totalPages>1){
    const addButton=(label,target,disabled,current=false)=>{const b=document.createElement('button');b.textContent=label;b.disabled=disabled;if(current)b.setAttribute('aria-current','page');b.setAttribute('aria-label',label==='Previous'?'Previous page':label==='Next'?'Next page':`Page ${label}`);b.addEventListener('click',()=>{page=target;render();$('results-count').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})});nav.append(b)};
    addButton('Previous',page-1,page===1);
    for(let n=1;n<=totalPages;n++)addButton(String(n),n,false,n===page);
    addButton('Next',page+1,page===totalPages);
    const label=document.createElement('span');label.className='page-label';label.textContent=`${page} / ${totalPages}`;nav.append(label);
  }
}
function resetFilters(){ $('filters').reset(); page=1;render(); }
$('filters').addEventListener('submit',e=>{e.preventDefault();page=1;render()});
['industry','city','sort'].forEach(id=>$(id).addEventListener('change',()=>{page=1;render()}));
$('keyword').addEventListener('input',()=>{page=1;render()});
$('clear-filters').addEventListener('click',resetFilters);$('reset-empty').addEventListener('click',resetFilters);
const dialog=$('about-dialog');document.querySelectorAll('[data-open-about]').forEach(b=>b.addEventListener('click',()=>dialog.showModal()));
document.querySelectorAll('.dialog-close,.close-about').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
fetch('businesses.json').then(r=>{if(!r.ok)throw Error('Could not load businesses');return r.json()}).then(data=>{
  businesses=data;
  [...new Set(businesses.map(c=>c.city))].sort().forEach(city=>{const option=document.createElement('option');option.value=city;option.textContent=city;$('city').append(option)});
  [['','All businesses'],...industryOrder.map(x=>[x,x])].forEach(([industry,label])=>{const b=document.createElement('button');b.type='button';b.className='industry-tab';b.dataset.industry=industry;b.innerHTML=`${escape(label)}<span>${businesses.filter(c=>!industry||c.industry===industry).length}</span>`;b.addEventListener('click',()=>{$('industry').value=industry;page=1;render()});$('industries').append(b)});
  render();
}).catch(()=>{$('results-count').textContent='The directory could not load. Refresh this page or download the CSV.';const a=document.createElement('a');a.href='business-directory.csv';a.className='button-outline';a.textContent='Download all 50 businesses';$('company-grid').append(a)});
