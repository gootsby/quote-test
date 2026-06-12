import { useMemo, useState } from "react";

const initialQuote = {
  quoteNo: "PS-260603-01",
  date: "2026. 6. 3",
  validUntil: "견적일로부터 14일",
  brand: "pole\nsimon",
  seller: {
    company: "주식회사 세르비레",
    address: "(04003) 서울시 마포구 월드컵로10길 49",
    ceo: "임민정",
    businessNo: "362-87-00063",
    contact: "이지혜 과장님 / 010-6385-9369",
  },
  buyer: {
    company: "주식회사 사이몬가드얼라이언스",
    address: "경기 하남시 미사강변한강로 135, 가 101",
    ceo: "김유진",
    businessNo: "727-88-03454",
    phone: "0507-1392-1828",
  },
  items: [
    {
      title: "소피 커브드 라운드 모듈 소파 3,200mm",
      memo: "정가 기준",
      price: 6840000,
      highlight: true,
    },
    {
      title: "B2B 할인 (-30%)",
      memo: "프로젝트 공급가",
      price: 4788000,
      highlight: false,
    },
    {
      title: "크바드라트 Tonus 4 / Vidar 4 선택 시",
      memo: "패브릭 변경 옵션",
      price: 4788000,
      highlight: false,
    },
    {
      title: "마젠타 Cream 선택 시 (추가 -20%)",
      memo: "최종 제안가",
      price: 3830400,
      highlight: false,
    },
  ],
  bank: "농협 / 317-0028-8820-11 / 주식회사 사이몬가드얼라이언스",
  note: "본 견적서에 명시되지 않은 내역 및 변경사항에 대해서는 별도 협의를 통해 추가 비용이 발생할 수 있습니다.",
};

const fieldLabels = {
  company: "업체명",
  address: "소재지",
  ceo: "대표자",
  businessNo: "사업자번호",
  contact: "담당자",
  phone: "대표전화",
};

function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(number);
}

function numberInput(value) {
  return Number(String(value).replace(/[^\d-]/g, "")) || 0;
}

