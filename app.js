
// Pages only contain their own widgets, so missing elements resolve to a harmless stand-in.
const NOEL=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>'':NOEL,set:()=>true,apply:()=>NOEL});
const $=s=>document.querySelector(s)||NOEL,$$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
let lang=pickLang();

const T={
en:{contact:'Contact',use24:'24-hour time',volume:'Volume',recent:'Recently used',clear:'Clear',utcLabel:'UTC · Coordinated Universal Time',localNow:'Your local time',sound:'Alarm sound',timerSoundLbl:'Sound when time is up',subWorld:'Check the current time in cities around the world.',subAlarm:'Set alarms that ring at the time you choose.',subStopwatch:'Measure time precisely and record laps.',subTimer:'Count down and get notified when time is up.',searchCity:'Search for a city or country',more:'How to use',noResult:'No results.',settings:'Settings',hourFormat:'Time format',auto:'Auto',h12:'12-hour (AM/PM)',h24:'24-hour',showSec:'Show seconds',numColor:'Number color',theme:'Theme',dark:'Dark',light:'Light',resetAll:'Reset to defaults',colorDefault:'Default',colorCustom:'Custom color',privacy:'Privacy Policy',world:'World Clock',alarm:'Alarm',stopwatch:'Stopwatch',timer:'Timer',add:'Add',addAlarm:'Add alarm',label:'Label (optional)',keepOpen:'Keep this tab open so alarms and timers can ring.',local:'Local time',today:'Today',yesterday:'Yesterday',tomorrow:'Tomorrow',hr:'Hours',min:'Min',sec:'Sec',start:'Start',stop:'Stop',lap:'Lap',reset:'Reset',pause:'Pause',resume:'Resume',cancel:'Cancel',snooze:'Snooze 9 min',timeUp:'Time is up',once:'Once',everyday:'Every day',lapN:'Lap',h:'h',m:'m',noAlarms:'No alarms yet. Add one below.',del:'Delete',other:'한국어',minutes:'min'},
ko:{contact:'문의',use24:'24시간제',volume:'소리 크기',recent:'최근 사용한 항목',clear:'지우기',utcLabel:'UTC · 세계협정시',localNow:'내 현재 시각',sound:'알람 소리',timerSoundLbl:'종료 소리',subWorld:'다른 도시의 현재 시각을 확인합니다.',subAlarm:'원하는 시간에 알람을 울립니다.',subStopwatch:'시간을 정밀하게 측정하고 랩을 기록합니다.',subTimer:'정해 둔 시간이 끝나면 알려 줍니다.',searchCity:'도시 또는 국가 검색',more:'사용 방법',noResult:'검색 결과가 없습니다.',settings:'설정',hourFormat:'시간 표시',auto:'자동',h12:'12시간 (오전/오후)',h24:'24시간',showSec:'초 표시',numColor:'숫자 색상',theme:'테마',dark:'다크',light:'라이트',resetAll:'기본값으로 되돌리기',colorDefault:'기본',colorCustom:'직접 선택',privacy:'개인정보처리방침',world:'세계 시계',alarm:'알람',stopwatch:'스톱워치',timer:'타이머',add:'추가',addAlarm:'알람 추가',label:'이름 (선택)',keepOpen:'알람과 타이머가 울리려면 이 탭을 열어 두어야 합니다.',local:'현재 위치',today:'오늘',yesterday:'어제',tomorrow:'내일',hr:'시간',min:'분',sec:'초',start:'시작',stop:'중지',lap:'랩',reset:'재설정',pause:'일시정지',resume:'계속',cancel:'취소',snooze:'9분 후 다시 알림',timeUp:'시간이 끝났습니다',once:'한 번',everyday:'매일',lapN:'랩',h:'시간',m:'분',noAlarms:'등록된 알람이 없습니다. 아래에서 추가할 수 있습니다.',del:'삭제',other:'English',minutes:'분'}
};
const KEYS='world,alarm,stopwatch,timer,subWorld,subAlarm,subStopwatch,subTimer,searchCity,more,noResult,settings,use24,showSec,volume,numColor,resetAll,colorDefault,colorCustom,add,addAlarm,label,keepOpen,recent,clear,utcLabel,local,hr,min,sec,start,stop,lap,reset,pause,resume,cancel,snooze,timeUp,once,everyday,lapN,h,m,noAlarms,del,minutes,sound,timerSoundLbl'.split(',');
const TX={
ja:['世界時計','アラーム','ストップウォッチ','タイマー','世界各地の現在時刻を確認できます。','指定した時刻にアラームを鳴らします。','時間を正確に計り、ラップを記録します。','カウントダウンして、時間になったらお知らせします。','都市または国を検索','使い方','見つかりませんでした。','設定','24時間表示','秒を表示','音量','数字の色','初期設定に戻す','標準','カスタムカラー','追加','アラームを追加','ラベル（任意）','アラームとタイマーを鳴らすには、このタブを開いたままにしてください。','最近使った項目','消去','UTC · 協定世界時','現地時間','時間','分','秒','開始','停止','ラップ','リセット','一時停止','再開','キャンセル','9分後に再通知','時間になりました','1回のみ','毎日','ラップ','時間','分','アラームはまだありません。下から追加できます。','削除','分','アラーム音','終了時の音'],
zh:['世界时钟','闹钟','秒表','计时器','查看世界各地城市的当前时间。','设置在指定时间响起的闹钟。','精确计时并记录分段。','倒计时，时间到时提醒你。','搜索城市或国家','使用方法','没有结果。','设置','24小时制','显示秒','音量','数字颜色','恢复默认设置','默认','自定义颜色','添加','添加闹钟','标签（可选）','请保持此标签页打开，闹钟和计时器才能响铃。','最近使用','清除','UTC · 协调世界时','本地时间','小时','分钟','秒','开始','停止','计次','重置','暂停','继续','取消','9分钟后再响','时间到','仅一次','每天','计次','小时','分钟','还没有闹钟，可在下方添加。','删除','分钟','闹钟铃声','计时结束铃声'],
es:['Reloj mundial','Alarma','Cronómetro','Temporizador','Consulta la hora actual en ciudades de todo el mundo.','Programa alarmas que suenen a la hora que elijas.','Mide el tiempo con precisión y registra vueltas.','Cuenta atrás y recibe un aviso cuando termine el tiempo.','Buscar una ciudad o país','Cómo usar','Sin resultados.','Ajustes','Formato de 24 horas','Mostrar segundos','Volumen','Color de los números','Restablecer valores','Predeterminado','Color personalizado','Añadir','Añadir alarma','Etiqueta (opcional)','Mantén esta pestaña abierta para que suenen las alarmas y los temporizadores.','Usados recientemente','Borrar','UTC · Tiempo universal coordinado','Hora local','Horas','Min','Seg','Iniciar','Detener','Vuelta','Reiniciar','Pausar','Reanudar','Cancelar','Posponer 9 min','Se acabó el tiempo','Una vez','Todos los días','Vuelta','h','min','Aún no hay alarmas. Añade una abajo.','Eliminar','min','Sonido de alarma','Sonido al terminar'],
pt:['Relógio mundial','Alarme','Cronômetro','Temporizador','Veja a hora atual em cidades do mundo todo.','Defina alarmes que tocam no horário escolhido.','Meça o tempo com precisão e registre voltas.','Faça a contagem regressiva e seja avisado quando acabar.','Pesquisar cidade ou país','Como usar','Nenhum resultado.','Configurações','Formato de 24 horas','Mostrar segundos','Volume','Cor dos números','Restaurar padrões','Padrão','Cor personalizada','Adicionar','Adicionar alarme','Nome (opcional)','Mantenha esta aba aberta para que alarmes e temporizadores toquem.','Usados recentemente','Limpar','UTC · Tempo Universal Coordenado','Hora local','Horas','Min','Seg','Iniciar','Parar','Volta','Zerar','Pausar','Retomar','Cancelar','Soneca de 9 min','O tempo acabou','Uma vez','Todos os dias','Volta','h','min','Nenhum alarme ainda. Adicione um abaixo.','Excluir','min','Som do alarme','Som ao terminar'],
fr:['Horloge mondiale','Alarme','Chronomètre','Minuteur','Consultez l’heure actuelle dans les villes du monde entier.','Programmez des alarmes qui sonnent à l’heure choisie.','Mesurez le temps avec précision et enregistrez des tours.','Lancez un compte à rebours et soyez averti à la fin.','Rechercher une ville ou un pays','Mode d’emploi','Aucun résultat.','Réglages','Format 24 heures','Afficher les secondes','Volume','Couleur des chiffres','Rétablir les valeurs par défaut','Par défaut','Couleur personnalisée','Ajouter','Ajouter une alarme','Libellé (facultatif)','Gardez cet onglet ouvert pour que les alarmes et minuteurs sonnent.','Récemment utilisés','Effacer','UTC · Temps universel coordonné','Heure locale','Heures','Min','Sec','Démarrer','Arrêter','Tour','Réinitialiser','Pause','Reprendre','Annuler','Répéter dans 9 min','Le temps est écoulé','Une fois','Tous les jours','Tour','h','min','Aucune alarme pour le moment. Ajoutez-en une ci-dessous.','Supprimer','min','Sonnerie de l’alarme','Sonnerie de fin'],
de:['Weltzeituhr','Wecker','Stoppuhr','Timer','Die aktuelle Uhrzeit in Städten weltweit ansehen.','Wecker stellen, die zur gewählten Zeit klingeln.','Zeit genau messen und Runden speichern.','Countdown starten und bei Ablauf benachrichtigt werden.','Stadt oder Land suchen','Anleitung','Keine Ergebnisse.','Einstellungen','24-Stunden-Format','Sekunden anzeigen','Lautstärke','Zahlenfarbe','Auf Standard zurücksetzen','Standard','Eigene Farbe','Hinzufügen','Wecker hinzufügen','Bezeichnung (optional)','Lass diesen Tab geöffnet, damit Wecker und Timer klingeln können.','Zuletzt verwendet','Leeren','UTC · Koordinierte Weltzeit','Ortszeit','Std.','Min.','Sek.','Start','Stopp','Runde','Zurücksetzen','Pause','Fortsetzen','Abbrechen','9 Min. Schlummern','Die Zeit ist abgelaufen','Einmalig','Täglich','Runde','Std.','Min.','Noch keine Wecker. Füge unten einen hinzu.','Löschen','Min.','Weckton','Ton am Ende'],
id:['Jam Dunia','Alarm','Stopwatch','Timer','Lihat waktu saat ini di kota-kota di seluruh dunia.','Atur alarm yang berbunyi pada waktu pilihanmu.','Ukur waktu dengan tepat dan catat putaran.','Hitung mundur dan dapatkan pemberitahuan saat waktu habis.','Cari kota atau negara','Cara penggunaan','Tidak ada hasil.','Pengaturan','Format 24 jam','Tampilkan detik','Volume','Warna angka','Setel ulang ke default','Default','Warna kustom','Tambah','Tambah alarm','Label (opsional)','Biarkan tab ini tetap terbuka agar alarm dan timer dapat berbunyi.','Terakhir digunakan','Hapus semua','UTC · Waktu Universal Terkoordinasi','Waktu lokal','Jam','Menit','Detik','Mulai','Berhenti','Putaran','Atur ulang','Jeda','Lanjutkan','Batal','Tunda 9 menit','Waktu habis','Sekali','Setiap hari','Putaran','j','mnt','Belum ada alarm. Tambahkan di bawah.','Hapus','mnt','Nada alarm','Nada saat waktu habis'],
vi:['Đồng hồ thế giới','Báo thức','Bấm giờ','Hẹn giờ','Xem giờ hiện tại ở các thành phố trên thế giới.','Đặt báo thức kêu vào giờ bạn chọn.','Đo thời gian chính xác và ghi lại các vòng.','Đếm ngược và nhận thông báo khi hết giờ.','Tìm thành phố hoặc quốc gia','Cách sử dụng','Không có kết quả.','Cài đặt','Định dạng 24 giờ','Hiện giây','Âm lượng','Màu chữ số','Đặt lại mặc định','Mặc định','Màu tùy chọn','Thêm','Thêm báo thức','Nhãn (không bắt buộc)','Hãy giữ tab này mở để báo thức và hẹn giờ có thể kêu.','Dùng gần đây','Xóa','UTC · Giờ phối hợp quốc tế','Giờ địa phương','Giờ','Phút','Giây','Bắt đầu','Dừng','Vòng','Đặt lại','Tạm dừng','Tiếp tục','Hủy','Báo lại sau 9 phút','Đã hết giờ','Một lần','Hằng ngày','Vòng','giờ','phút','Chưa có báo thức. Hãy thêm ở bên dưới.','Xóa','phút','Âm báo thức','Âm khi hết giờ'],
ru:['Мировое время','Будильник','Секундомер','Таймер','Узнайте текущее время в городах по всему миру.','Устанавливайте будильники на нужное время.','Точно измеряйте время и записывайте круги.','Запустите обратный отсчёт и получите сигнал по окончании.','Найти город или страну','Как пользоваться','Ничего не найдено.','Настройки','24-часовой формат','Показывать секунды','Громкость','Цвет цифр','Сбросить настройки','По умолчанию','Свой цвет','Добавить','Добавить будильник','Название (необязательно)','Не закрывайте эту вкладку, чтобы будильники и таймеры могли сработать.','Недавние','Очистить','UTC · Всемирное координированное время','Местное время','Часы','Мин','Сек','Старт','Стоп','Круг','Сброс','Пауза','Продолжить','Отмена','Отложить на 9 мин','Время вышло','Один раз','Каждый день','Круг','ч','мин','Будильников пока нет. Добавьте ниже.','Удалить','мин','Звук будильника','Звук по окончании']
};
Object.keys(TX).forEach(c=>{T[c]={};KEYS.forEach((k,i)=>{T[c][k]=TX[c][i]})});
LANGS.forEach(l=>{T[l[0]]=T[l[0]]||{};T[l[0]].contact=l[2];T[l[0]].privacy=l[3]});
const t=k=>(T[lang]&&T[lang][k])||T.en[k]||k;

