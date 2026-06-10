const BASE = {
  startCash: 1200,
  fixedAssets: 2800,
  debt: 1300,
  equity: 2700,
};

const DEFAULT_STATE = {
  sales: 5200,
  costRate: 52,
  sga: 1100,
  taxRate: 30,
  receivableDays: 40,
  inventoryDays: 35,
  payableDays: 30,
  capex: 450,
  debtChange: 100,
  dividend: 180,
};

const controls = [
  { key: "sales", label: "売上高", min: 800, max: 12000, step: 100, unit: "百万円" },
  { key: "costRate", label: "売上原価率", min: 20, max: 90, step: 1, unit: "%" },
  { key: "sga", label: "販管費", min: 100, max: 3500, step: 50, unit: "百万円" },
  { key: "taxRate", label: "税率", min: 0, max: 45, step: 1, unit: "%" },
  { key: "receivableDays", label: "売掛金の回収日数", min: 0, max: 150, step: 5, unit: "日" },
  { key: "inventoryDays", label: "在庫の保有日数", min: 0, max: 150, step: 5, unit: "日" },
  { key: "payableDays", label: "買掛金の支払日数", min: 0, max: 150, step: 5, unit: "日" },
  { key: "capex", label: "設備投資", min: 0, max: 3000, step: 50, unit: "百万円" },
  { key: "debtChange", label: "借入増減", min: -1200, max: 3000, step: 50, unit: "百万円" },
  { key: "dividend", label: "配当", min: 0, max: 1200, step: 50, unit: "百万円" },
];

const presets = {
  steady: {
    name: "堅実黒字",
    state: { ...DEFAULT_STATE },
  },
  cashCrunch: {
    name: "黒字資金難",
    state: {
      sales: 8200,
      costRate: 58,
      sga: 1650,
      taxRate: 30,
      receivableDays: 110,
      inventoryDays: 95,
      payableDays: 25,
      capex: 850,
      debtChange: 150,
      dividend: 120,
    },
  },
  turnaround: {
    name: "赤字改善中",
    state: {
      sales: 3600,
      costRate: 68,
      sga: 1250,
      taxRate: 30,
      receivableDays: 45,
      inventoryDays: 45,
      payableDays: 55,
      capex: 160,
      debtChange: -150,
      dividend: 0,
    },
  },
  investment: {
    name: "大型投資",
    state: {
      sales: 6400,
      costRate: 50,
      sga: 1400,
      taxRate: 30,
      receivableDays: 55,
      inventoryDays: 60,
      payableDays: 45,
      capex: 2400,
      debtChange: 1600,
      dividend: 80,
    },
  },
};

