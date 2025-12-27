
import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, 
  MinusCircle, 
  X, 
  Award, 
  BookOpen, 
  RefreshCcw, 
  CheckCircle2,
  Calendar,
  Quote,
  ChevronDown,
  ChevronLeft,
  Settings2,
  Library,
  ScrollText,
  Hash,
  Sparkles,
  Target,
  PenLine,
  Clock
} from 'lucide-react';
import { EntryType, LedgerEntry, AppState, ArchivedLedger } from './types';

const STORAGE_KEY = 'gong_guo_bu_wisdom_v2';

interface WisdomItem {
  text: string;
  note: string;
  category: '立命' | '改过' | '积善' | '谦德' | '修身';
}

// 精选《了凡四训》及格言联璧深度智慧库
const WISDOM_DATA: WisdomItem[] = [
  { text: "命由我作，福自己求。", note: "命运掌握在自己手中。通过修身、积德、改过，可以改变先天之命，感召后天之福。", category: "立命" },
  { text: "务要日日知非，日日改过。", note: "修行核心在于觉察。每日反思，若一天不觉过，则一天无进步；若觉而不改，则终生原地踏步。", category: "立命" },
  { text: "积善之家，必有余庆。", note: "善行具有长远的生命力。不仅惠及自身，更能感召天地阴阳之气，为子孙后代留下深厚的德泽。", category: "立命" },
  { text: "一切福田，不离方寸。", note: "方寸即是心。所有的福报源头都在内心。向外求者是枝叶，向内修者是根本。", category: "立命" },
  { text: "从前种种，譬如昨日死；以后种种，譬如今日生。", note: "放下对过去错误的沉溺与负罪。每一个觉醒的当下都是全新的生命起点，忏悔即是重生的开始。", category: "立命" },
  { text: "改过者，第一要发耻心。", note: "知耻近乎勇。意识到自己与圣贤同为人，却因私欲而蒙尘，这种不甘是改过最根本的驱动力。", category: "改过" },
  { text: "第二要发畏心。", note: "举头三尺有神明，因果报应纤毫不爽。心怀敬畏，则能在隐微处约束自己，不动恶念。", category: "改过" },
  { text: "第三要发勇心。", note: "改过如斩毒蛇，不可迟疑。要有壮士断腕的决心，不给习气留任何喘息和反复的机会。", category: "改过" },
  { text: "善有真有假，不可不辨。", note: "凡是利人的，就是真善；凡是利己的，就是假善。发于公心是真，陷于名利是假。", category: "积善" },
  { text: "随缘消旧业，更莫造新殃。", note: "遭遇逆境时，应视为偿还旧债。坦然受之，不再生起新的怨恨与报复，因果由此截断。", category: "积善" },
  { text: "为善而心不着善，其善乃大。", note: "行善而不挂碍于心，不求回报，不自诩功德。这种‘无相’的善，其功德深广如虚空。", category: "积善" },
  { text: "满招损，谦受益。", note: "自满者如倒扣之碗，装不下新甘露；谦虚者如深谷，能容纳天地之智与四方之福。", category: "谦德" },
  { text: "惟谦受福。", note: "谦卑是最高明的处世智慧。能低头者，才不会撞梁；能容人者，才会被人所容。", category: "谦德" },
  { text: "行有不得，皆反求诸己。", note: "遇到挫折或他人的不满时，不要向外推卸责任。向内观察自己的心念和言行，通常能找到解决的钥匙。", category: "修身" },
  { text: "莫以善小而不为，莫以恶小而为之。", note: "滴水成河，微光成炬。修行不在于惊天动地的大事，而在于对每一个细微念头的善恶把控。", category: "修身" },
  { text: "百善孝为先，论心不论事。", note: "孝道首重诚敬之心。如果只是物质上的供养而无敬意，则与饲养禽畜无异。", category: "积善" },
  { text: "静坐常思己过，闲谈莫论人非。", note: "管好自己的心与口。不将宝贵的精力浪费在评判他人上，而是集中于自身的净化与完善。", category: "修身" },
  { text: "凡人做善事，未有不从敬心而生者。", note: "‘敬’是众善之基。对万物有敬畏，对众生有尊重，行为自然端正，功德自然积累。", category: "积善" },
  { text: "志不立，天下无可成之事。", note: "修行需先立宏愿。没有明确的方向，所有的努力都是随波逐流；有了坚定的志向，逆风亦是助力。", category: "立命" },
  { text: "心不动，则无苦。", note: "苦乐皆由心生。当你的心不再随境而转，不再执着于得失，外境便再也无法伤害你。", category: "修身" },
  { text: "爱人者人恒爱之，敬人者人恒敬之。", note: "你所施予世界的，终将回到你身上。这是一场能量的闭环，善念是最好的护身符。", category: "积善" },
  { text: "去私欲，存天理。", note: "修行就是一个不断做减法的过程。减去贪婪、愤怒和偏见，原本清净慈悲的本性自然显现。", category: "改过" },
  { text: "大智若愚，大巧若拙。", note: "真正有智慧的人从不显露锋芒。谦下是一种极高的防御，也是一种极深的修养。", category: "谦德" },
  { text: "诚者，天之道也。", note: "不欺暗室，不罔良知。诚实面对自己的每一个念头，是通往天道、感召神明的唯一途径。", category: "修身" }
];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return { entries: [], targetMerit: 100, isInitialized: false, isFinished: false, archive: [] };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isNamingOpen, setIsNamingOpen] = useState(false);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false);
  const [isWisdomOpen, setIsWisdomOpen] = useState(false);
  
  const [currentQuote, setCurrentQuote] = useState<WisdomItem | null>(null);
  const [archiveTitle, setArchiveTitle] = useState('');
  const [selectedArchiveId, setSelectedArchiveId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<EntryType>('plus');
  const [inputText, setInputText] = useState('');
  const [tempTarget, setTempTarget] = useState('100');
  const [showFulfillment, setShowFulfillment] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const stats = useMemo(() => {
    const plusCount = state.entries.filter(e => e.type === 'plus').length;
    const minusCount = state.entries.filter(e => e.type === 'minus').length;
    const netScore = state.entries.reduce((acc, curr) => acc + (curr.type === 'plus' ? 1 : -1), 0);
    const progress = state.targetMerit > 0 ? Math.min(Math.max((netScore / state.targetMerit) * 100, 0), 100) : 0;
    return { plusCount, minusCount, netScore, progress };
  }, [state.entries, state.targetMerit]);

  const currentAnalysis = useMemo(() => {
    if (state.entries.length === 0) return { keywords: ['初心', '静谧'] };
    const allText = state.entries.map(e => e.content).join(' ');
    const words = allText.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    const counts: Record<string, number> = {};
    words.forEach(w => counts[w] = (counts[w] || 0) + 1);
    const keywords = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([word]) => word);
    return { keywords: keywords.length > 0 ? keywords : ['觉察', '自省'] };
  }, [state.entries]);

  useEffect(() => {
    if (state.isInitialized && !state.isFinished && stats.netScore >= state.targetMerit) {
      setState(prev => ({ ...prev, isFinished: true }));
      setShowFulfillment(true);
    }
  }, [stats.netScore, state.targetMerit, state.isInitialized]);

  const handleInitialize = () => {
    const val = parseInt(tempTarget);
    if (!isNaN(val) && val > 0) {
      setState(prev => ({ ...prev, targetMerit: val, isInitialized: true, isFinished: false, entries: [] }));
    }
  };

  const handleUpdateTarget = () => {
    const val = parseInt(tempTarget);
    if (!isNaN(val) && val > 0) {
      setState(prev => ({ ...prev, targetMerit: val }));
      setIsEditTargetOpen(false);
    }
  };

  const handleAddEntry = () => {
    if (!inputText.trim()) return;
    const newEntry: LedgerEntry = {
      id: Math.random().toString(36).substring(2, 9),
      type: modalType,
      content: inputText.trim(),
      timestamp: Date.now(),
    };
    
    const randomIdx = Math.floor(Math.random() * WISDOM_DATA.length);
    setCurrentQuote(WISDOM_DATA[randomIdx]);
    
    setState(prev => ({ ...prev, entries: [newEntry, ...prev.entries] }));
    setInputText('');
    setIsModalOpen(false);
    
    setTimeout(() => setIsWisdomOpen(true), 400);
  };

  const handleArchiveConfirm = () => {
    if (!archiveTitle.trim()) return;
    const startedAt = state.entries.length > 0 ? Math.min(...state.entries.map(e => e.timestamp)) : Date.now();
    const newArchive: ArchivedLedger = {
      id: Math.random().toString(36).substring(2, 9),
      title: archiveTitle.trim(),
      targetMerit: state.targetMerit,
      entries: [...state.entries],
      startedAt,
      completedAt: Date.now()
    };
    setState(prev => ({ ...prev, isFinished: false, entries: [], archive: [newArchive, ...prev.archive], isInitialized: false }));
    setArchiveTitle('');
    setIsNamingOpen(false);
    setShowFulfillment(false);
  };

  if (!state.isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-8 safe-pt safe-pb">
        <div className="w-full text-center space-y-12 animate-fadeIn">
          <div className="space-y-4">
            <h1 className="text-5xl font-light tracking-[0.3em] text-[#2c2c2c]">功过簿</h1>
            <p className="text-xs text-gray-400 tracking-[0.5em] font-light uppercase">Mindfulness & Liao-Fan's Wisdom</p>
          </div>
          <div className="bg-white p-10 rounded-2xl zen-shadow border border-[#f0eee4] space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold block">设定修行宏愿</label>
              <div className="flex items-center justify-center border-b border-[#b8860b] pb-2">
                <span className="text-gray-300 mr-2 text-xl">净功</span>
                <input type="number" inputMode="numeric" value={tempTarget} onChange={(e) => setTempTarget(e.target.value)} className="text-5xl text-center w-32 focus:outline-none font-light bg-transparent" placeholder="100" />
              </div>
            </div>
            <button onClick={handleInitialize} className="w-full py-5 bg-[#2c2c2c] text-[#fdfcf8] rounded-xl hover:opacity-90 active:scale-[0.98] transition-all tracking-[0.4em] text-sm font-medium">开启修行</button>
            <div className="flex flex-col space-y-3 pt-2">
              <button onClick={() => setIsLibraryOpen(true)} className="flex items-center justify-center space-x-2 text-[10px] text-[#b8860b] tracking-widest uppercase hover:opacity-70 transition-all">
                <Library size={12}/> <span>翻阅智慧宝库</span>
              </button>
              {state.archive.length > 0 && (
                <button onClick={() => setIsArchiveOpen(true)} className="flex items-center justify-center space-x-2 text-[10px] text-gray-400 tracking-widest uppercase">
                  <BookOpen size={12} /> <span>查看往昔史册</span>
                </button>
              )}
            </div>
          </div>
        </div>
        {isLibraryOpen && <WisdomLibraryOverlay onClose={() => setIsLibraryOpen(false)} />}
        {isArchiveOpen && <ArchiveOverlay state={state} selectedArchiveId={selectedArchiveId} setSelectedArchiveId={setSelectedArchiveId} setIsArchiveOpen={setIsArchiveOpen} selectedArchive={state.archive.find(a => a.id === selectedArchiveId)} />}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col safe-pt overflow-hidden">
      <header className="px-6 py-4 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-widest text-[#2c2c2c]">功过簿</h1>
          <p className="text-[9px] uppercase text-gray-300 tracking-[0.3em] mt-0.5">Mindfulness • Wisdom</p>
        </div>
        <div className="flex space-x-3 mb-1">
          <button onClick={() => setIsLibraryOpen(true)} className="p-2.5 bg-white rounded-full zen-shadow border border-[#f0eee4] text-[#b8860b] active:scale-90 transition-transform">
            <Library size={18} />
          </button>
          <button onClick={() => setState({ ...state, entries: [], targetMerit: 100, isInitialized: false, isFinished: false })} className="p-2.5 bg-white rounded-full zen-shadow border border-[#f0eee4] text-gray-300 active:scale-90 transition-transform">
            <RefreshCcw size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-6 pt-2 pb-32">
        <section onClick={() => { setTempTarget(state.targetMerit.toString()); setIsEditTargetOpen(true); }} className="bg-white zen-shadow border border-[#f0eee4] p-7 rounded-3xl relative overflow-hidden active:scale-[0.99] transition-transform cursor-pointer group">
          <div className="absolute top-4 right-4 text-gray-200 group-hover:text-[#b8860b] transition-colors">{state.isFinished ? <Award size={22} className="text-[#b8860b] animate-pulse" /> : <Settings2 size={16} />}</div>
          <div className="flex flex-col items-center space-y-4">
            <span className="text-[10px] tracking-[0.3em] text-gray-300 uppercase font-bold">修行进度</span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-6xl font-light transition-colors duration-500 ${stats.netScore >= 0 ? 'text-[#b8860b]' : 'text-[#9e2a2b]'}`}>{stats.netScore > 0 ? `+${stats.netScore}` : stats.netScore}</span>
              <span className="text-gray-200 text-lg">/ {state.targetMerit}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden mt-2"><div className="h-full bg-[#b8860b] transition-all duration-1000" style={{ width: `${stats.progress}%` }} /></div>
            <div className="flex justify-between w-full text-[10px] tracking-widest text-gray-400 font-medium px-1"><span>初心之旅</span><span className={state.isFinished ? 'text-[#b8860b]' : ''}>圆满大成</span></div>
          </div>
        </section>

        <div className="flex items-center justify-center py-2 space-x-2 opacity-30"><ChevronDown size={14} className="animate-gentle" /><span className="text-[10px] tracking-widest uppercase">本篇志异</span></div>

        <div className="space-y-4">
          {state.entries.length === 0 ? (
            <div className="py-24 text-center space-y-4 opacity-20"><Quote className="mx-auto text-gray-300" size={32} /><p className="text-gray-400 tracking-[0.4em] text-xs">此刻即是修行的开始</p></div>
          ) : (
            state.entries.map((entry) => (
              <div key={entry.id} className={`flex justify-between items-start p-5 bg-white zen-shadow border border-[#f0eee4] rounded-2xl animate-slideUp relative ${entry.type === 'plus' ? 'gold-border' : 'red-border'}`}>
                <div className="flex-1 pr-6">
                  <p className="text-[16px] text-[#2c2c2c] font-serif leading-relaxed mb-3 font-light">{entry.content}</p>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar size={11} /><p className="text-[11px] tracking-wider font-light uppercase">{new Date(entry.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })} • {new Date(entry.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <button onClick={() => setState({ ...state, entries: state.entries.filter(e => e.id !== entry.id) })} className="p-2 -mr-2 -mt-1 text-gray-100 hover:text-red-200 active:scale-90 transition-all"><X size={16} /></button>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 safe-pb pt-4 flex space-x-4 z-50">
        <button onClick={() => { setModalType('plus'); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center space-x-3 h-16 bg-white border border-[#b8860b]/30 rounded-2xl active:scale-95 transition-all shadow-sm"><PlusCircle className="text-[#b8860b]" size={22} /><span className="text-sm tracking-[0.2em] font-medium">记功</span></button>
        <button onClick={() => { setModalType('minus'); setIsModalOpen(true); }} className="flex-1 flex items-center justify-center space-x-3 h-16 bg-[#2c2c2c] text-white rounded-2xl active:scale-95 transition-all shadow-lg"><MinusCircle className="text-red-400" size={22} /><span className="text-sm tracking-[0.2em] font-medium">记过</span></button>
      </div>

      {isWisdomOpen && currentQuote && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsWisdomOpen(false)}></div>
          <div className="relative bg-[#fdfcf8] w-full max-w-sm rounded-[3rem] p-10 zen-shadow border border-[#f0eee4] animate-scaleUp overflow-hidden flex flex-col items-center">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
             <div className="text-[#b8860b]/20 mb-6"><ScrollText size={48} strokeWidth={1} /></div>
             <div className="space-y-6 text-center z-10">
                <div className="space-y-2">
                  <p className="text-[10px] text-[#b8860b] uppercase tracking-[0.5em] font-bold">—— {currentQuote.category}之智慧 ——</p>
                  <p className="text-2xl font-serif text-[#2c2c2c] leading-loose px-2">{currentQuote.text}</p>
                </div>
                <div className="pt-4 border-t border-[#f0eee4] space-y-3">
                  <p className="text-[9px] text-gray-300 tracking-[0.3em] uppercase">智慧解析</p>
                  <p className="text-xs text-gray-500 leading-relaxed text-justify px-2 font-light">{currentQuote.note}</p>
                </div>
             </div>
             <button onClick={() => setIsWisdomOpen(false)} className="mt-8 w-full py-4 border border-[#f0eee4] text-gray-400 rounded-2xl text-[10px] tracking-[0.5em] uppercase active:bg-white transition-all">受教而退</button>
          </div>
        </div>
      )}

      {isLibraryOpen && <WisdomLibraryOverlay onClose={() => setIsLibraryOpen(false)} />}
      {isArchiveOpen && <ArchiveOverlay state={state} selectedArchiveId={selectedArchiveId} setSelectedArchiveId={setSelectedArchiveId} setIsArchiveOpen={setIsArchiveOpen} selectedArchive={state.archive.find(a => a.id === selectedArchiveId)} />}
      
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-[#fdfcf8] w-full max-w-lg rounded-t-[2.5rem] sm:rounded-3xl p-8 pt-10 zen-shadow border-t border-[#f0eee4] animate-sheetUp shadow-2xl">
            <h3 className="text-xl tracking-[0.2em] font-medium mb-8 flex items-center">{modalType === 'plus' ? '录入善果' : '自省过失'}</h3>
            <textarea autoFocus value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder={modalType === 'plus' ? "此时此刻，做了什么好事？" : "诚实面对，记录下过失..."} className="w-full h-44 p-5 bg-white border border-gray-100 focus:outline-none focus:border-[#b8860b]/40 text-lg leading-relaxed resize-none mb-8 rounded-2xl font-light shadow-inner" style={{ fontSize: '16px' }} />
            <button onClick={handleAddEntry} disabled={!inputText.trim()} className={`w-full py-5 text-sm tracking-[0.4em] text-white rounded-2xl shadow-xl font-semibold uppercase ${modalType === 'plus' ? 'bg-[#b8860b]' : 'bg-[#9e2a2b]'} disabled:opacity-20`}>存入账簿</button>
          </div>
        </div>
      )}

      {isEditTargetOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsEditTargetOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 zen-shadow animate-slideUp">
            <div className="text-center space-y-8">
              <h3 className="text-lg tracking-widest font-medium">调整修行宏愿</h3>
              <div className="flex items-center justify-center border-b border-[#b8860b] pb-2">
                <span className="text-gray-300 mr-2 text-xl">净功</span>
                <input autoFocus type="number" inputMode="numeric" value={tempTarget} onChange={(e) => setTempTarget(e.target.value)} className="text-5xl text-center w-32 focus:outline-none font-light" />
              </div>
              <button onClick={handleUpdateTarget} className="w-full py-4 bg-[#2c2c2c] text-white rounded-xl text-sm tracking-widest active:scale-[0.98] transition-all">确立新愿</button>
            </div>
          </div>
        </div>
      )}

      {showFulfillment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto no-scrollbar bg-white safe-pt safe-pb px-8 text-center">
          <div className="w-full max-w-lg space-y-10 animate-fadeIn">
            <Award size={64} className="text-[#b8860b] mx-auto animate-bounce" />
            <h2 className="text-5xl font-serif tracking-[0.5em] text-[#b8860b]">圆满</h2>
            <div className="bg-[#fdfcf8] p-8 rounded-[3rem] border border-[#f0eee4] zen-shadow space-y-6">
               <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50">
                  <div><p className="text-[10px] text-gray-300 uppercase">善行累积</p><p className="text-3xl font-light text-[#b8860b]">{stats.plusCount}</p></div>
                  <div><p className="text-[10px] text-gray-300 uppercase">自省总数</p><p className="text-3xl font-light text-[#9e2a2b]">{stats.minusCount}</p></div>
               </div>
               <div className="space-y-2">
                 <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">修行关键词</p>
                 <div className="flex flex-wrap justify-center gap-2">
                    {currentAnalysis.keywords.map(w => <span key={w} className="px-3 py-1 bg-white text-[#b8860b] text-[10px] border border-[#b8860b]/10 rounded-full">{w}</span>)}
                 </div>
               </div>
            </div>
            <button onClick={() => setIsNamingOpen(true)} className="w-full py-6 bg-[#2c2c2c] text-white rounded-2xl shadow-xl flex items-center justify-center space-x-3 active:scale-95 transition-all">
              <BookOpen size={20} className="text-[#b8860b]" />
              <span className="text-sm tracking-[0.5em] font-bold uppercase">封存账簿</span>
            </button>
          </div>
        </div>
      )}

      {isNamingOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsNamingOpen(false)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[2rem] p-8 zen-shadow animate-slideUp">
            <h3 className="text-lg tracking-widest font-medium mb-6 text-center">请为本篇账簿命题</h3>
            <input autoFocus type="text" value={archiveTitle} onChange={(e) => setArchiveTitle(e.target.value)} placeholder="例如：春日修录" className="w-full text-center py-4 text-lg border-b border-[#f0eee4] focus:outline-none focus:border-[#b8860b] font-light mb-6" />
            <button onClick={handleArchiveConfirm} disabled={!archiveTitle.trim()} className="w-full py-4 bg-[#2c2c2c] text-white rounded-xl text-sm tracking-widest active:scale-95 transition-all disabled:opacity-20">确立成书</button>
          </div>
        </div>
      )}
    </div>
  );
};

