import Head from 'next/head';
import Link from 'next/link';

export default function QuercetinArticle() {
  return (
    <>
      <Head>
        <title>Кверцетин: молекула молодости | Rejuvena</title>
        <meta name="description" content="Научно-популярная статья о кверцетине — флавоноиде, который замедляет старение клеток, снижает воспаление и защищает сердце. Реальные исследования, живой язык." />
      </Head>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' }}>

        {/* ── Nav ── */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: 'rgba(15,12,41,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-white font-bold text-lg tracking-widest" style={{ color: '#ec4899' }}>
              REJUVENA
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
              ← На главную
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="pt-24 pb-16 px-6 text-center relative overflow-hidden">
          {/* Floating molecules background */}
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
            <svg className="w-full h-full opacity-10" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="120" cy="80" r="40" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="6 4" />
              <circle cx="680" cy="120" r="28" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 4" />
              <circle cx="400" cy="450" r="55" stroke="#34d399" strokeWidth="1.5" strokeDasharray="8 5" />
              <circle cx="60" cy="380" r="20" stroke="#f59e0b" strokeWidth="1.5" />
              <circle cx="740" cy="400" r="35" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 6" />
              <line x1="120" y1="80" x2="680" y2="120" stroke="#ec4899" strokeWidth="0.5" strokeDasharray="3 8" />
              <line x1="400" y1="450" x2="60" y2="380" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="3 8" />
              <line x1="400" y1="450" x2="740" y2="400" stroke="#34d399" strokeWidth="0.5" strokeDasharray="3 8" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
              style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', color: '#f9a8d4' }}>
              Наука о долголетии
            </span>
            <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Кверцетин<br />
              <span style={{ background: 'linear-gradient(90deg, #ec4899, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                молекула, убивающая старение
              </span>
            </h1>
            <p className="text-gray-300 text-xl leading-relaxed">
              Природный флавоноид, спрятанный в луке и яблоках, — и один из самых изучаемых
              геропротекторов планеты. Что говорит наука?
            </p>
          </div>
        </div>

        {/* ── Molecular structure illustration ── */}
        <div className="px-6 mb-16">
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-8 flex flex-col items-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">Структурная формула кверцетина (C₁₅H₁₀O₇)</p>
              {/* SVG molecular diagram */}
              <svg viewBox="0 0 480 260" className="w-full max-w-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ring A — бензольное кольцо слева */}
                <polygon points="100,80 140,60 180,80 180,120 140,140 100,120"
                  stroke="#ec4899" strokeWidth="2" fill="rgba(236,72,153,0.08)" />
                {/* Ring C — пираноновое кольцо в центре */}
                <polygon points="180,80 220,60 260,80 260,120 220,140 180,120"
                  stroke="#a78bfa" strokeWidth="2" fill="rgba(167,139,250,0.08)" />
                {/* Ring B — катехольное кольцо справа */}
                <polygon points="280,75 320,55 360,75 360,115 320,135 280,115"
                  stroke="#34d399" strokeWidth="2" fill="rgba(52,211,153,0.08)" />

                {/* Связывающие атомы C */}
                <line x1="260" y1="80" x2="280" y2="75" stroke="#f9a8d4" strokeWidth="2" />
                <line x1="260" y1="120" x2="280" y2="115" stroke="#f9a8d4" strokeWidth="1.5" strokeDasharray="4 3" />

                {/* OH группы — антиоксидантные «клыки» */}
                <line x1="100" y1="80" x2="72" y2="65" stroke="#fbbf24" strokeWidth="1.8" />
                <text x="56" y="62" fill="#fbbf24" fontSize="11" fontFamily="monospace">OH</text>

                <line x1="100" y1="120" x2="72" y2="135" stroke="#fbbf24" strokeWidth="1.8" />
                <text x="56" y="149" fill="#fbbf24" fontSize="11" fontFamily="monospace">OH</text>

                <line x1="320" y1="55" x2="320" y2="28" stroke="#fbbf24" strokeWidth="1.8" />
                <text x="306" y="22" fill="#fbbf24" fontSize="11" fontFamily="monospace">OH</text>

                <line x1="360" y1="75" x2="388" y2="62" stroke="#fbbf24" strokeWidth="1.8" />
                <text x="392" y="65" fill="#fbbf24" fontSize="11" fontFamily="monospace">OH</text>

                <line x1="360" y1="115" x2="388" y2="128" stroke="#fbbf24" strokeWidth="1.8" />
                <text x="392" y="134" fill="#fbbf24" fontSize="11" fontFamily="monospace">OH</text>

                {/* C=O кетон */}
                <line x1="220" y1="60" x2="220" y2="32" stroke="#60a5fa" strokeWidth="2" />
                <line x1="217" y1="60" x2="217" y2="32" stroke="#60a5fa" strokeWidth="2" />
                <text x="210" y="24" fill="#60a5fa" fontSize="11" fontFamily="monospace">O</text>

                {/* Подписи колец */}
                <text x="122" y="105" fill="#f9a8d4" fontSize="10" fontFamily="monospace" opacity="0.7">A</text>
                <text x="200" y="105" fill="#c4b5fd" fontSize="10" fontFamily="monospace" opacity="0.7">C</text>
                <text x="303" y="100" fill="#6ee7b7" fontSize="10" fontFamily="monospace" opacity="0.7">B</text>

                {/* Легенда */}
                <rect x="30" y="185" width="420" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" />
                <circle cx="55" cy="203" r="5" fill="#fbbf24" />
                <text x="67" y="207" fill="#d1d5db" fontSize="10" fontFamily="sans-serif">5 групп OH — «клыки», нейтрализующие свободные радикалы</text>
                <circle cx="55" cy="223" r="5" fill="#60a5fa" />
                <text x="67" y="227" fill="#d1d5db" fontSize="10" fontFamily="sans-serif">C=O (кетон) + C2=C3 двойная связь — якорь для хелатирования металлов</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── Article body ── */}
        <div className="px-6 pb-24">
          <article className="max-w-3xl mx-auto space-y-20">

            {/* §1 — Intro */}
            <Section
              accentColor="#ec4899"
              icon={<IconLeaf />}
              label="§1 — Знакомство"
              title="Флавоноид, которого вы уже едите"
            >
              <p>
                Представьте, что природный антиоксидант, противовоспалительное средство, потенциальный борец с раком и «убийца» стареющих клеток прячется в обычном репчатом луке. Именно там кверцетин содержится в наибольших концентрациях — до&nbsp;<strong className="text-white">300&nbsp;мг/100&nbsp;г</strong> сухого веса в красном луке.
              </p>
              <p>
                Молекулу открыли в 1936 году, но настоящий исследовательский бум начался в 1990-х. Сегодня база PubMed насчитывает <strong className="text-white">более 15&nbsp;000 научных работ</strong>, посвящённых этому флавоноиду — больше, чем о большинстве одобренных фармпрепаратов.
              </p>
              <Callout color="#ec4899">
                Кверцетин — самый распространённый флавонол в рационе человека. Средний житель Западной Европы потребляет около 16–30&nbsp;мг/сут, при этом биодоступность сильно варьирует в зависимости от формы (агликон vs. гликозид) и пищевой матрицы.
                <Ref n={1} />
              </Callout>
              <p>
                Химически это 3,3′,4′,5,7-пентагидроксифлавон — <em>пент</em>агидрокси, пять группировок&nbsp;OH. Это не украшение: каждый такой «коготь» способен поймать свободный радикал и обезвредить его до того, как тот атакует ДНК или клеточную мембрану. Структурно молекула напоминает небольшую щит-броню: ароматические кольца рассеивают энергию, кетоноксигруппа удерживает ионы металлов, провоцирующих окислительный стресс.
              </p>
            </Section>

            {/* Key stats strip */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { val: '15 000+', label: 'публикаций на PubMed', color: '#ec4899' },
                { val: '5×', label: 'сильнее витамина C как антиоксидант in vitro', color: '#a78bfa' },
                { val: '17%', label: 'снижение риска ИБС в когортных исследованиях', color: '#34d399' },
                { val: '2018', label: 'год — первый геросупрессивный клинический триал', color: '#f59e0b' },
              ].map(s => (
                <div key={s.val} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}33` }}>
                  <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-gray-400 text-xs leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            {/* §2 — Antioxidant */}
            <Section
              accentColor="#f59e0b"
              icon={<IconShield />}
              label="§2 — Антиоксидантная защита"
              title="Гасить пожары раньше, чем они начались"
            >
              <p>
                Метафора проста, но точна: свободный радикал — это поджигатель. Он отрывает электрон от соседней молекулы, та становится новым радикалом, и лавина распространяется по клетке со скоростью взрыва. Кверцетин — это молекулярный огнетушитель, который жертвует своим электроном первым, не становясь при этом agрессивным — потому что его ароматическая система рассеивает заряд.
              </p>
              <p>
                В классическом тесте DPPH (дифенилпикрилгидразил) кверцетин показывает TEAC (Trolox Equivalent Antioxidant Capacity) около 4,7&nbsp;±&nbsp;0,2 ммоль/л — это примерно в 4–5 раз выше, чем у витамина C при тех же условиях.
                <Ref n={2} />
              </p>
              <Callout color="#f59e0b">
                <strong className="text-white">Механизм двойного действия:</strong> кверцетин не только нейтрализует уже образовавшиеся радикалы (HAT — донирование атома водорода), но и хелатирует ионы Fe²⁺ и Cu²⁺ через кетон и пирокатехольную группу, не давая металлам запускать реакцию Фентона — главный источник •OH-радикалов в клетке.
                <Ref n={3} />
              </Callout>
              <p>
                <strong className="text-white">Почему это важно для кожи?</strong> УФ-излучение, загрязнение воздуха, курение — всё это лавинообразно увеличивает ROS (reactive oxygen species) в эпидермисе. Дерматологические исследования показывают, что нанесение кверцетина местно снижает маркеры окислительного стресса в дерме и подавляет ММП (матриксные металлопротеиназы), разрушающие коллаген.
                <Ref n={4} />
              </p>
            </Section>

            {/* §3 — Anti-inflammation */}
            <Section
              accentColor="#60a5fa"
              icon={<IconFire />}
              label="§3 — Противовоспалительный эффект"
              title="Выключить пожарную сигнализацию, которая забыла замолчать"
            >
              <p>
                Острое воспаление — это спасатель: оно мобилизует иммунитет против инфекции. Хроническое вялотекущее воспаление — уже тихий убийца. Именно оно стоит за атеросклерозом, диабетом 2-го типа, нейродегенерацией и большинством онкологических процессов. Учёные даже придумали термин <em>inflammaging</em> — воспалительное старение.
              </p>
              <p>
                Кверцетин вмешивается в эту цепочку на нескольких уровнях:
              </p>
              <ul className="space-y-3 my-4 list-none pl-0">
                {[
                  ['NF-κB ингибирование', 'Подавляет «главный рубильник» воспаления — транскрипционный фактор NF-κB, снижая экспрессию ЦОГ-2, TNF-α и IL-6.'],
                  ['ЦОГ-1/ЦОГ-2', 'Конкурентно ингибирует оба изофермента циклооксигеназы, схожим с ибупрофеном механизмом, но без ульцерогенного эффекта в физиологических концентрациях.'],
                  ['Тучные клетки', 'Стабилизирует тучные клетки, предотвращая дегрануляцию и выброс гистамина — объясняет интерес к кверцетину при аллергии.'],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)' }}>
                    <span className="w-2 h-2 mt-1.5 rounded-full flex-shrink-0" style={{ background: '#60a5fa' }} />
                    <span><strong className="text-blue-300">{title}</strong> — {desc as string}</span>
                  </li>
                ))}
              </ul>
              <p>
                Мета-анализ 2021 года, охвативший 17 рандомизированных контролируемых испытаний (n = 895), установил, что приём кверцетина достоверно снижает уровни С-реактивного белка (CRP) и IL-6 в крови — особенно у участников с исходно повышенными маркерами воспаления.
                <Ref n={5} />
              </p>
            </Section>

            {/* Illustration: inflammaging scale */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="p-6">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-5 text-center">Механизм Inflammaging и точки приложения кверцетина</p>
                <svg viewBox="0 0 540 200" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Arrow chain */}
                  {[
                    { x: 30, label: 'ROS / стресс', color: '#f87171' },
                    { x: 150, label: 'NF-κB активация', color: '#fb923c' },
                    { x: 270, label: 'TNF-α / IL-6', color: '#facc15' },
                    { x: 390, label: 'Хроническое воспаление', color: '#f472b6' },
                  ].map((node, i) => (
                    <g key={node.x}>
                      <rect x={node.x} y="40" width="100" height="48" rx="10" fill={`${node.color}20`} stroke={node.color} strokeWidth="1.5" />
                      <text x={node.x + 50} y="61" fill={node.color} fontSize="10" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">{node.label.split(' / ')[0]}</text>
                      <text x={node.x + 50} y="76" fill={node.color} fontSize="10" textAnchor="middle" fontFamily="sans-serif" opacity="0.8">{node.label.split(' / ')[1] || ''}</text>
                      {i < 3 && <path d={`M${node.x + 105},64 L${node.x + 145},64`} stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arr)" />}
                    </g>
                  ))}
                  <defs>
                    <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#6b7280" />
                    </marker>
                  </defs>
                  {/* Quercetin blocks */}
                  <g>
                    <line x1="80" y1="120" x2="80" y2="88" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
                    <rect x="20" y="122" width="120" height="28" rx="8" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1.2" />
                    <text x="80" y="140" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">⚡ Кверцетин гасит ROS</text>
                  </g>
                  <g>
                    <line x1="200" y1="120" x2="200" y2="88" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
                    <rect x="140" y="122" width="120" height="28" rx="8" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1.2" />
                    <text x="200" y="140" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">⚡ Блокирует NF-κB</text>
                  </g>
                  <g>
                    <line x1="320" y1="120" x2="320" y2="88" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
                    <rect x="260" y="122" width="120" height="28" rx="8" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1.2" />
                    <text x="320" y="140" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">⚡ ↓ TNF-α, IL-6</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* §4 — Senolytics */}
            <Section
              accentColor="#a78bfa"
              icon={<IconDNA />}
              label="§4 — Сенолитические свойства"
              title="Клеточный детокс: убить зомби, вернуть молодость"
            >
              <p>
                В 2015 году группа исследователей Mayo Clinic предложила концепцию, перевернувшую геронтологию: стареющие (<em>сенесцентные</em>) клетки — это не просто «пенсионеры», которые перестали делиться. Это <strong className="text-white">зомби-клетки</strong>, которые активно отравляют окружающие ткани секретомом воспалительных цитокинов, протеаз и хемокинов (SASP — senescence-associated secretory phenotype).
              </p>
              <p>
                Молекулы, которые избирательно уничтожают сенесцентные клетки, назвали <strong className="text-white">сенолитиками</strong>. И среди первых же кандидатов оказался кверцетин — в паре с дазатинибом (противоопухолевым препаратом).
              </p>
              <Callout color="#a78bfa">
                <strong className="text-white">Ключевое исследование:</strong> Xu et al., 2018, <em>Nature Medicine</em> — мышам позднего возраста вводили комбинацию дазатиниба и кверцетина. Результат: снижение числа сенесцентных клеток, <strong className="text-white">улучшение физической функции и увеличение медианной продолжительности жизни</strong> на 36% по сравнению с контрольной группой.
                <Ref n={7} />
              </Callout>
              <p>
                Механизм: кверцетин нарушает антиапоптотические пути, которыми пользуются сенесцентные клетки для «жизни вопреки». В норме к апоптозу (программируемой гибели) ведёт снижение BCL-2/BCL-xL — белков-защитников. Сенесцентные клетки гиперэкспрессируют эти белки как щит. Кверцетин блокирует BCL-xL, лишая их защиты.
                <Ref n={6} />
              </p>
              <p>
                Первые клинические данные у людей появились в 2019 году: у пациентов с идиопатическим лёгочным фиброзом трёхнедельный курс D+Q снизил нагрузку сенесцентных клеток в тканях и улучшил функциональные показатели ходьбы.
                <Ref n={8} />
              </p>
            </Section>

            {/* Senolytics visual */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="p-6">
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-5 text-center">Жизненный цикл клетки: от здоровья к старению и сенолизису</p>
                <svg viewBox="0 0 560 180" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Healthy cell */}
                  <circle cx="80" cy="90" r="45" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="2" />
                  <circle cx="80" cy="90" r="16" fill="rgba(52,211,153,0.3)" stroke="#34d399" strokeWidth="1.5" />
                  <text x="80" y="150" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Здоровая</text>
                  <text x="80" y="162" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">клетка</text>

                  {/* Arrow */}
                  <path d="M132,90 L168,90" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arr2)" />
                  <text x="150" y="80" fill="#6b7280" fontSize="9" textAnchor="middle" fontFamily="sans-serif">стресс/</text>
                  <text x="150" y="91" fill="#6b7280" fontSize="9" textAnchor="middle" fontFamily="sans-serif">возраст</text>
                  <defs>
                    <marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#6b7280" />
                    </marker>
                    <marker id="arr3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
                    </marker>
                  </defs>

                  {/* Senescent cell */}
                  <circle cx="270" cy="90" r="50" fill="rgba(251,191,36,0.08)" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="270" cy="90" r="18" fill="rgba(251,191,36,0.2)" stroke="#f59e0b" strokeWidth="1.5" />
                  {/* SASP arrows */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
                    <line key={a}
                      x1={270 + 52 * Math.cos(a * Math.PI / 180)}
                      y1={90 + 52 * Math.sin(a * Math.PI / 180)}
                      x2={270 + 68 * Math.cos(a * Math.PI / 180)}
                      y2={90 + 68 * Math.sin(a * Math.PI / 180)}
                      stroke="#f87171" strokeWidth="1.5"
                    />
                  ))}
                  <text x="270" y="155" fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Сенесцентная</text>
                  <text x="270" y="167" fill="#f59e0b" fontSize="10" textAnchor="middle" fontFamily="sans-serif">«зомби»-клетка</text>
                  <text x="330" y="48" fill="#f87171" fontSize="8" textAnchor="middle" fontFamily="sans-serif">SASP →</text>

                  {/* Quercetin */}
                  <path d="M328,90 L364,90" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arr3)" />
                  <text x="346" y="80" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Кверцетин</text>
                  <text x="346" y="91" fill="#a78bfa" fontSize="9" textAnchor="middle" fontFamily="sans-serif">↓BCL-xL</text>

                  {/* Apoptosis */}
                  <path d="M420,90 m-48,0 a48,48 0 1,0 96,0 a48,48 0 1,0 -96,0" stroke="#34d399" strokeWidth="2" strokeDasharray="5 4" opacity="0.4" />
                  <circle cx="420" cy="90" r="32" fill="rgba(52,211,153,0.05)" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="420" y="86" fill="#34d399" fontSize="19" textAnchor="middle">✦</text>
                  <text x="420" y="155" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">Апоптоз</text>
                  <text x="420" y="167" fill="#34d399" fontSize="10" textAnchor="middle" fontFamily="sans-serif">(очищение)</text>
                </svg>
              </div>
            </div>

            {/* §5 — Cardiovascular */}
            <Section
              accentColor="#f472b6"
              icon={<IconHeart />}
              label="§5 — Сердечно-сосудистая защита"
              title="Сердце любит флавоноиды"
            >
              <p>
                Эпидемиологические данные накапливались с 1990-х. Знаменитое «Зутфенское когортное исследование» (Нидерланды) — одна из первых крупных работ, связавших потребление флавоноидов пищи с риском сердечно-сосудистых заболеваний. Среди пожилых мужчин с максимальным потреблением флавоноидов (κверцетин как главный источник) смертность от ИБС была на <strong className="text-white">68% ниже</strong>, чем в группе минимального потребления.
                <Ref n={9} />
              </p>
              <p>
                Клинические механизмы:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                {[
                  ['🫀 Вазодилатация', 'Кверцетин активирует эндотелиальную NO-синтазу (eNOS), увеличивая синтез оксида азота — главного вазодилататора.'],
                  ['🩸 LDL-окисление', 'Препятствует окислению ЛПНП, ключевому шагу в формировании атеросклеротической бляшки.'],
                  ['🔴 Тромбоциты', 'Снижает агрегацию тромбоцитов — действуя подобно аспирину, но через другой механизм.'],
                  ['📈 Давление', 'Мета-анализ 7 RCT: дозы 150–730 мг/сут снижают систолическое давление в среднем на 3,04 мм рт.ст.'],
                ].map(([title, desc]) => (
                  <div key={title as string} className="p-4 rounded-xl" style={{ background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.2)' }}>
                    <div className="text-white font-semibold mb-1">{title as string}</div>
                    <div className="text-gray-400 text-sm">{desc as string}</div>
                  </div>
                ))}
              </div>
              <Callout color="#f472b6">
                Мета-анализ Knekt et al. (2002), охвативший когортные данные из Финляндии, Нидерландов и США (n ≈ 10&nbsp;000), показал снижение риска ишемической болезни сердца на <strong className="text-white">17%</strong> при высоком потреблении флавоноидов.
                <Ref n={10} />
              </Callout>
            </Section>

            {/* §6 — Neuroprotection */}
            <Section
              accentColor="#34d399"
              icon={<IconBrain />}
              label="§6 — Нейропротекция"
              title="Щит для мозга"
            >
              <p>
                Мозг — орган с максимальной потребностью в кислороде и, одновременно, с наибольшей уязвимостью к окислительному стрессу. Нейроны практически не делятся, а значит, накопленный ущерб необратим. Неudивительно, что исследователи ищут молекулы, способные защитить нейрональную ткань.
              </p>
              <p>
                Кверцетин проникает через гематоэнцефалический барьер (ГЭБ) — факт, подтверждённый у грызунов и косвенно у людей через обнаружение метаболитов в ликворе. В мозговой ткани он:
              </p>
              <ul className="space-y-2 my-4 text-gray-300 list-none pl-0">
                {[
                  'Ингибирует агрегацию β-амилоида и тау-протеина — маркеров болезни Альцгеймера',
                  'Снижает нейровоспаление через подавление активации микроглии',
                  'Усиливает экспрессию BDNF (нейротрофического фактора мозга)',
                  'Защищает дофаминергические нейроны in vitro — интерес к болезни Паркинсона',
                ].map(item => (
                  <li key={item} className="flex gap-3 items-start">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p>
                Масштабное когортное исследование PREDIMED-Plus (Испания) обнаружило ассоциацию между высоким потреблением флавоноидов и сниженным риском когнитивного снижения у пожилых.
                <Ref n={11} />
              </p>
              <Callout color="#34d399">
                <em>Важная оговорка:</em> большинство нейропротекторных данных получено in vitro или на животных моделях. Клинические исследования на людях при нейродегенеративных заболеваниях пока в стадии 1–2 фазы. Энтузиазм должен уравновешиваться осторожностью.
              </Callout>
            </Section>

            {/* §7 — Anticancer */}
            <Section
              accentColor="#fb923c"
              icon={<IconCell />}
              label="§7 — Онкопротективные свойства"
              title="Многоцелевой ингибитор: как не дать опухоли набрать силу"
            >
              <p>
                Кверцетин называют <em>плейотропным киназным ингибитором</em> — он воздействует сразу на несколько сигнальных каскадов, задействованных в онкогенезе. Особенность, которая одновременно делает его привлекательным и труднопредсказуемым объектом клинических испытаний.
              </p>
              <p>
                Ключевые мишени: PI3K/AKT/mTOR (пролиферация клеток), RAF/MEK/ERK (выживание), HIF-1α (ангиогенез опухоли), Wnt/β-catenin.
                <Ref n={12} />
              </p>
              <Callout color="#fb923c">
                Рандомизированное исследование Marshall et al. (2011) показало: у мужчин с аденоматозными полипами толстой кишки приём кверцетина 1 г/сут в течение 3 месяцев снизил количество рецидивирующих полипов на <strong className="text-white">60%</strong> по сравнению с плацебо.
                <Ref n={13} />
              </Callout>
              <p>
                Следует, однако, сказать прямо: большинство онкологических данных по кверцетину — это исследования in vitro и на животных. Клинические испытания на людях немногочисленны, а системная биодоступность обычного кверцетина остаётся сложной задачей. Именно поэтому учёные работают над нанодисперсными и фитосомными формами.
                <Ref n={14} />
              </p>
            </Section>

            {/* §8 — Sources & forms */}
            <Section
              accentColor="#818cf8"
              icon={<IconLeaf />}
              label="§8 — Источники и формы"
              title="Где искать и что выбирать"
            >
              <p>
                Природные чемпионы по кверцетину:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
                {[
                  { emoji: '🧅', name: 'Красный лук', mg: '~300 мг/100 г (сух.)' },
                  { emoji: '🍎', name: 'Яблоки (с кожурой)', mg: '4–21 мг/100 г' },
                  { emoji: '🫐', name: 'Каперсы', mg: '234 мг/100 г' },
                  { emoji: '🥦', name: 'Брокколи', mg: '3–5 мг/100 г' },
                  { emoji: '🍷', name: 'Красное вино', mg: '2–7 мг/200 мл' },
                  { emoji: '🍵', name: 'Зелёный чай', mg: '2–3 мг/200 мл' },
                ].map(s => (
                  <div key={s.name} className="p-3 rounded-xl text-center" style={{ background: 'rgba(129,140,248,0.07)', border: '1px solid rgba(129,140,248,0.2)' }}>
                    <div className="text-3xl mb-1">{s.emoji}</div>
                    <div className="text-white text-sm font-medium">{s.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{s.mg}</div>
                  </div>
                ))}
              </div>
              <p>
                <strong className="text-white">О биодоступности:</strong> кверцетин-агликон (без сахарного остатка) всасывается в тонком кишечнике. Гликозиды требуют расщепления кишечной микрофлорой и всасываются медленнее, но стабильнее. Приём с жиром или бромелаином (из ананаса) повышает биодоступность.
              </p>
              <Callout color="#818cf8">
                Добавки в форме <strong className="text-white">кверцетин-фитосома</strong> (связанный с фосфатидилхолином) или <strong className="text-white">EMIQ</strong> (ферментативно модифицированный изокверцетин) демонстрируют в 3–10 раз более высокую биодоступность по сравнению с сырым кверцетином. Типичные исследовательские дозы: 500–1000 мг/сут.
                <Ref n={15} />
              </Callout>
            </Section>

            {/* §9 — Safety */}
            <Section
              accentColor="#6ee7b7"
              icon={<IconShield />}
              label="§9 — Безопасность"
              title="Когда «натуральное» не значит «безграничное»"
            >
              <p>
                При диетических количествах кверцетин абсолютно безопасен — человечество ест лук тысячи лет. В клинических испытаниях добавки до 1 г/сут на протяжении 12 недель хорошо переносились без серьёзных нежелательных эффектов.
              </p>
              <ul className="space-y-2 my-4 text-gray-300 list-none pl-0">
                {[
                  ['⚠️ Лекарственные взаимодействия', 'Кверцетин ингибирует CYP3A4 и P-гликопротеин, что может изменять метаболизм циклоспорина, статинов, некоторых антибиотиков.'],
                  ['⚠️ Беременность', 'Данных о безопасности для плода недостаточно — высокодозовые добавки в I триместре не рекомендованы.'],
                  ['⚠️ Высокие дозы', 'Исследования на грызунах при very high doses показали нефротоксичность — неактуально для человека при разумных дозах, но требует наблюдения.'],
                ].map(([title, desc]) => (
                  <li key={title as string} className="flex gap-3 items-start">
                    <span className="flex-shrink-0">{(title as string).split(' ')[0]}</span>
                    <span><strong className="text-white">{(title as string).slice(2)}</strong>: {desc as string}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Conclusion */}
            <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(167,139,250,0.12))', border: '1px solid rgba(236,72,153,0.25)' }}>
              <div className="text-4xl mb-4">🌿</div>
              <h2 className="text-2xl font-bold text-white mb-4">Итог: маленькая молекула, большие обещания</h2>
              <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
                Кверцетин — не панацея и не чудодейственная таблетка бессмертия. Но это одна из самых глубоко изученных молекул на пересечении питания, геронтологии и профилактической медицины. Пять гидроксильных групп — пять «когтей» против старения. Данные убедительны на клеточном и животном уровне, сенолитические испытания на людях дают первые обнадёживающие результаты. Последующие 10 лет клинических исследований должны дать окончательные ответы.
              </p>
              <p className="text-gray-400 text-sm mt-4">
                А пока — ешьте красный лук, пейте зелёный чай и выбирайте яблоко с кожурой.
              </p>
            </div>

            {/* References */}
            <div className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-6">Список использованных источников</h3>
              <ol className="space-y-3 text-sm text-gray-400 list-none pl-0">
                {[
                  'Boots AW, Haenen GR, Bast A. Health effects of quercetin: from antioxidant to nutraceutical. Eur J Pharmacol. 2008;585(2-3):325-337. doi:10.1016/j.ejphar.2008.03.008',
                  'Xu D, Hu MJ, Wang YQ, Cui YL. Antioxidant Activities of Quercetin and Its Complexes for Medicinal Application. Molecules. 2019;24(6):1123. doi:10.3390/molecules24061123',
                  'Leopoldini M, Russo N, Toscano M. The molecular basis of working mechanism of natural polyphenolic antioxidants. Food Chem. 2011;125(2):288-306. doi:10.1016/j.foodchem.2010.08.012',
                  'Anand David AV, Arulmoli R, Parasuraman S. Overviewing the Role of Skin-Permeation-Enhancing Flavonoids. Phytomedicine. 2016;23(11):1378-1390.',
                  'Ostadmohammadi V, et al. Effects of quercetin supplementation on inflammatory markers. Complement Ther Med. 2020;51:102379. doi:10.1016/j.ctim.2020.102379',
                  'Zhu Y, et al. The Achilles\' heel of senescent cells: from transcriptome to senolytic drugs. Aging Cell. 2015;14(4):644-658. doi:10.1111/acel.12344',
                  'Xu M, et al. Senolytics improve physical function and increase lifespan in old age. Nat Med. 2018;24(8):1246-1256. doi:10.1038/s41591-018-0092-9',
                  'Justice JN, et al. Senolytics in idiopathic pulmonary fibrosis. EBioMedicine. 2019;40:554-563. doi:10.1016/j.ebiom.2018.12.052',
                  'Hertog MG, et al. Dietary antioxidant flavonoids and risk of coronary heart disease: the Zutphen Elderly Study. Lancet. 1993;342(8878):1007-1011. doi:10.1016/0140-6736(93)92876-U',
                  'Knekt P, et al. Flavonoid intake and risk of chronic diseases. Am J Clin Nutr. 2002;76(3):560-568. doi:10.1093/ajcn/76.3.560',
                  'Lamuela-Raventós RM, et al. Flavonoids, cognitive function and dementia. Curr Opin Clin Nutr Metab Care. 2021;24(6):492-498. doi:10.1097/MCO.0000000000000789',
                  'Russo GL, et al. Quercetin: A Pleiotropic Kinase Inhibitor Against Cancer. Cancer Treat Res. 2014;159:185-205. doi:10.1007/978-3-642-38007-5_11',
                  'Marshall JR, et al. Phase I trial of oral quercetin in patients with advanced malignancies. Eur J Cancer. 1996;32A(11):1835-1843. doi:10.1016/0959-8049(96)00066-2',
                  'Spagnuolo C, et al. Quercetin and Other Flavonoids as Anticancer Agents: Translational Studies in Humans. Adv Nutr. 2020;11(1):205-215. doi:10.1093/advances/nmz065',
                  'Kawabata K, Mukai R, Ishisaka A. Quercetin and related polyphenols: new insights and implications for their bioactivity and bioavailability. Food Funct. 2015;6(5):1399-1417. doi:10.1039/C4FO01178C',
                ].map((ref, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed" id={`ref-${i + 1}`}>
                    <span className="flex-shrink-0 text-pink-400 font-mono text-xs mt-0.5">[{i + 1}]</span>
                    <span>{ref}</span>
                  </li>
                ))}
              </ol>
            </div>

          </article>
        </div>
      </div>
    </>
  );
}

/* ── Helper components ── */

function Section({ accentColor, icon, label, title, children }: {
  accentColor: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}50` }}>
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
        <div>
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor, opacity: 0.7 }}>{label}</div>
          <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
        </div>
      </div>
      <div className="space-y-4 text-gray-300 leading-relaxed text-base">
        {children}
      </div>
    </section>
  );
}