const journalExamples = [
  {
    title: "商品を現金で売り上げた",
    tag: "売上",
    short: "現金が増え、収益が増える",
    debit: { account: "現金", amount: 30000 },
    credit: { account: "売上", amount: 30000 },
    effects: {
      "P/L": "売上という収益が増え、利益が増えます。",
      "B/S": "現金という資産が増えます。",
      "覚える軸": "資産の増加は借方、収益の増加は貸方です。",
    },
    note: "現金売上は、P/LとB/Sの両方にすぐ表れます。",
  },
  {
    title: "商品を掛けで売り上げた",
    tag: "売掛金",
    short: "まだ入金されていない売上",
    debit: { account: "売掛金", amount: 50000 },
    credit: { account: "売上", amount: 50000 },
    effects: {
      "P/L": "売上という収益が増えます。",
      "B/S": "売掛金という資産が増えます。",
      "覚える軸": "入金前でも、商品を売った時点で売上を記録します。",
    },
    note: "掛け売上は、利益と現金がずれる入口です。",
  },
  {
    title: "商品を現金で仕入れた",
    tag: "仕入",
    short: "商品を買い、現金を払う",
    debit: { account: "仕入", amount: 20000 },
    credit: { account: "現金", amount: 20000 },
    effects: {
      "P/L": "仕入という費用が増え、利益を減らします。",
      "B/S": "現金という資産が減ります。",
      "覚える軸": "費用の増加は借方、資産の減少は貸方です。",
    },
    note: "簿記3級では、商品売買を売上と仕入で記録する三分法をよく使います。",
  },
  {
    title: "商品を掛けで仕入れた",
    tag: "買掛金",
    short: "まだ支払っていない仕入",
    debit: { account: "仕入", amount: 42000 },
    credit: { account: "買掛金", amount: 42000 },
    effects: {
      "P/L": "仕入という費用が増えます。",
      "B/S": "買掛金という負債が増えます。",
      "覚える軸": "費用の増加は借方、負債の増加は貸方です。",
    },
    note: "買掛金は、仕入先へ後で支払う義務です。",
  },
  {
    title: "現金を普通預金に預け入れた",
    tag: "現金、預金",
    short: "資産の中で置き場所が変わる",
    debit: { account: "普通預金", amount: 100000 },
    credit: { account: "現金", amount: 100000 },
    effects: {
      "P/L": "収益でも費用でもないため、利益は変わりません。",
      "B/S": "普通預金が増え、現金が減ります。",
      "覚える軸": "資産同士の移動なので、B/Sの中だけで動きます。",
    },
    note: "現金と預金はどちらも資産ですが、勘定科目は分けて記録します。",
  },
  {
    title: "水道光熱費を普通預金から支払った",
    tag: "費用",
    short: "費用が増え、預金が減る",
    debit: { account: "水道光熱費", amount: 12000 },
    credit: { account: "普通預金", amount: 12000 },
    effects: {
      "P/L": "水道光熱費という費用が増え、利益を減らします。",
      "B/S": "普通預金という資産が減ります。",
      "覚える軸": "費用の増加は借方、資産の減少は貸方です。",
    },
    note: "家賃、給料、通信費なども、費用の増加として借方に置きます。",
  },
  {
    title: "売掛金を現金で回収した",
    tag: "回収",
    short: "未回収の代金が現金になる",
    debit: { account: "現金", amount: 50000 },
    credit: { account: "売掛金", amount: 50000 },
    effects: {
      "P/L": "売上は前に記録済みなので、今回は利益に影響しません。",
      "B/S": "現金が増え、売掛金が減ります。",
      "覚える軸": "資産同士の入れ替わりです。",
    },
    note: "回収時にもう一度売上を立てると二重計上になります。",
  },
  {
    title: "買掛金を普通預金で支払った",
    tag: "支払",
    short: "未払いの仕入代金を払う",
    debit: { account: "買掛金", amount: 42000 },
    credit: { account: "普通預金", amount: 42000 },
    effects: {
      "P/L": "仕入は前に記録済みなので、今回は利益に影響しません。",
      "B/S": "買掛金という負債が減り、普通預金という資産も減ります。",
      "覚える軸": "負債の減少は借方、資産の減少は貸方です。",
    },
    note: "支払時にもう一度仕入を立てないことが大切です。",
  },
  {
    title: "決算で期末商品を繰り越した",
    tag: "決算",
    short: "売れ残りを資産に戻す",
    debit: { account: "繰越商品", amount: 18000 },
    credit: { account: "仕入", amount: 18000 },
    effects: {
      "P/L": "仕入から売れ残り分を差し引き、売上原価を整えます。",
      "B/S": "繰越商品という資産が残ります。",
      "覚える軸": "決算では、当期に対応する費用だけをP/Lに残します。",
    },
    note: "決算整理は、正しい利益と正しい財産を作るための調整です。",
  },
  {
    title: "決算で備品の減価償却をした",
    tag: "決算",
    short: "備品の価値減少を費用にする",
    debit: { account: "減価償却費", amount: 15000 },
    credit: { account: "備品減価償却累計額", amount: 15000 },
    effects: {
      "P/L": "減価償却費という費用が増え、利益を減らします。",
      "B/S": "備品の帳簿価額を間接的に減らします。",
      "覚える軸": "使った分だけ費用にする、という考え方です。",
    },
    note: "減価償却費は現金支出ではありませんが、P/Lでは費用になります。",
  },
];

const transactions = [
  {
    name: "掛けで商品を売る",
    tag: "売上",
    short: "売上は増えるが入金はまだ",
    effects: {
      "P/L": "売上と利益が増えます。",
      "B/S": "売掛金が増え、利益分だけ純資産も増えます。",
      "C/F": "現金入金前なので営業CFは弱くなります。",
    },
    note: "売上と現金収入は同じタイミングとは限りません。",
  },
  {
    name: "在庫を仕入れる",
    tag: "在庫",
    short: "現金が在庫に変わる",
    effects: {
      "P/L": "売れるまでは費用になりません。",
      "B/S": "現金が減り、棚卸資産が増えます。",
      "C/F": "営業CFのマイナスとして現れます。",
    },
    note: "在庫が積み上がると、利益が出る前に資金が重くなります。",
  },
  {
    name: "給料を支払う",
    tag: "費用",
    short: "利益と現金が同時に減る",
    effects: {
      "P/L": "販管費が増え、利益が減ります。",
      "B/S": "現金が減り、純資産も利益減少分だけ減ります。",
      "C/F": "営業CFのマイナスです。",
    },
    note: "費用の支払いはP/LとC/Fの両方に効きます。",
  },
  {
    name: "銀行から借りる",
    tag: "借入",
    short: "現金と負債が増える",
    effects: {
      "P/L": "借入そのものは売上でも利益でもありません。",
      "B/S": "現金と借入金が増えます。",
      "C/F": "財務CFのプラスです。",
    },
    note: "資金調達で現金は増えますが、返済義務も増えます。",
  },
  {
    name: "設備を買う",
    tag: "投資",
    short: "将来のために現金を使う",
    effects: {
      "P/L": "すぐ全額費用ではなく、減価償却費として少しずつ費用化します。",
      "B/S": "現金が減り、有形固定資産が増えます。",
      "C/F": "投資CFのマイナスです。",
    },
    note: "利益は残っていても、設備投資が大きいと現金は減ります。",
  },
  {
    name: "売掛金を回収する",
    tag: "回収",
    short: "売上済みのものが現金になる",
    effects: {
      "P/L": "すでに売上計上済みなら新しい売上は増えません。",
      "B/S": "売掛金が減り、現金が増えます。",
      "C/F": "営業CFのプラスです。",
    },
    note: "回収が進むと、P/Lは変わらなくても資金繰りは改善します。",
  },
  {
    name: "配当を支払う",
    tag: "配当",
    short: "利益の一部を外へ出す",
    effects: {
      "P/L": "配当は費用ではないため利益には出ません。",
      "B/S": "現金と純資産が減ります。",
      "C/F": "財務CFのマイナスです。",
    },
    note: "P/Lに出ない現金流出もあります。",
  },
  {
    name: "借入を返済する",
    tag: "返済",
    short: "負債と現金を減らす",
    effects: {
      "P/L": "元本返済は費用ではありません。利息だけが費用です。",
      "B/S": "現金と借入金が減ります。",
      "C/F": "財務CFのマイナスです。",
    },
    note: "返済で利益は減りませんが、現金は減ります。",
  },
];