function Field({ label, value, onChange, multiline = false }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className="field">
      <span>{label}</span>
      <Control value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function PartyEditor({ title, party, keys, onChange }) {
  return (
    <section className="panel-section">
      <div className="section-title">{title}</div>
      <div className="field-grid">
        {keys.map((key) => (
          <Field
            key={key}
            label={fieldLabels[key]}
            value={party[key] || ""}
            multiline={key === "address"}
            onChange={(value) => onChange(key, value)}
          />
        ))}
      </div>
    </section>
  );
}

function PartyBlock({ title, party, keys }) {
  return (
    <div className="party-block">
      <div className="party-heading">{title}</div>
      <div className="party-fields">
        {keys.map((key) => (
          <div className="party-row" key={key}>
            <div className="party-label">{fieldLabels[key]}</div>
            <div className="party-value">{party[key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function App() {
  const [quote, setQuote] = useState(initialQuote);

  const total = useMemo(
    () => quote.items.reduce((sum, item) => sum + numberInput(item.price), 0),
    [quote.items],
  );

  const updateQuote = (key, value) => {
    setQuote((current) => ({ ...current, [key]: value }));
  };

  const updateParty = (group, key, value) => {
    setQuote((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }));
  };

  const updateItem = (index, key, value) => {
    setQuote((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: key === "price" ? numberInput(value) : value } : item,
      ),
    }));
  };

  const addItem = () => {
    setQuote((current) => ({
      ...current,
      items: [...current.items, { title: "새 항목", memo: "세부 설명", price: 0, highlight: false }],
    }));
  };

  const removeItem = (index) => {
    setQuote((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const toggleHighlight = (index) => {
    setQuote((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, highlight: !item.highlight } : item,
      ),
    }));
  };

  return (
    <main className="app-shell">
      <aside className="editor-panel" aria-label="견적서 편집">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Quote Builder</p>
            <h1>견적서 편집</h1>
          </div>
          <button className="primary-action" type="button" onClick={() => window.print()}>
            PDF 저장
          </button>
        </div>

        <section className="panel-section">
          <div className="section-title">기본 정보</div>
          <div className="field-grid two">
            <Field label="견적번호" value={quote.quoteNo} onChange={(value) => updateQuote("quoteNo", value)} />
            <Field label="견적일" value={quote.date} onChange={(value) => updateQuote("date", value)} />
            <Field
              label="유효기간"
              value={quote.validUntil}
              onChange={(value) => updateQuote("validUntil", value)}
            />
            <Field label="브랜드" value={quote.brand} multiline onChange={(value) => updateQuote("brand", value)} />
          </div>
        </section>

        <PartyEditor
          title="공급자"
          party={quote.seller}
          keys={["company", "address", "ceo", "businessNo", "contact"]}
          onChange={(key, value) => updateParty("seller", key, value)}
        />

        <PartyEditor
          title="고객사"
          party={quote.buyer}
          keys={["company", "address", "ceo", "businessNo", "phone"]}
          onChange={(key, value) => updateParty("buyer", key, value)}
        />

        <section className="panel-section">
          <div className="section-title with-action">
            <span>견적 항목</span>
            <button className="ghost-action" type="button" onClick={addItem}>
              항목 추가
            </button>
          </div>
          <div className="item-editor-list">
            {quote.items.map((item, index) => (
              <div className="item-editor" key={`${item.title}-${index}`}>
                <div className="item-editor-top">
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <label className="toggle">
                    <input type="checkbox" checked={item.highlight} onChange={() => toggleHighlight(index)} />
                    강조
                  </label>
                  <button className="text-action" type="button" onClick={() => removeItem(index)}>
                    삭제
                  </button>
                </div>
                <Field label="항목명" value={item.title} onChange={(value) => updateItem(index, "title", value)} />
                <Field label="메모" value={item.memo} onChange={(value) => updateItem(index, "memo", value)} />
                <Field label="금액" value={String(item.price)} onChange={(value) => updateItem(index, "price", value)} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel-section">
          <div className="section-title">하단 정보</div>
          <Field label="계좌" value={quote.bank} onChange={(value) => updateQuote("bank", value)} />
          <Field label="비고" value={quote.note} multiline onChange={(value) => updateQuote("note", value)} />
        </section>
      </aside>

      <section className="preview-zone" aria-label="A4 견적서 미리보기">
        <article className="a4-page">
          <header className="quote-header">
            <div className="brand-mark" aria-label="pole simon">
              {quote.brand.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
            <div className="quote-meta">
              <div>
                <span>견적번호</span>
                <strong>{quote.quoteNo}</strong>
              </div>
              <div>
                <span>견적일</span>
                <strong>{quote.date}</strong>
              </div>
              <div>
                <span>유효기간</span>
                <strong>{quote.validUntil}</strong>
              </div>
            </div>
          </header>

          <section className="party-grid">
            <PartyBlock
              title="공급자"
              party={quote.seller}
              keys={["company", "address", "ceo", "businessNo", "contact"]}
            />
            <PartyBlock
              title="고객사"
              party={quote.buyer}
              keys={["company", "address", "ceo", "businessNo", "phone"]}
            />
          </section>

          <section className="items-section">
            <div className="table-head">
              <span>Item Descriptions</span>
              <span>Price</span>
            </div>
            <div className="items-list">
              {quote.items.map((item, index) => (
                <div className={`quote-item ${item.highlight ? "is-highlight" : ""}`} key={`${item.title}-print-${index}`}>
                  <div>
                    <p>{item.title}</p>
                    <span>{item.memo}</span>
                  </div>
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
              ))}
            </div>
          </section>

          <footer className="quote-footer">
            <div className="bank-box">
              <span>Bank Account</span>
              <strong>{quote.bank}</strong>
            </div>
            <div className="total-box">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <p className="notice">* {quote.note}</p>
          </footer>
        </article>
      </section>
    </main>
  );
}
