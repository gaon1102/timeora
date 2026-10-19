/* Shared language list and dropdown menu (used by every page). Each language is shown by its own name. */
const LANGS=[['en','English','Contact','Privacy Policy'],['ko','한국어','문의','개인정보처리방침'],['ja','日本語','お問い合わせ','プライバシーポリシー'],['zh','简体中文','联系我们','隐私政策'],['es','Español','Contacto','Política de privacidad'],['pt','Português','Contato','Política de Privacidade'],['fr','Français','Contact','Politique de confidentialité'],['de','Deutsch','Kontakt','Datenschutzerklärung'],['id','Bahasa Indonesia','Kontak','Kebijakan Privasi'],['vi','Tiếng Việt','Liên hệ','Chính sách bảo mật'],['ru','Русский','Контакты','Политика конфиденциальности']];
const LSTORE={get(){try{return JSON.parse(localStorage.getItem('lang'))}catch(e){return null}},set(v){try{localStorage.setItem('lang',JSON.stringify(v))}catch(e){}}};
function langInfo(c){return LANGS.find(l=>l[0]===c)||LANGS[0]}
function pickLang(){const s=LSTORE.get();if(LANGS.some(l=>l[0]===s))return s;const n=(navigator.language||'en').toLowerCase().slice(0,2);return LANGS.some(l=>l[0]===n)?n:'en'}
function initLangMenu(btn,getLang,onPick){
const st=document.createElement('style');
st.textContent='.langwrap{position:relative;display:inline-block}.langmenu{position:absolute;right:0;top:calc(100% + 6px);min-width:190px;max-height:70vh;overflow:auto;background:var(--card,#fff);border:1px solid var(--line,var(--card2,#ddd));border-radius:14px;padding:6px;z-index:20;box-shadow:0 8px 24px rgba(0,0,0,.12)}.langmenu[hidden]{display:none}.langmenu button{display:block;width:100%;text-align:left;background:none;border:0;border-radius:10px;padding:9px 14px;color:inherit;font:inherit;cursor:pointer}.langmenu button:hover{background:var(--card2,#eee)}.langmenu button[aria-current=true]{font-weight:700}';
document.head.appendChild(st);
const wrap=document.createElement('span');wrap.className='langwrap';
btn.parentNode.insertBefore(wrap,btn);wrap.appendChild(btn);
const menu=document.createElement('div');menu.className='langmenu';menu.hidden=true;wrap.appendChild(menu);
const label=()=>{btn.textContent=langInfo(getLang())[1]+' ▾';btn.setAttribute('aria-haspopup','menu');menu.innerHTML=LANGS.map(l=>`<button type="button" data-l="${l[0]}" lang="${l[0]}"${l[0]===getLang()?' aria-current="true"':''}>${l[1]}</button>`).join('')};
btn.addEventListener('click',e=>{e.stopPropagation();menu.hidden=!menu.hidden});
menu.addEventListener('click',e=>{const b=e.target.closest('[data-l]');if(!b)return;menu.hidden=true;LSTORE.set(b.dataset.l);onPick(b.dataset.l)});
document.addEventListener('click',()=>{menu.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')menu.hidden=true});
label();return label;
}