const cases = [
  {
    key: "steady",
    title: "堅実黒字メーカー",
    label: "利益と現金がそろう",
    description: "利益率が安定し、回収日数と在庫日数も短めです。投資と借入のバランスも大きく崩れていません。",
    questions: [
      "営業CFは当期純利益より大きいか、小さいか。",
      "自己資本比率は安心できる水準か。",
      "設備投資後も現金は残っているか。",
    ],
  },
  {
    key: "cashCrunch",
    title: "売上急増の資金難",
    label: "黒字でも現金が足りない",
    description: "売上は伸びていますが、売掛金と在庫が膨らんでいます。利益と現金のずれを読む練習に向いています。",
    questions: [
      "P/Lだけを見たときの印象はどうか。",
      "営業CFが弱い原因は売掛金、在庫、買掛金のどれか。",
      "短期の資金繰りで最初に改善したい項目は何か。",
    ],
  },
  {
    key: "turnaround",
    title: "赤字改善中の会社",
    label: "利益体質の確認",
    description: "売上規模が小さく、原価率と販管費が重い状態です。P/Lのどこを改善すると黒字化するかを見ます。",
    questions: [
      "粗利率と販管費のどちらが重いか。",
      "借入返済を続ける余力はあるか。",
      "黒字化に必要な売上または原価率はどのくらいか。",
    ],
  },
  {
    key: "investment",
    title: "大型投資フェーズ",
    label: "成長投資と借入",
    description: "本業は黒字ですが、設備投資が大きく、借入で資金を補っています。投資CFと財務CFの関係を読みます。",
    questions: [
      "フリーCFはプラスかマイナスか。",
      "借入増加がなければ期末現金はどうなるか。",
      "投資後の自己資本比率はどの程度か。",
    ],
  },
];

const quiz = [
  {
    question: "黒字なのに現金が減っている会社で、まず確認したい表はどれですか。",
    options: ["C/F", "P/L", "株主名簿"],
    answer: 0,
    feedback: "C/Fを見ると、営業、投資、財務のどこで現金が減ったかを分けて確認できます。",
  },
  {
    question: "B/Sの基本式として正しいものはどれですか。",
    options: ["資産 = 負債 + 純資産", "売上 - 費用 = 現金", "営業CF = 売上 + 借入"],
    answer: 0,
    feedback: "B/Sは、会社が持つ資産を、負債と純資産でどう調達したかを見る表です。",
  },
  {
    question: "売掛金が急増すると、一般的に営業CFはどうなりやすいですか。",
    options: ["悪化しやすい", "必ず改善する", "まったく関係しない"],
    answer: 0,
    feedback: "売上を計上しても未回収なら現金は入っていないため、営業CFを押し下げます。",
  },
  {
    question: "設備投資の支出が主に出る場所はどこですか。",
    options: ["投資CF", "売上高", "純資産だけ"],
    answer: 0,
    feedback: "設備投資はC/Fでは投資CFのマイナス、B/Sでは固定資産として出ます。",
  },
  {
    question: "借入金の元本返済について正しいものはどれですか。",
    options: ["P/Lの費用ではなく、財務CFのマイナス", "売上原価になる", "営業利益を直接増やす"],
    answer: 0,
    feedback: "元本返済は利益計算には入りません。利息はP/L、元本返済はC/FとB/Sに出ます。",
  },
  {
    question: "商品を掛けで売り上げたときの仕訳として正しいものはどれですか。",
    options: ["借方 売掛金 / 貸方 売上", "借方 売上 / 貸方 売掛金", "借方 買掛金 / 貸方 仕入"],
    answer: 0,
    feedback: "まだ入金されていない売上なので、借方に売掛金、貸方に売上を記録します。",
  },
  {
    question: "普通預金から水道光熱費を支払ったとき、借方に置く勘定科目はどれですか。",
    options: ["水道光熱費", "普通預金", "売上"],
    answer: 0,
    feedback: "費用の増加は借方です。普通預金は資産の減少なので貸方に置きます。",
  },
  {
    question: "売掛金を現金で回収したとき、P/Lへの影響として正しいものはどれですか。",
    options: ["売上は増えない", "売上がもう一度増える", "仕入が減る"],
    answer: 0,
    feedback: "売上は掛け売上の時点で記録済みです。回収時は現金と売掛金の入れ替わりです。",
  },
  {
    question: "決算の目的として近いものはどれですか。",
    options: ["正しい利益と財産の状態をまとめる", "すべての現金を売上にする", "借方と貸方をなくす"],
    answer: 0,
    feedback: "決算では、期末整理をしてP/Lで利益、B/Sで財産の状態をまとめます。",
  },
];