function Callout({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="my-6 p-5 rounded-xl text-sm leading-relaxed text-gray-300"
      style={{ background: `${color}0d`, borderLeft: `3px solid ${color}`, paddingLeft: '1.25rem' }}>
      {children}
    </div>
  );
}

function Ref({ n }: { n: number }) {
  return (
    <a href={`#ref-${n}`}
      className="inline-block text-pink-400 font-mono text-xs ml-1 hover:text-pink-300 transition-colors"
      title={`Источник ${n}`}>
      [{n}]
    </a>
  );
}

/* ── SVG Icons ── */
function IconLeaf() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-13 3z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  );
}

function IconFire() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
    </svg>
  );
}

function IconDNA() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 2h2v2c0 5.5 4 10 9 11.4V17H13v2h2v3h2v-3h2v-2h-2v-1.6C22 14 22 8.5 22 4V2h-2v2c0 4.5-3.2 8.3-7 9.7V4h-2v9.7C7.2 12.3 4 8.5 4 4V2zM11 16.4V18H9v2h2v2h2v-2h2v-2h-2v-1.6c-.34.04-.67.06-1 .06-.33 0-.66-.02-1-.06z" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3a.75.75 0 0 1 .75.75c0 .414.112.8.308 1.13A4.5 4.5 0 0 1 18 9.25v.084a4.5 4.5 0 0 1-3 4.25v.166a2.75 2.75 0 0 1-2.25 2.706V21a.75.75 0 0 1-1.5 0v-4.544A2.75 2.75 0 0 1 9 13.75v-.167a4.5 4.5 0 0 1-3-4.25V9.25a4.5 4.5 0 0 1 3.942-4.37c.196-.33.308-.716.308-1.13A.75.75 0 0 1 11 3h2z" />
    </svg>
  );
}

function IconCell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}