const WisdomLibraryOverlay: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [filter, setFilter] = useState<string>('全部');
  const filteredData = filter === '全部' ? WISDOM_DATA : WISDOM_DATA.filter(i => i.category === filter);

  return (
    <div className="fixed inset-0 z-[200] bg-[#fdfcf8] flex flex-col animate-fadeIn safe-pt">
      <header className="px-6 py-4 flex justify-between items-center shrink-0 border-b border-gray-50">
        <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-[#2c2c2c] transition-colors"><ChevronLeft size={24} /></button>
        <h3 className="text-lg font-medium tracking-[0.3em]">法语宝库</h3>
        <div className="w-10"></div>
      </header>
      <div className="flex overflow-x-auto no-scrollbar px-6 py-4 space-x-3 shrink-0">
        {['全部', '立命', '改过', '积善', '谦德', '修身'].map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-5 py-2 rounded-full text-[10px] tracking-widest whitespace-nowrap transition-all uppercase font-bold border ${filter === cat ? 'bg-[#b8860b] text-white border-[#b8860b] shadow-md' : 'bg-white text-gray-400 border-gray-100'}`}>{cat}</button>
        ))}
      </div>
      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        <div className="space-y-6">
          {filteredData.map((item, idx) => (
            <div key={idx} className="bg-white p-7 rounded-[2rem] border border-[#f0eee4] zen-shadow group animate-slideUp">
              <div className="flex items-center space-x-2 mb-4"><Hash size={10} className="text-[#b8860b]" /><span className="text-[8px] text-gray-300 uppercase tracking-widest font-bold">{item.category}</span></div>
              <p className="text-xl font-serif text-[#2c2c2c] leading-loose mb-6">{item.text}</p>
              <div className="bg-[#fdfcf8] p-5 rounded-2xl border border-dashed border-[#f0eee4]">
                <p className="text-[10px] text-[#b8860b] uppercase tracking-widest mb-3 font-bold opacity-50">白话解析</p>
                <p className="text-xs text-gray-500 leading-relaxed font-light text-justify">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-8 pb-12 shrink-0 bg-white/50 backdrop-blur-sm border-t border-gray-50 text-center">
         <button onClick={onClose} className="w-full py-4 bg-[#2c2c2c] text-white rounded-2xl text-[10px] tracking-[0.4em] font-medium uppercase active:scale-95 transition-all">合上宝库</button>
      </footer>
    </div>
  );
};

const ArchiveOverlay: React.FC<{
  state: AppState;
  selectedArchiveId: string | null;
  setSelectedArchiveId: (id: string | null) => void;
  setIsArchiveOpen: (isOpen: boolean) => void;
  selectedArchive?: ArchivedLedger;
}> = ({ state, selectedArchiveId, setSelectedArchiveId, setIsArchiveOpen, selectedArchive }) => {
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-[80] bg-[#fdfcf8] flex flex-col animate-fadeIn safe-pt">
      <header className="px-6 py-4 flex justify-between items-center shrink-0 border-b border-gray-50">
        <button onClick={() => selectedArchiveId ? setSelectedArchiveId(null) : setIsArchiveOpen(false)} className="p-2 -ml-2 text-gray-400"><ChevronLeft size={24} /></button>
        <h3 className="text-lg font-medium tracking-widest uppercase">{selectedArchiveId ? '史册详情' : '功过史册'}</h3>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto no-scrollbar p-6">
        {!selectedArchiveId ? (
          <div className="space-y-4">
            {state.archive.map((arc) => (
              <div key={arc.id} onClick={() => setSelectedArchiveId(arc.id)} className="bg-white p-6 rounded-[2rem] border border-[#f0eee4] zen-shadow active:scale-[0.98] transition-all space-y-4 relative">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#b8860b]/5 rounded-bl-[2rem] flex items-center justify-center pt-2 pl-2"><BookOpen size={16} className="text-[#b8860b]/30" /></div>
                <div className="space-y-1"><p className="text-[10px] text-gray-400 uppercase tracking-widest">《账簿名》</p><p className="text-xl font-serif text-[#2c2c2c]">{arc.title}</p></div>
                <div className="flex items-center space-x-2 text-[10px] text-gray-300 tracking-wider"><Clock size={10} /><span>{formatDate(arc.startedAt)} - {formatDate(arc.completedAt)}</span></div>
                <div className="flex items-center space-x-4 pt-1">
                  <div className="flex items-center space-x-1"><span className="text-[10px] text-gray-300 uppercase">功</span><span className="text-sm font-medium text-[#b8860b]">{arc.entries.filter(e => e.type === 'plus').length}</span></div>
                  <div className="flex items-center space-x-1"><span className="text-[10px] text-gray-300 uppercase">过</span><span className="text-sm font-medium text-[#9e2a2b]">{arc.entries.filter(e => e.type === 'minus').length}</span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-slideUp">
            <div className="bg-[#fcfbf7] p-8 rounded-[2.5rem] border border-[#f0eee4] text-center space-y-6">
              <div className="space-y-2">
                <h4 className="text-3xl font-serif text-[#b8860b]">《{selectedArchive?.title}》</h4>
                <p className="text-[10px] text-gray-300 tracking-widest uppercase">修行周期: {formatDate(selectedArchive?.startedAt || 0)} 至 {formatDate(selectedArchive?.completedAt || 0)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
                <div><p className="text-[10px] text-gray-400 uppercase mb-1">积功</p><p className="text-xl font-light">{selectedArchive?.entries.filter(e => e.type === 'plus').length}</p></div>
                <div><p className="text-[10px] text-gray-400 uppercase mb-1">自省</p><p className="text-xl font-light">{selectedArchive?.entries.filter(e => e.type === 'minus').length}</p></div>
              </div>
            </div>
            <div className="space-y-4">
              {selectedArchive?.entries.map((entry) => (
                <div key={entry.id} className={`p-5 bg-white border border-[#f0eee4] rounded-2xl ${entry.type === 'plus' ? 'gold-border opacity-80' : 'red-border opacity-80'}`}>
                  <p className="text-[15px] text-[#2c2c2c] font-serif leading-relaxed mb-2 font-light">{entry.content}</p>
                  <p className="text-[10px] text-gray-300 tracking-wider font-bold">{new Date(entry.timestamp).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="p-8 pb-12 bg-white/50 backdrop-blur-sm border-t border-gray-50"><button onClick={() => selectedArchiveId ? setSelectedArchiveId(null) : setIsArchiveOpen(false)} className="w-full py-5 border border-[#f0eee4] rounded-2xl text-[10px] tracking-[0.5em] text-gray-400 uppercase active:bg-gray-50 font-bold transition-all">{selectedArchiveId ? '返回史册' : '合上史册'}</button></footer>
    </div>
  );
};

export default App;