/* ---------- settings ---------- */
const DEF={hour:'24',seconds:true,color:'',theme:'light',timerSound:'beep',volume:80};
let settings=Object.assign({},DEF,store.get('settings',{}));
const saveSet=()=>store.set('settings',settings);
const SWATCH=['','#ffb454','#5fe0a0','#6ec1ff','#ff7eb6','#c9a7ff'];
function tf(tz,sec){const o={hour:'numeric',minute:'2-digit'};if(tz)o.timeZone=tz;if(sec)o.second='2-digit';if(settings.hour==='12')o.hour12=true;else{o.hourCycle='h23';o.hour='2-digit'}return new Intl.DateTimeFormat(lang,o)}
function setColor(){const r=document.documentElement;settings.color?r.style.setProperty('--num',settings.color):r.style.removeProperty('--num')}
const effTheme=()=>settings.theme==='auto'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):settings.theme;
function applySettings(){
const r=document.documentElement;setColor();
settings.theme==='auto'?r.removeAttribute('data-theme'):r.setAttribute('data-theme',settings.theme);
$('#sH24').checked=settings.hour!=='12';$('#sSec').checked=settings.seconds;$('#sVol').value=settings.volume;
$('#swatches').innerHTML=SWATCH.map(c=>`<button type="button" data-c="${c}" aria-pressed="${settings.color===c}" aria-label="${c||t('colorDefault')}" style="background:${c||'var(--text)'}"></button>`).join('')+`<input type="color" id="sColor" value="${settings.color||'#ffffff'}" aria-label="${t('colorCustom')}">`;
$('#themeUse').setAttribute('href',effTheme()==='dark'?'#i-moon':'#i-sun');
}
$('#swatches').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;settings.color=b.dataset.c;saveSet();applySettings()};
$('#swatches').addEventListener('input',e=>{if(e.target.id!=='sColor')return;settings.color=e.target.value;saveSet();setColor();$$('#swatches button').forEach(b=>b.setAttribute('aria-pressed','false'))});
$('#sH24').onchange=e=>{settings.hour=e.target.checked?'24':'12';saveSet();refresh();renderAlarms();buildAlarmTime();renderRecent()};
$('#sSec').onchange=e=>{settings.seconds=e.target.checked;saveSet();refresh()};
$('#sVol').oninput=e=>{settings.volume=+e.target.value;saveSet()};
$('#sVol').onchange=()=>playSound('beep');
$('#sReset').onclick=()=>{settings=Object.assign({},DEF,{theme:settings.theme,timerSound:settings.timerSound});saveSet();applySettings();refresh();renderAlarms();buildAlarmTime();renderRecent()};
$('#setBtn').onclick=()=>{$('#settings').hidden=false;$('#setClose').focus()};
$('#themeBtn').onclick=()=>{settings.theme=effTheme()==='dark'?'light':'dark';saveSet();applySettings()};
const closeSet=()=>{$('#settings').hidden=true;$('#setBtn').focus()};
$('#setClose').onclick=closeSet;
$('#settings').addEventListener('click',e=>{if(e.target.id==='settings')closeSet()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#settings').hidden)closeSet()});

/* ---------- audio & ring ---------- */
let actx=null,beepTimer=null;
function unlock(){try{actx=actx||new(window.AudioContext||window.webkitAudioContext)();if(actx.state==='suspended')actx.resume()}catch(e){}}
document.addEventListener('click',unlock);
const tone=(f,t0,dur,type='sine',vol=.35,f2)=>{const o=actx.createOscillator(),g=actx.createGain(),n=actx.currentTime+t0;o.type=type;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+dur);g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(Math.max(.0001,vol*settings.volume/80),n+.02);g.gain.exponentialRampToValueAtTime(.0001,n+dur);o.connect(g);g.connect(actx.destination);o.start(n);o.stop(n+dur+.05)};
const SOUNDS={
chime:{g:'soft',en:'Soft chime',ko:'부드러운 차임',dur:1.2,play:()=>{[523,659,784].forEach((f,i)=>tone(f,i*.3,.6))}},
harp:{g:'soft',en:'Harp',ko:'하프',dur:1.3,play:()=>{[523,659,784,1047,784,659].forEach((f,i)=>tone(f,i*.14,.6,'sine',.25))}},
gentle:{g:'soft',en:'Gentle rise',ko:'잔잔한 상승',dur:2.2,play:()=>{[392,494,587].forEach((f,i)=>tone(f,i*.4,1.2,'sine',.22))}},
sparkle:{g:'soft',en:'Sparkle',ko:'반짝임',dur:.9,play:()=>{[1319,1568,1760,2093,2637].forEach((f,i)=>tone(f,i*.08,.3,'sine',.18))}},
drop:{g:'soft',en:'Water drop',ko:'물방울',dur:.9,play:()=>{tone(1200,0,.25,'sine',.35,500);tone(1500,.35,.25,'sine',.3,600)}},
sonar:{g:'soft',en:'Sonar',ko:'소나',dur:1.5,play:()=>{tone(1200,0,.6,'sine',.3);tone(1200,.8,.6,'sine',.2)}},
beep:{g:'classic',en:'Classic beep',ko:'기본 비프음',dur:.6,play:()=>{tone(880,0,.2);tone(880,.25,.2)}},
bell:{g:'classic',en:'Bell',ko:'벨',dur:1.6,play:()=>{[1,2,3].forEach((m,i)=>tone(587*m,0,1.5-i*.3,'sine',.3/(i+1)))}},
ding:{g:'classic',en:'Ding',ko:'딩',dur:1.6,play:()=>{tone(880,0,1.4,'sine',.35);tone(1760,0,.9,'sine',.12)}},
phone:{g:'classic',en:'Phone ring',ko:'전화벨',dur:1.4,play:()=>{[0,.6].forEach(d=>{tone(440,d,.4,'sine',.28);tone(480,d,.4,'sine',.28)})}},
cuckoo:{g:'classic',en:'Cuckoo',ko:'뻐꾸기',dur:1,play:()=>{tone(784,0,.3,'sine',.4);tone(622,.4,.45,'sine',.4)}},
digital:{g:'upbeat',en:'Digital',ko:'디지털',dur:.7,play:()=>{[0,.15,.3,.45].forEach(d=>tone(1500,d,.08,'square',.18))}},
melody:{g:'upbeat',en:'Melody',ko:'멜로디',dur:1.2,play:()=>{[523,659,784,1047,784,659].forEach((f,i)=>tone(f,i*.18,.2,'triangle',.4))}},
rise:{g:'upbeat',en:'Rising tones',ko:'상승음',dur:.9,play:()=>{[392,523,659,784,1047].forEach((f,i)=>tone(f,i*.12,.3,'sine',.3))}},
marimba:{g:'upbeat',en:'Marimba',ko:'마림바',dur:1,play:()=>{[659,784,988,784].forEach((f,i)=>tone(f,i*.2,.3,'triangle',.45))}},
fanfare:{g:'upbeat',en:'Fanfare',ko:'팡파르',dur:1.3,play:()=>{[392,523,659].forEach((f,i)=>tone(f,i*.2,.25,'sawtooth',.16));tone(784,.6,.6,'sawtooth',.18)}},
siren:{g:'loud',en:'Siren',ko:'사이렌',dur:1.7,play:()=>{tone(600,0,.8,'sawtooth',.2,1000);tone(1000,.8,.8,'sawtooth',.2,600)}},
clock:{g:'loud',en:'Alarm clock',ko:'알람시계',dur:.9,play:()=>{[0,.2,.4,.6].forEach((d,i)=>tone(i%2?900:700,d,.15,'square',.15))}},
buzzer:{g:'loud',en:'Buzzer',ko:'버저',dur:1.3,play:()=>{[0,.6].forEach(d=>tone(150,d,.5,'sawtooth',.3))}},
laser:{g:'loud',en:'Laser',ko:'레이저',dur:1,play:()=>{[0,.45].forEach(d=>tone(1800,d,.3,'sawtooth',.2,300))}}
};
function playSound(id){unlock();if(!actx)return;(SOUNDS[id]||SOUNDS.beep).play()}
const SORDER=['beep','chime','bell','ding','harp','gentle','sparkle','drop','sonar','phone','cuckoo','melody','rise','marimba','fanfare','digital','siren','clock','buzzer','laser'];
const sname=k=>{const s=SOUNDS[k]||SOUNDS.beep;return s[lang]||s.en};
const soundOptions=sel=>SORDER.map(k=>`<option value="${k}"${k===sel?' selected':''}>${esc(sname(k))}</option>`).join('');
let ringSound='beep',lastRing={title:'',sound:'beep'};
function ring(title,snoozable,sound){ringSound=SOUNDS[sound]?sound:'beep';lastRing={title,sound:ringSound};$('#ringTitle').textContent=title;$('#snooze').hidden=!snoozable;$('#ring').hidden=false;playSound(ringSound);clearInterval(beepTimer);beepTimer=setInterval(()=>playSound(ringSound),(SOUNDS[ringSound].dur+.5)*1000);try{if('Notification' in window&&Notification.permission==='granted')new Notification(title)}catch(e){}}
function stopRing(){clearInterval(beepTimer);$('#ring').hidden=true}
$('#stop').onclick=stopRing;
let snoozes=[];
$('#snooze').onclick=()=>{snoozes.push({at:Date.now()+9*60000,title:lastRing.title,sound:lastRing.sound});stopRing()};
$('#aPrev').onclick=()=>playSound($('#aSound').value);
$('#aSound').onchange=()=>playSound($('#aSound').value);
$('#tPrev').onclick=()=>playSound($('#tSound').value);
$('#tSound').onchange=e=>{settings.timerSound=e.target.value;saveSet();playSound(settings.timerSound)};

/* ---------- world clock ---------- */
const CITIES=[['Asia/Seoul','Seoul','서울','South Korea','대한민국'],['Asia/Tokyo','Tokyo','도쿄','Japan','일본'],['Asia/Shanghai','Shanghai','상하이','China','중국'],['Asia/Singapore','Singapore','싱가포르','Singapore','싱가포르'],['Asia/Kolkata','Mumbai','뭄바이','India','인도'],['Asia/Dubai','Dubai','두바이','United Arab Emirates','아랍에미리트'],['Europe/Istanbul','Istanbul','이스탄불','Türkiye','튀르키예'],['Europe/Moscow','Moscow','모스크바','Russia','러시아'],['Europe/Berlin','Berlin','베를린','Germany','독일'],['Europe/Paris','Paris','파리','France','프랑스'],['Europe/London','London','런던','United Kingdom','영국'],['Africa/Cairo','Cairo','카이로','Egypt','이집트'],['America/Sao_Paulo','São Paulo','상파울루','Brazil','브라질'],['America/New_York','New York','뉴욕','United States','미국'],['America/Chicago','Chicago','시카고','United States','미국'],['America/Mexico_City','Mexico City','멕시코시티','Mexico','멕시코'],['America/Los_Angeles','Los Angeles','로스앤젤레스','United States','미국'],['Pacific/Honolulu','Honolulu','호놀룰루','United States','미국'],['Australia/Sydney','Sydney','시드니','Australia','호주'],['Pacific/Auckland','Auckland','오클랜드','New Zealand','뉴질랜드'],['Asia/Hong_Kong','Hong Kong','홍콩','China','중국'],['Asia/Taipei','Taipei','타이베이','Taiwan','대만'],['Asia/Bangkok','Bangkok','방콕','Thailand','태국'],['Asia/Ho_Chi_Minh','Ho Chi Minh City','호찌민','Vietnam','베트남'],['Asia/Jakarta','Jakarta','자카르타','Indonesia','인도네시아'],['Asia/Manila','Manila','마닐라','Philippines','필리핀'],['Asia/Kuala_Lumpur','Kuala Lumpur','쿠알라룸푸르','Malaysia','말레이시아'],['Asia/Karachi','Karachi','카라치','Pakistan','파키스탄'],['Asia/Dhaka','Dhaka','다카','Bangladesh','방글라데시'],['Asia/Kathmandu','Kathmandu','카트만두','Nepal','네팔'],['Asia/Tehran','Tehran','테헤란','Iran','이란'],['Asia/Riyadh','Riyadh','리야드','Saudi Arabia','사우디아라비아'],['Asia/Qatar','Doha','도하','Qatar','카타르'],['Asia/Tashkent','Tashkent','타슈켄트','Uzbekistan','우즈베키스탄'],['Asia/Almaty','Almaty','알마티','Kazakhstan','카자흐스탄'],['Asia/Ulaanbaatar','Ulaanbaatar','울란바토르','Mongolia','몽골'],['Europe/Madrid','Madrid','마드리드','Spain','스페인'],['Europe/Rome','Rome','로마','Italy','이탈리아'],['Europe/Amsterdam','Amsterdam','암스테르담','Netherlands','네덜란드'],['Europe/Brussels','Brussels','브뤼셀','Belgium','벨기에'],['Europe/Zurich','Zurich','취리히','Switzerland','스위스'],['Europe/Vienna','Vienna','빈','Austria','오스트리아'],['Europe/Stockholm','Stockholm','스톡홀름','Sweden','스웨덴'],['Europe/Warsaw','Warsaw','바르샤바','Poland','폴란드'],['Europe/Prague','Prague','프라하','Czechia','체코'],['Europe/Athens','Athens','아테네','Greece','그리스'],['Europe/Helsinki','Helsinki','헬싱키','Finland','핀란드'],['Europe/Lisbon','Lisbon','리스본','Portugal','포르투갈'],['Europe/Dublin','Dublin','더블린','Ireland','아일랜드'],['Atlantic/Reykjavik','Reykjavik','레이캬비크','Iceland','아이슬란드'],['Africa/Lagos','Lagos','라고스','Nigeria','나이지리아'],['Africa/Johannesburg','Johannesburg','요하네스버그','South Africa','남아프리카공화국'],['Africa/Nairobi','Nairobi','나이로비','Kenya','케냐'],['Africa/Casablanca','Casablanca','카사블랑카','Morocco','모로코'],['Africa/Addis_Ababa','Addis Ababa','아디스아바바','Ethiopia','에티오피아'],['America/Toronto','Toronto','토론토','Canada','캐나다'],['America/Vancouver','Vancouver','밴쿠버','Canada','캐나다'],['America/Denver','Denver','덴버','United States','미국'],['America/Phoenix','Phoenix','피닉스','United States','미국'],['America/Anchorage','Anchorage','앵커리지','United States','미국'],['America/Bogota','Bogotá','보고타','Colombia','콜롬비아'],['America/Lima','Lima','리마','Peru','페루'],['America/Santiago','Santiago','산티아고','Chile','칠레'],['America/Argentina/Buenos_Aires','Buenos Aires','부에노스아이레스','Argentina','아르헨티나'],['Australia/Perth','Perth','퍼스','Australia','호주'],['Australia/Melbourne','Melbourne','멜버른','Australia','호주'],['Australia/Brisbane','Brisbane','브리즈번','Australia','호주'],['Pacific/Fiji','Suva','수바','Fiji','피지'],['Pacific/Guam','Guam','괌','United States','미국']];
let cities=store.get('cities',['Asia/Seoul','America/New_York','Europe/London','Asia/Tokyo']);
const cname=tz=>{const c=CITIES.find(c=>c[0]===tz);return c?(lang==='ko'?c[2]:c[1]):tz};
const ccountry=tz=>{const c=CITIES.find(c=>c[0]===tz);return c?(lang==='ko'?c[4]:c[3]):''};
function wall(tz,d){const o={};new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'}).formatToParts(d).forEach(p=>o[p.type]=+p.value);return Date.UTC(o.year,o.month-1,o.day,o.hour,o.minute,o.second)}
function renderWorld(d=new Date()){
const loc=wall(Intl.DateTimeFormat().resolvedOptions().timeZone,d);
const list=cities.slice().sort((a,b)=>(b==='Asia/Seoul')-(a==='Asia/Seoul')),key=list.join('|')+lang;
if(key!==renderWorld.key){renderWorld.key=key;$('#worldList').innerHTML=list.map(tz=>`<div class="card ccard" data-tz="${esc(tz)}"><button class="x rm" data-rm="${esc(tz)}" aria-label="${t('del')}">&times;</button><div class="name">${esc(cname(tz))}</div><div class="country">${esc(ccountry(tz))}</div><div class="time"></div><div class="meta"></div></div>`).join('')}
$$('#worldList .ccard').forEach(c=>{
const tz=c.dataset.tz,diff=Math.round((wall(tz,d)-loc)/60000),a=Math.abs(diff);
const off=diff===0?t('local'):(diff>0?'+':'-')+Math.floor(a/60)+t('h')+(a%60?' '+(a%60)+t('m'):'');
const time=tf(tz,settings.seconds).format(d),meta=new Intl.DateTimeFormat(lang,{timeZone:tz,month:'long',day:'numeric',weekday:'short'}).format(d)+' · '+off;
const te=c.querySelector('.time'),me=c.querySelector('.meta');
if(te.textContent!==time)te.textContent=time;
if(me.textContent!==meta)me.textContent=meta;
})}
$('#worldList').onclick=e=>{const b=e.target.closest('[data-rm]');if(!b)return;cities=cities.filter(c=>c!==b.dataset.rm);store.set('cities',cities);fillCities();renderWorld()};
function fillCities(){if(!$('#cityResults').hidden)renderResults()}
function renderResults(){
const q=$('#citySearch').value.trim().toLowerCase(),box=$('#cityResults');
const list=CITIES.filter(c=>!cities.includes(c[0])&&(!q||c.slice(1).some(x=>x.toLowerCase().includes(q))));
box.innerHTML=list.length?list.map(c=>`<button type="button" data-add="${c[0]}"><span>${esc(lang==='ko'?c[2]:c[1])}<span class="country">${esc(lang==='ko'?c[4]:c[3])}</span></span><svg class="ic" aria-hidden="true"><use href="#i-plus"/></svg></button>`).join(''):`<div class="noresult">${t('noResult')}</div>`;
box.hidden=false;
}
$('#citySearch').addEventListener('input',renderResults);
$('#citySearch').addEventListener('focus',renderResults);
$('#cityResults').onclick=e=>{const b=e.target.closest('[data-add]');if(!b)return;if(!cities.includes(b.dataset.add)){cities.push(b.dataset.add);store.set('cities',cities)}$('#citySearch').value='';$('#cityResults').hidden=true;renderWorld()};
document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#cityResults').hidden=true});
let mainTz=store.get('mainTz','UTC');
const mainInfo=()=>mainTz==='UTC'?{name:'UTC',full:t('utcLabel')}:{name:cname(mainTz),full:cname(mainTz)+' · '+ccountry(mainTz)};
function applyMain(){
if(mainTz!=='UTC'&&!CITIES.some(c=>c[0]===mainTz))mainTz='UTC';
const m=mainInfo();$('#mainName').textContent=m.name;$('#mainLbl').textContent=m.full;
$('#mainClock').dataset.tz=mainTz;$('#mainDate').dataset.tz=mainTz;$('#alLbl').textContent=m.full;$('#alClock').dataset.tz=mainTz;$('#alDate').dataset.tz=mainTz;refresh();
}
function renderMain(){
const q=$('#mainSearch').value.trim().toLowerCase(),u=t('utcLabel').split(' · ')[1];
const items=((!q||'utc'.includes(q)||u.toLowerCase().includes(q))?[['UTC','UTC',u]]:[]).concat(CITIES.filter(c=>!q||c.slice(1).some(x=>x.toLowerCase().includes(q))).map(c=>[c[0],lang==='ko'?c[2]:c[1],lang==='ko'?c[4]:c[3]]));
$('#mainList').innerHTML=items.length?items.map(i=>`<button type="button" data-main="${esc(i[0])}"${i[0]===mainTz?' aria-current="true"':''}><span>${esc(i[1])}<span class="country">${esc(i[2])}</span></span></button>`).join(''):`<div class="noresult">${t('noResult')}</div>`;
}
$('#mainBtn').onclick=()=>{const m=$('#mainMenu');m.hidden=!m.hidden;if(!m.hidden){$('#mainSearch').value='';renderMain();$('#mainSearch').focus()}};
$('#mainSearch').addEventListener('input',renderMain);
$('#mainList').onclick=e=>{const b=e.target.closest('[data-main]');if(!b)return;mainTz=b.dataset.main;store.set('mainTz',mainTz);$('#mainMenu').hidden=true;applyMain()};
document.addEventListener('click',e=>{if(!e.target.closest('.mainpick'))$('#mainMenu').hidden=true});


/* ---------- alarm ---------- */
let alarms=store.get('alarms',[]),formDays=new Set();
const saveAlarms=()=>store.set('alarms',alarms);
const dayNames=()=>[...Array(7)].map((_,i)=>new Date(2023,0,1+i).toLocaleDateString(lang,{weekday:'short'}));
function renderDays(){$('#aDays').innerHTML=dayNames().map((n,i)=>`<button type="button" data-d="${i}" aria-pressed="${formDays.has(i)}">${n}</button>`).join('')}
$('#aDays').onclick=e=>{const b=e.target.closest('[data-d]');if(!b)return;const i=+b.dataset.d;formDays.has(i)?formDays.delete(i):formDays.add(i);renderDays()};
function fmtTime(hm){const[h,m]=hm.split(':').map(Number);return tf(null,false).format(new Date(2023,0,1,h,m))}
function renderAlarms(){
const dn=dayNames();
$('#alarmList').innerHTML=alarms.length?alarms.map(a=>{
const rep=!a.days.length?t('once'):a.days.length===7?t('everyday'):a.days.map(i=>dn[i]).join(' ');
return `<div class="card alarm ${a.on?'':'off'}"><div><div class="t">${fmtTime(a.time)}</div><div class="meta">${a.label?esc(a.label)+', ':''}${rep} · ${esc(sname(a.sound))}</div></div><div class="row"><input type="checkbox" class="sw" data-tg="${a.id}" ${a.on?'checked':''} aria-label="${t('alarm')}"><button class="x" data-del="${a.id}" aria-label="${t('del')}">&times;</button></div></div>`}).join(''):`<p class="note">${t('noAlarms')}</p>`}
$('#alarmList').onclick=e=>{const d=e.target.closest('[data-del]');if(d){alarms=alarms.filter(a=>a.id!==+d.dataset.del);saveAlarms();renderAlarms()}};
$('#alarmList').onchange=e=>{const g=e.target.closest('[data-tg]');if(!g)return;const a=alarms.find(a=>a.id===+g.dataset.tg);if(a){a.on=g.checked;a.last='';saveAlarms();renderAlarms();unlock()}};
$('#aAdd').onclick=()=>{const time=getAlarmTime();const al={time,label:$('#aLabel').value.trim(),days:[...formDays].sort(),sound:$('#aSound').value};alarms.push(Object.assign({id:Date.now(),on:true,last:''},al));recentAl=pushRecent('recentAl',recentAl,al,sameJ);renderRecent();alarms.sort((a,b)=>a.time.localeCompare(b.time));saveAlarms();$('#aLabel').value='';formDays.clear();renderDays();renderAlarms();unlock();try{if('Notification' in window&&Notification.permission==='default')Notification.requestPermission()}catch(e){}};
function checkAlarms(){
const n=new Date(wall(mainTz,new Date())),hm=pad(n.getUTCHours())+':'+pad(n.getUTCMinutes()),key=n.toISOString().slice(0,10)+hm;
alarms.forEach(a=>{if(a.on&&a.time===hm&&a.last!==key&&(!a.days.length||a.days.includes(n.getUTCDay()))){a.last=key;if(!a.days.length)a.on=false;saveAlarms();renderAlarms();ring(a.label||t('alarm'),true,a.sound)}});
snoozes=snoozes.filter(s=>{if(Date.now()>=s.at){ring(s.title,true,s.sound);return false}return true});
}

/* ---------- stopwatch ---------- */
let sw=Object.assign({run:false,start:0,base:0,laps:[]},store.get('sw',{}));
const saveSw=()=>store.set('sw',sw);
const swFmt=ms=>{const c=Math.floor(ms/10);return pad(Math.floor(c/6000))+':'+pad(Math.floor(c/100)%60)+'.'+pad(c%100)};
const swNow=()=>sw.base+(sw.run?Date.now()-sw.start:0);
function renderSw(){
$('#swTime').textContent=swFmt(swNow());
$('#swR').textContent=sw.run?t('stop'):t('start');$('#swR').className='round '+(sw.run?'stop':'go');
$('#swL').textContent=sw.run?t('lap'):t('reset');$('#swL').disabled=!sw.run&&swNow()===0;
const L=sw.laps,durs=L.map((x,i)=>x-(L[i-1]||0));
const best=Math.min(...durs),worst=Math.max(...durs);
$('#swLaps').innerHTML=L.length?durs.map((d,i)=>`<div class="lap ${L.length>2?(d===best?'best':d===worst?'worst':''):''}"><span>${t('lapN')} ${i+1}</span><span>${swFmt(d)}</span></div>`).reverse().join(''):'';
}
function swLoop(){renderSw();if(sw.run)requestAnimationFrame(swLoop)}
$('#swR').onclick=()=>{if(sw.run){sw.base=swNow();sw.run=false}else{sw.start=Date.now();sw.run=true;swLoop()}saveSw();renderSw()};
$('#swL').onclick=()=>{if(sw.run)sw.laps.push(swNow());else sw={run:false,start:0,base:0,laps:[]};saveSw();renderSw()};

/* ---------- timer ---------- */
const BASE_TITLE=document.title,CIRC=578;
let tm=Object.assign({run:false,end:0,left:0,total:0},store.get('timer',{}));
if(tm.run&&Date.now()>tm.end+60000)tm={run:false,end:0,left:0,total:0};
const saveTm=()=>store.set('timer',tm);
const tmFmt=ms=>{const s=Math.ceil(ms/1000);return pad(Math.floor(s/3600))+':'+pad(Math.floor(s/60)%60)+':'+pad(s%60)};
function renderTm(){
const active=tm.total>0;
$('#tmInputs').hidden=active;$('#tmText').hidden=!active;if(!active)syncWheels();
if(active){$('#tmText').textContent=tmFmt(tm.left);$('#tmRing').style.strokeDashoffset=CIRC*(1-tm.left/tm.total)}else $('#tmRing').style.strokeDashoffset=0;
$('#tmR').textContent=tm.run?t('pause'):active?t('resume'):t('start');$('#tmR').className='round '+(tm.run?'':'go');
$('#tmL').textContent=t('cancel');$('#tmL').disabled=!active;
document.title=tm.run?tmFmt(tm.left)+' | '+BASE_TITLE:BASE_TITLE;
}
function tmReset(){tm={run:false,end:0,left:0,total:0};saveTm();renderTm()}
function tmStart(){
if(!tm.total){const ms=(+$('#tH').value*3600+ +$('#tM').value*60+ +$('#tS').value)*1000;if(ms<=0)return;tm.total=tm.left=ms;recentTm=pushRecent('recentTm',recentTm,ms/1000,(a,b)=>a===b);renderRecent()}
tm.run=true;tm.end=Date.now()+tm.left;saveTm();unlock();renderTm();
}
$('#tmR').onclick=()=>{if(tm.run){tm.left=Math.max(0,tm.end-Date.now());tm.run=false;saveTm();renderTm()}else tmStart()};
$('#tmL').onclick=tmReset;
$('#presets').innerHTML=[1,5,10,15,25,30,60].map(m=>`<button class="pill" data-p="${m}"></button>`).join('');
$('#presets').onclick=e=>{const b=e.target.closest('[data-p]');if(!b)return;const m=+b.dataset.p;tmReset();$('#tH').value=Math.floor(m/60);$('#tM').value=m%60;$('#tS').value=0;tmStart()};
function tickTm(){if(!tm.run)return;tm.left=Math.max(0,tm.end-Date.now());if(tm.left===0){tmReset();ring(t('timeUp'),false,settings.timerSound)}else renderTm()}

/* ---------- timer dials ---------- */
const WH=40;
function mkWheel(el,max){
if(el===NOEL)return;
el.innerHTML='<div class="pad"></div>'+Array.from({length:max+1},(_,i)=>`<div class="wi" data-v="${i}">${pad(i)}</div>`).join('')+'<div class="pad"></div>';
el._v=0;
const mark=()=>{const o=el.querySelector('.wi.sel');if(o)o.classList.remove('sel');const it=el.querySelector('.wi[data-v="'+el._v+'"]');if(it)it.classList.add('sel');el.setAttribute('aria-valuenow',el._v)};
Object.defineProperty(el,'value',{get:()=>el._v,set:v=>{el._v=Math.max(0,Math.min(max,Math.floor(+v)||0));el.scrollTop=el._v*WH;mark()}});
el._sync=()=>{el.scrollTop=el._v*WH;mark()};
el.addEventListener('scroll',()=>{const v=Math.max(0,Math.min(max,Math.round(el.scrollTop/WH)));if(v!==el._v){el._v=v;mark()}});
el.addEventListener('click',e=>{const it=e.target.closest('.wi');if(it)el.value=+it.dataset.v});
let acc=0,buf='',bt;
el.addEventListener('wheel',e=>{e.preventDefault();acc+=e.deltaMode===1?e.deltaY*40:e.deltaY;if(Math.abs(acc)>=50){el.value=el._v+(acc>0?1:-1);acc=0}},{passive:false});
el.addEventListener('keydown',e=>{
if(/^\d$/.test(e.key)){e.preventDefault();clearTimeout(bt);buf=(buf+e.key).slice(-2);el.value=Math.min(max,+buf);bt=setTimeout(()=>{buf=''},1200);return}
const d=e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0;if(!d)return;e.preventDefault();el.value=el._v+d});
mark();
}
function syncWheels(){['#tH','#tM','#tS'].forEach(i=>$(i)._sync())}
mkWheel($('#tH'),99);mkWheel($('#tM'),59);mkWheel($('#tS'),59);$('#tM').value=5;

/* ---------- recently used (alarm + timer) ---------- */
const RMAX=10,sameJ=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let recentTm=store.get('recentTm',[]),recentAl=store.get('recentAl',[]);
const pushRecent=(key,arr,item,same)=>{const out=[item].concat(arr.filter(x=>!same(x,item))).slice(0,RMAX);store.set(key,out);return out};
function renderRecent(){
const dn=dayNames(),rt=$('#tmRecent'),ra=$('#alRecent');
rt.hidden=!recentTm.length;ra.hidden=!recentAl.length;
rt.querySelector('.rlist').innerHTML=recentTm.map(sec=>`<button type="button" class="pill" data-rt="${sec}">${tmFmt(sec*1000)}</button>`).join('');
ra.querySelector('.rlist').innerHTML=recentAl.map((a,i)=>`<button type="button" class="pill rchip" data-ra="${i}"><b>${fmtTime(a.time)}</b><small>${a.label?esc(a.label)+' · ':''}${!a.days.length?t('once'):a.days.length===7?t('everyday'):a.days.map(d=>dn[d]).join(' ')} · ${esc(sname(a.sound))}</small></button>`).join('');
}
$('#tmRecent').onclick=e=>{
if(e.target.closest('[data-clear]')){recentTm=[];store.set('recentTm',recentTm);renderRecent();return}
const b=e.target.closest('[data-rt]');if(!b)return;const sec=+b.dataset.rt;
tmReset();$('#tH').value=Math.floor(sec/3600);$('#tM').value=Math.floor(sec/60)%60;$('#tS').value=sec%60;tmStart();
};
$('#alRecent').onclick=e=>{
if(e.target.closest('[data-clear]')){recentAl=[];store.set('recentAl',recentAl);renderRecent();return}
const b=e.target.closest('[data-ra]');if(!b)return;const a=recentAl[+b.dataset.ra];if(!a)return;
setAlarmTime(a.time);$('#aLabel').value=a.label;formDays=new Set(a.days);renderDays();$('#aSound').value=SOUNDS[a.sound]?a.sound:'beep';
$('.addalarm').scrollIntoView({block:'center',behavior:'smooth'});
};

/* ---------- alarm time picker ---------- */
const AT={hm:'07:00'};
function readAlarmTime(){let h=+$('#aH').value;const m=+$('#aM').value;if(settings.hour==='12')h=h%12+($('#aAP').value==='pm'?12:0);return pad(h)+':'+pad(m)}
function getAlarmTime(){return AT.hm=readAlarmTime()}
const ampm=h=>{try{return new Intl.DateTimeFormat(lang,{hour:'numeric',hour12:true}).formatToParts(new Date(2023,0,1,h)).find(p=>p.type==='dayPeriod').value}catch(e){return h<12?'AM':'PM'}};
function buildAlarmTime(){
const [H,M]=AT.hm.split(':').map(Number),is12=settings.hour==='12';
$('#aH').innerHTML=(is12?Array.from({length:12},(_,i)=>i+1):Array.from({length:24},(_,i)=>i)).map(h=>`<option value="${h}">${is12?h:pad(h)}</option>`).join('');
$('#aM').innerHTML=Array.from({length:60},(_,i)=>`<option value="${i}">${pad(i)}</option>`).join('');
$('#aAP').innerHTML=`<option value="am">${ampm(9)}</option><option value="pm">${ampm(15)}</option>`;
$('#aAP').hidden=!is12;
$('#aH').value=is12?(H%12||12):H;$('#aM').value=M;$('#aAP').value=H>=12?'pm':'am';
}
function setAlarmTime(hm){AT.hm=hm;buildAlarmTime()}
['#aH','#aM','#aAP'].forEach(i=>$(i).addEventListener('change',()=>{AT.hm=readAlarmTime()}));

/* ---------- language & init ---------- */
function applyLang(){
document.documentElement.lang=lang;
$$('[data-i18n]').forEach(e=>e.textContent=t(e.dataset.i18n));
$$('[data-i18n-ph]').forEach(e=>e.placeholder=t(e.dataset.i18nPh));
$$('#presets [data-p]').forEach(b=>b.textContent=b.dataset.p+' '+t('minutes'));
if(typeof langLabel==='function')langLabel();
$$('.guide').forEach(g=>g.hidden=g.lang!==(lang==='ko'?'ko':'en'));
applySettings();
$('#aSound').innerHTML=soundOptions($('#aSound').value||'beep');$('#aSound').setAttribute('aria-label',t('sound'));$('#tSound').innerHTML=soundOptions(settings.timerSound);$('#tH').setAttribute('aria-label',t('hr'));$('#tM').setAttribute('aria-label',t('min'));$('#tS').setAttribute('aria-label',t('sec'));$('#aH').setAttribute('aria-label',t('hr'));$('#aM').setAttribute('aria-label',t('min'));
buildAlarmTime();fillCities();applyMain();renderDays();renderRecent();renderAlarms();renderSw();renderTm();
}
const langLabel=initLangMenu($('#langBtn'),()=>lang,l=>{lang=l;applyLang()});

applyLang();
{const hm=+((location.hash.match(/\d+/)||[])[0]);if(hm>0&&!tm.total){const m=Math.min(hm,5999);$('#tH').value=Math.floor(m/60);$('#tM').value=m%60;$('#tS').value=0}}
if(sw.run&&$('#swTime')!==NOEL)swLoop();
function tickNow(d=new Date()){$$('.nowclock').forEach(e=>{const x=tf(e.dataset.tz,settings.seconds).format(d);if(e.textContent!==x)e.textContent=x});$$('.nowdate').forEach(e=>{const o={year:'numeric',month:'long',day:'numeric',weekday:'short'};if(e.dataset.tz)o.timeZone=e.dataset.tz;const x=new Intl.DateTimeFormat(lang,o).format(d);if(e.textContent!==x)e.textContent=x})}
function refresh(){const d=new Date();tickNow(d);renderWorld(d)}
setInterval(()=>{refresh();checkAlarms();tickTm()},250);