const glossary = [
  { term: "仕訳", area: "簿記3級", body: "取引を借方と貸方に分けて記録することです。左右の金額は必ず一致します。" },
  { term: "借方", area: "簿記3級", body: "仕訳の左側です。資産の増加、費用の増加などを記録します。" },
  { term: "貸方", area: "簿記3級", body: "仕訳の右側です。負債や純資産の増加、収益の増加などを記録します。" },
  { term: "普通預金", area: "B/S", body: "銀行口座に預けているお金です。現金と同じく資産に分類されます。" },
  { term: "仕入", area: "P/L", body: "販売する商品を買ったときに使う費用の勘定です。決算で売上原価の計算に使います。" },
  { term: "収益", area: "P/L", body: "売上など、利益を増やす項目です。収益の増加は仕訳では貸方に置きます。" },
  { term: "費用", area: "P/L", body: "仕入、給料、水道光熱費など、利益を減らす項目です。費用の増加は借方に置きます。" },
  { term: "決算", area: "簿記3級", body: "期末に残高を整理し、損益計算書と貸借対照表を作る作業です。" },
  { term: "繰越商品", area: "B/S", body: "期末に売れ残った商品を翌期へ繰り越すための資産勘定です。" },
  { term: "減価償却費", area: "P/L", body: "建物や備品などを使った分だけ費用にする勘定です。現金支出とはタイミングがずれます。" },
  { term: "売上高", area: "P/L", body: "商品やサービスを提供して得た収益です。会社の規模を見る入口になります。" },
  { term: "売上原価", area: "P/L", body: "売上を作るために直接かかった費用です。原価率が高いと粗利が残りにくくなります。" },
  { term: "粗利", area: "P/L", body: "売上高から売上原価を引いた利益です。事業そのものの稼ぐ力を見ます。" },
  { term: "営業利益", area: "P/L", body: "本業で稼いだ利益です。粗利から販管費と減価償却費を引いて見ます。" },
  { term: "当期純利益", area: "P/L", body: "税金などを差し引いた最終利益です。B/Sの純資産にもつながります。" },
  { term: "現金", area: "B/S", body: "すぐ支払いに使える資産です。黒字でも現金が少ないと資金繰りは苦しくなります。" },
  { term: "売掛金", area: "B/S", body: "売上計上済みで、まだ入金されていないお金です。増えすぎると営業CFを圧迫します。" },
  { term: "棚卸資産", area: "B/S", body: "まだ売れていない在庫です。販売前にお金が固定されるため、増えすぎに注意します。" },
  { term: "買掛金", area: "B/S", body: "仕入先などへ後で支払うお金です。支払いを待てる分、短期的には現金を守ります。" },
  { term: "借入金", area: "B/S", body: "銀行などから借りているお金です。現金を増やしますが返済義務も増えます。" },
  { term: "純資産", area: "B/S", body: "返済不要の資金です。利益が積み上がると増え、配当や赤字で減ります。" },
  { term: "営業CF", area: "C/F", body: "本業から生まれた現金です。利益が現金になっているかを見る重要項目です。" },
  { term: "投資CF", area: "C/F", body: "設備投資や投資回収による現金増減です。成長投資が大きい会社ではマイナスになりやすいです。" },
  { term: "財務CF", area: "C/F", body: "借入、返済、配当など資金調達に関する現金増減です。" },
  { term: "フリーCF", area: "C/F", body: "営業CFから設備投資を引いた現金です。自由に使える現金の目安になります。" },
  { term: "運転資本", area: "3表", body: "売掛金と在庫から買掛金を差し引いた資金の重さです。増えると現金が減りやすくなります。" },
];

const STORAGE_KEY = "financial-statements-learning-tool-progress";

let state = { ...DEFAULT_STATE };
let activePreset = "steady";
let activeJournal = 0;
let activeTransaction = 0;
let activeCase = 0;
let quizIndex = 0;
let quizAnswers = Array(quiz.length).fill(null);
let completed = loadProgress();

const els = {
  controls: document.querySelector("#controls"),
  scenarioName: document.querySelector("#scenarioName"),
  headlineMetrics: document.querySelector("#headlineMetrics"),
  insightList: document.querySelector("#insightList"),
  ratioStrip: document.querySelector("#ratioStrip"),
  plTable: document.querySelector("#plTable"),
  bsTable: document.querySelector("#bsTable"),
  cfTable: document.querySelector("#cfTable"),
  barChart: document.querySelector("#barChart"),
  cashGapLabel: document.querySelector("#cashGapLabel"),
  currentUrl: document.querySelector("#currentUrl"),
  deviceMode: document.querySelector("#deviceMode"),
  offlineStatus: document.querySelector("#offlineStatus"),
  journalCards: document.querySelector("#journalCards"),
  journalTitle: document.querySelector("#journalTitle"),
  journalTag: document.querySelector("#journalTag"),
  journalEntry: document.querySelector("#journalEntry"),
  journalEffects: document.querySelector("#journalEffects"),
  journalNote: document.querySelector("#journalNote"),
  transactionCards: document.querySelector("#transactionCards"),
  transactionName: document.querySelector("#transactionName"),
  transactionTag: document.querySelector("#transactionTag"),
  transactionEffects: document.querySelector("#transactionEffects"),
  transactionNote: document.querySelector("#transactionNote"),
  caseCards: document.querySelector("#caseCards"),
  caseTitle: document.querySelector("#caseTitle"),
  caseDescription: document.querySelector("#caseDescription"),
  caseQuestions: document.querySelector("#caseQuestions"),
  loadCaseButton: document.querySelector("#loadCaseButton"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  quizScore: document.querySelector("#quizScore"),
  glossarySearch: document.querySelector("#glossarySearch"),
  glossaryList: document.querySelector("#glossaryList"),
  progressLabel: document.querySelector("#progressLabel"),
  progressFill: document.querySelector("#progressFill"),
};

function formatAmount(value) {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toLocaleString("ja-JP")}百万円`;
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}%`;
}

function formatDays(value) {
  return `${Math.round(value)}日`;
}

function formatYen(value) {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

function controlValue(control, value) {
  if (control.unit === "%") return `${value}%`;
  if (control.unit === "日") return `${value}日`;
  return formatAmount(value);
}

function calculate(current) {
  const sales = current.sales;
  const cogs = sales * (current.costRate / 100);
  const grossProfit = sales - cogs;
  const depreciation = BASE.fixedAssets * 0.08 + current.capex * 0.04;
  const operatingIncome = grossProfit - current.sga - depreciation;
  const debtForInterest = Math.max(BASE.debt + current.debtChange * 0.5, 0);
  const interest = debtForInterest * 0.025;
  const pretax = operatingIncome - interest;
  const tax = Math.max(pretax, 0) * (current.taxRate / 100);
  const netIncome = pretax - tax;

  const accountsReceivable = sales * (current.receivableDays / 365);
  const inventory = cogs * (current.inventoryDays / 365);
  const accountsPayable = cogs * (current.payableDays / 365);
  const workingCapitalIncrease = accountsReceivable + inventory - accountsPayable;

  const operatingCashFlow = netIncome + depreciation - workingCapitalIncrease;
  const investingCashFlow = -current.capex;
  const financingCashFlow = current.debtChange - current.dividend;
  const cashChange = operatingCashFlow + investingCashFlow + financingCashFlow;
  const endingCash = BASE.startCash + cashChange;

  const fixedAssets = Math.max(BASE.fixedAssets + current.capex - depreciation, 0);
  const debt = Math.max(BASE.debt + current.debtChange, 0);
  const equity = BASE.equity + netIncome - current.dividend;
  const assets = endingCash + accountsReceivable + inventory + fixedAssets;
  const liabilities = accountsPayable + debt;
  const currentAssets = endingCash + accountsReceivable + inventory;
  const currentLiabilities = accountsPayable;
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : Infinity;
  const equityRatio = assets !== 0 ? equity / assets : 0;
  const netMargin = sales !== 0 ? netIncome / sales : 0;
  const operatingMargin = sales !== 0 ? operatingIncome / sales : 0;
  const freeCashFlow = operatingCashFlow - current.capex;
  const cashConversionCycle = current.receivableDays + current.inventoryDays - current.payableDays;
  const balanceGap = assets - liabilities - equity;

  return {
    sales,
    cogs,
    grossProfit,
    depreciation,
    operatingIncome,
    interest,
    pretax,
    tax,
    netIncome,
    accountsReceivable,
    inventory,
    accountsPayable,
    workingCapitalIncrease,
    operatingCashFlow,
    investingCashFlow,
    financingCashFlow,
    cashChange,
    endingCash,
    fixedAssets,
    debt,
    equity,
    assets,
    liabilities,
    currentAssets,
    currentRatio,
    equityRatio,
    netMargin,
    operatingMargin,
    freeCashFlow,
    cashConversionCycle,
    balanceGap,
  };
}

function renderControls() {
  els.controls.innerHTML = controls
    .map((control) => {
      const value = state[control.key];
      return `
        <label class="control" for="${control.key}">
          <span class="control-label">
            <span>${control.label}</span>
            <span class="control-value" id="${control.key}Value">${controlValue(control, value)}</span>
          </span>
          <input
            id="${control.key}"
            data-key="${control.key}"
            type="range"
            min="${control.min}"
            max="${control.max}"
            step="${control.step}"
            value="${value}"
          />
        </label>
      `;
    })
    .join("");

  els.controls.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const key = event.currentTarget.dataset.key;
      state[key] = Number(event.currentTarget.value);
      activePreset = "custom";
      update();
    });
  });
}

function tableRows(rows) {
  return rows
    .map((row) => {
      const className = [row.total ? "total-row" : "", row.value < 0 ? "negative" : ""].filter(Boolean).join(" ");
      return `<tr class="${className}"><td>${row.label}</td><td>${formatAmount(row.value)}</td></tr>`;
    })
    .join("");
}

function renderStatements(model) {
  els.plTable.innerHTML = tableRows([
    { label: "売上高", value: model.sales },
    { label: "売上原価", value: -model.cogs },
    { label: "粗利", value: model.grossProfit, total: true },
    { label: "販管費", value: -state.sga },
    { label: "減価償却費", value: -model.depreciation },
    { label: "営業利益", value: model.operatingIncome, total: true },
    { label: "支払利息", value: -model.interest },
    { label: "税金", value: -model.tax },
    { label: "当期純利益", value: model.netIncome, total: true },
  ]);

  els.bsTable.innerHTML = tableRows([
    { label: "現金", value: model.endingCash },
    { label: "売掛金", value: model.accountsReceivable },
    { label: "棚卸資産", value: model.inventory },
    { label: "固定資産", value: model.fixedAssets },
    { label: "資産合計", value: model.assets, total: true },
    { label: "買掛金", value: model.accountsPayable },
    { label: "借入金", value: model.debt },
    { label: "負債合計", value: model.liabilities, total: true },
    { label: "純資産", value: model.equity, total: true },
  ]);

  els.cfTable.innerHTML = tableRows([
    { label: "営業CF", value: model.operatingCashFlow, total: true },
    { label: "投資CF", value: model.investingCashFlow, total: true },
    { label: "財務CF", value: model.financingCashFlow, total: true },
    { label: "現金増減", value: model.cashChange },
    { label: "期首現金", value: BASE.startCash },
    { label: "期末現金", value: model.endingCash, total: true },
  ]);
}

function renderSummary(model) {
  const name = presets[activePreset]?.name || "自由入力";
  els.scenarioName.textContent = name;

  const metrics = [
    {
      label: "当期純利益",
      value: formatAmount(model.netIncome),
      sub: `純利益率 ${formatPercent(model.netMargin * 100)}`,
    },
    {
      label: "営業CF",
      value: formatAmount(model.operatingCashFlow),
      sub: model.operatingCashFlow >= model.netIncome ? "利益が現金化" : "利益より現金が弱い",
    },
    {
      label: "フリーCF",
      value: formatAmount(model.freeCashFlow),
      sub: "営業CF - 設備投資",
    },
    {
      label: "期末現金",
      value: formatAmount(model.endingCash),
      sub: `現金増減 ${formatAmount(model.cashChange)}`,
    },
  ];

  els.headlineMetrics.innerHTML = metrics
    .map(
      (metric) => `
        <div class="metric">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <small>${metric.sub}</small>
        </div>
      `,
    )
    .join("");

  const insights = buildInsights(model);
  els.insightList.innerHTML = insights
    .map((insight) => `<div class="insight ${insight.level}">${insight.text}</div>`)
    .join("");

  const ratios = [
    { label: "営業利益率", value: formatPercent(model.operatingMargin * 100) },
    { label: "自己資本比率", value: formatPercent(model.equityRatio * 100) },
    { label: "流動比率", value: model.currentRatio === Infinity ? "-" : formatPercent(model.currentRatio * 100) },
    { label: "CCC", value: formatDays(model.cashConversionCycle) },
  ];
  els.ratioStrip.innerHTML = ratios
    .map((ratio) => `<div class="ratio"><span>${ratio.label}</span><strong>${ratio.value}</strong></div>`)
    .join("");
}

function buildInsights(model) {
  const insights = [];

  if (model.netIncome > 0 && model.operatingCashFlow < 0) {
    insights.push({
      level: "danger",
      text: "黒字ですが営業CFがマイナスです。売掛金や在庫に現金が吸われています。",
    });
  } else if (model.netIncome > 0 && model.operatingCashFlow >= model.netIncome) {
    insights.push({
      level: "good",
      text: "利益が営業CFに変わっています。P/LとC/Fの方向がそろっています。",
    });
  } else if (model.netIncome < 0) {
    insights.push({
      level: "danger",
      text: "最終赤字です。まずP/Lで粗利率と販管費の重さを確認します。",
    });
  } else {
    insights.push({
      level: "warn",
      text: "利益はありますが営業CFが利益を下回ります。運転資本の増加に注意します。",
    });
  }

  if (model.freeCashFlow < 0) {
    insights.push({
      level: "warn",
      text: "フリーCFがマイナスです。投資を借入や手元資金で支えている状態です。",
    });
  } else {
    insights.push({
      level: "good",
      text: "フリーCFがプラスです。本業と投資後にも現金が残っています。",
    });
  }

  if (model.endingCash < 0) {
    insights.push({
      level: "danger",
      text: "期末現金がマイナスです。追加資金、回収短縮、投資抑制の検討が必要です。",
    });
  } else if (model.currentRatio < 1) {
    insights.push({
      level: "warn",
      text: "流動比率が低めです。短期支払いに対する手元資金を確認します。",
    });
  } else if (model.equityRatio >= 0.45) {
    insights.push({
      level: "good",
      text: "自己資本比率は厚めです。借入依存は比較的抑えられています。",
    });
  }

  if (model.cashConversionCycle > 90) {
    insights.push({
      level: "warn",
      text: "CCCが長いです。売上から現金回収までの時間が資金繰りを重くしています。",
    });
  }

  return insights.slice(0, 4);
}

function renderBars(model) {
  const bars = [
    { label: "売上高", value: model.sales },
    { label: "営業利益", value: model.operatingIncome },
    { label: "当期純利益", value: model.netIncome },
    { label: "営業CF", value: model.operatingCashFlow },
    { label: "フリーCF", value: model.freeCashFlow },
    { label: "現金増減", value: model.cashChange },
  ];
  const max = Math.max(...bars.map((bar) => Math.abs(bar.value)), 1);

  els.cashGapLabel.textContent = `純利益との差 ${formatAmount(model.operatingCashFlow - model.netIncome)}`;
  els.barChart.innerHTML = bars
    .map((bar) => {
      const width = Math.max((Math.abs(bar.value) / max) * 50, 1);
      const isNegative = bar.value < 0;
      const style = isNegative
        ? `right: 50%; width: ${width}%;`
        : `left: 50%; width: ${width}%;`;
      return `
        <div class="bar-row">
          <div class="bar-label">${bar.label}</div>
          <div class="bar-track">
            <div class="bar-fill ${isNegative ? "negative" : "positive"}" style="${style}"></div>
          </div>
          <div class="bar-value">${formatAmount(bar.value)}</div>
        </div>
      `;
    })
    .join("");
}

function updateControlLabels() {
  controls.forEach((control) => {
    const input = document.querySelector(`#${control.key}`);
    const label = document.querySelector(`#${control.key}Value`);
    if (input) input.value = state[control.key];
    if (label) label.textContent = controlValue(control, state[control.key]);
  });
}

function update() {
  const model = calculate(state);
  updateControlLabels();
  renderSummary(model);
  renderStatements(model);
  renderBars(model);
}

function renderDeviceInfo() {
  const url = window.location.href;
  const host = window.location.hostname;
  const isLocalOnly = host === "127.0.0.1" || host === "localhost" || url.startsWith("file:");
  const isIphone = /iPhone|iPod/.test(navigator.userAgent);
  const canCacheOffline = "serviceWorker" in navigator && window.isSecureContext && !url.startsWith("file:");

  els.currentUrl.textContent = url;
  if (isIphone) {
    els.deviceMode.textContent = "iPhone";
  } else if (isLocalOnly) {
    els.deviceMode.textContent = "Mac専用URL";
  } else {
    els.deviceMode.textContent = "共有URL";
  }

  els.offlineStatus.textContent = canCacheOffline ? "保存可能" : "HTTPS公開で有効";
}

async function registerOfflineApp() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext || window.location.href.startsWith("file:")) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    if (registration.installing) {
      els.offlineStatus.textContent = "保存中";
    } else {
      els.offlineStatus.textContent = "保存済み";
    }

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      els.offlineStatus.textContent = "保存済み";
    });
  } catch {
    els.offlineStatus.textContent = "保存不可";
  }
}

function setPreset(key) {
  activePreset = key;
  state = { ...presets[key].state };
  update();
}

function switchSection(sectionId) {
  document.querySelectorAll(".lesson-section").forEach((section) => {
    section.classList.toggle("active", section.id === sectionId);
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.section === sectionId);
  });
}

function renderJournalCards() {
  els.journalCards.innerHTML = journalExamples
    .map(
      (journal, index) => `
        <button class="journal-card ${index === activeJournal ? "active" : ""}" data-index="${index}">
          <strong>${journal.title}</strong>
          <span>${journal.short}</span>
        </button>
      `,
    )
    .join("");

  els.journalCards.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeJournal = Number(button.dataset.index);
      renderJournalCards();
      renderJournalDetail();
    });
  });
}

function renderJournalDetail() {
  const journal = journalExamples[activeJournal];
  els.journalTitle.textContent = journal.title;
  els.journalTag.textContent = journal.tag;
  els.journalEntry.innerHTML = `
    <tr>
      <td>${journal.debit.account}</td>
      <td>${formatYen(journal.debit.amount)}</td>
      <td>${journal.credit.account}</td>
      <td>${formatYen(journal.credit.amount)}</td>
    </tr>
  `;
  els.journalEffects.innerHTML = Object.entries(journal.effects)
    .map(
      ([label, text]) => `
        <div class="effect">
          <strong>${label}</strong>
          <p>${text}</p>
        </div>
      `,
    )
    .join("");
  els.journalNote.textContent = journal.note;
}

function renderTransactions() {
  els.transactionCards.innerHTML = transactions
    .map(
      (transaction, index) => `
        <button class="transaction-card ${index === activeTransaction ? "active" : ""}" data-index="${index}">
          <strong>${transaction.name}</strong>
          <span>${transaction.short}</span>
        </button>
      `,
    )
    .join("");

  els.transactionCards.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeTransaction = Number(button.dataset.index);
      renderTransactions();
      renderTransactionDetail();
    });
  });
}

function renderTransactionDetail() {
  const transaction = transactions[activeTransaction];
  els.transactionName.textContent = transaction.name;
  els.transactionTag.textContent = transaction.tag;
  els.transactionEffects.innerHTML = Object.entries(transaction.effects)
    .map(
      ([statement, text]) => `
        <div class="effect">
          <strong>${statement}</strong>
          <p>${text}</p>
        </div>
      `,
    )
    .join("");
  els.transactionNote.textContent = transaction.note;
}

function renderCases() {
  els.caseCards.innerHTML = cases
    .map(
      (item, index) => `
        <button class="case-card ${index === activeCase ? "active" : ""}" data-index="${index}">
          <strong>${item.title}</strong>
          <span>${item.label}</span>
        </button>
      `,
    )
    .join("");

  els.caseCards.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeCase = Number(button.dataset.index);
      renderCases();
      renderCaseDetail();
    });
  });
}

function renderCaseDetail() {
  const item = cases[activeCase];
  els.caseTitle.textContent = item.title;
  els.caseDescription.textContent = item.description;
  els.caseQuestions.innerHTML = item.questions
    .map((question) => `<div class="question-item"><p>${question}</p></div>`)
    .join("");
}

function renderQuiz() {
  const item = quiz[quizIndex];
  els.quizQuestion.textContent = `${quizIndex + 1}. ${item.question}`;
  els.quizOptions.innerHTML = item.options
    .map((option, index) => {
      const answered = quizAnswers[quizIndex];
      const className =
        answered === null ? "" : index === item.answer ? "correct" : index === answered ? "incorrect" : "";
      return `<button class="${className}" data-index="${index}">${option}</button>`;
    })
    .join("");
  els.quizOptions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      quizAnswers[quizIndex] = Number(button.dataset.index);
      renderQuiz();
    });
  });

  const answered = quizAnswers[quizIndex];
  els.quizFeedback.textContent = answered === null ? "" : item.feedback;
  const score = quizAnswers.reduce((total, answer, index) => total + (answer === quiz[index].answer ? 1 : 0), 0);
  const answeredCount = quizAnswers.filter((answer) => answer !== null).length;
  els.quizScore.textContent = `${score} / ${answeredCount}`;
}

function renderGlossary() {
  const query = els.glossarySearch.value.trim().toLowerCase();
  const filtered = glossary.filter((item) => {
    const text = `${item.term} ${item.area} ${item.body}`.toLowerCase();
    return text.includes(query);
  });

  els.glossaryList.innerHTML = filtered
    .map(
      (item) => `
        <article class="glossary-item">
          <strong>${item.term}</strong>
          <span>${item.area}</span>
          <p>${item.body}</p>
        </article>
      `,
    )
    .join("");
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
}

function updateProgress() {
  const steps = ["simulator", "iphone", "bookkeeping", "map", "transactions", "cases", "quiz", "glossary"];
  const count = steps.filter((step) => completed.includes(step)).length;
  els.progressLabel.textContent = `${count}/${steps.length} 完了`;
  els.progressFill.style.width = `${(count / steps.length) * 100}%`;
  document.querySelectorAll(".complete-button").forEach((button) => {
    const done = completed.includes(button.dataset.complete);
    button.classList.toggle("done", done);
    button.textContent = done ? "完了済み" : "このステップを完了";
  });
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => switchSection(button.dataset.section));
  });

  document.querySelectorAll(".preset-button").forEach((button) => {
    button.addEventListener("click", () => setPreset(button.dataset.preset));
  });

  document.querySelector("#resetButton").addEventListener("click", () => setPreset("steady"));

  document.querySelectorAll(".complete-button").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.complete;
      completed = completed.includes(key) ? completed : [...completed, key];
      saveProgress();
      updateProgress();
    });
  });

  els.loadCaseButton.addEventListener("click", () => {
    const item = cases[activeCase];
    setPreset(item.key);
    switchSection("simulator");
  });

  document.querySelector("#prevQuiz").addEventListener("click", () => {
    quizIndex = Math.max(quizIndex - 1, 0);
    renderQuiz();
  });

  document.querySelector("#nextQuiz").addEventListener("click", () => {
    quizIndex = Math.min(quizIndex + 1, quiz.length - 1);
    renderQuiz();
  });

  els.glossarySearch.addEventListener("input", renderGlossary);
}

function init() {
  renderControls();
  renderDeviceInfo();
  registerOfflineApp();
  renderJournalCards();
  renderJournalDetail();
  renderTransactions();
  renderTransactionDetail();
  renderCases();
  renderCaseDetail();
  renderQuiz();
  renderGlossary();
  bindEvents();
  updateProgress();
  update();
}

init();
