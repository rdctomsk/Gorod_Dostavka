"use client";

import { FormEvent, useMemo, useState } from "react";

type Order = {
  id: string;
  client: string;
  route: string;
  courier: string;
  status: "Новый" | "Назначен" | "В пути" | "Доставлен";
  amount: number;
};

const initialOrders: Order[] = [
  { id: "12876", client: "Иван Петров", route: "Ленина, 30 → Фрунзе, 103", courier: "Алексей С.", status: "В пути", amount: 1890 },
  { id: "12875", client: "Мария Смирнова", route: "Кирова, 12 → Елизаровых, 45", courier: "Не назначен", status: "Новый", amount: 2350 },
  { id: "12874", client: "ООО «Сибирь»", route: "Мира, 41 → Учебная, 8", courier: "Екатерина М.", status: "Назначен", amount: 3120 },
  { id: "12873", client: "Андрей Васильев", route: "Нахимова, 15 → Комсомольский, 70", courier: "Сергей Л.", status: "Доставлен", amount: 1450 },
  { id: "12872", client: "Ольга Кузнецова", route: "Белинского, 20 → Иркутский, 91", courier: "Не назначен", status: "Новый", amount: 980 },
  { id: "12871", client: "Дмитрий Волков", route: "Советская, 46 → Бердская, 18", courier: "Дмитрий К.", status: "В пути", amount: 2760 },
  { id: "12870", client: "Елена Соколова", route: "Киевская, 60 → Гагарина, 7", courier: "Екатерина М.", status: "Доставлен", amount: 1670 },
];

const couriers = [
  { initials: "АС", name: "Алексей Смирнов", state: "На линии", color: "green" },
  { initials: "ДК", name: "Дмитрий Ковалёв", state: "Доставляет", color: "blue" },
  { initials: "ЕМ", name: "Екатерина Морозова", state: "Доставляет", color: "blue" },
  { initials: "СЛ", name: "Сергей Лебедев", state: "На линии", color: "green" },
  { initials: "НИ", name: "Никита Ильин", state: "Перерыв", color: "orange" },
];

const nav = [
  ["▦", "Обзор"],
  ["▤", "Заказы"],
  ["◉", "Курьеры"],
  ["⌁", "Транспорт"],
  ["◎", "Клиенты"],
  ["▥", "Выплаты"],
  ["◫", "Аналитика"],
  ["⚙", "Настройки"],
];

function rub(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

export default function Home() {
  const [active, setActive] = useState("Обзор");
  const [filter, setFilter] = useState("Все");
  const [orders, setOrders] = useState(initialOrders);
  const [dialog, setDialog] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleOrders = useMemo(
    () => filter === "Все" ? orders : orders.filter((order) => order.status === filter),
    [filter, orders],
  );

  function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextId = String(Math.max(...orders.map((order) => Number(order.id))) + 1);
    setOrders((current) => [{
      id: nextId,
      client: String(data.get("client")),
      route: `${data.get("from")} → ${data.get("to")}`,
      courier: "Не назначен",
      status: "Новый",
      amount: Number(data.get("amount")),
    }, ...current]);
    setDialog(false);
    setNotice(`Заказ №${nextId} создан`);
    setTimeout(() => setNotice(""), 2800);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">→</span>
          <span>Городская<br />доставка</span>
        </div>
        <nav>
          {nav.map(([icon, label]) => (
            <button className={active === label ? "nav-item active" : "nav-item"} key={label} onClick={() => setActive(label)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <button className="new-order mobile-hide" onClick={() => setDialog(true)}>＋ Новый заказ</button>
        <div className="support">Поддержка<br /><b>8 (3822) 123-45-67</b></div>
      </aside>

      <section className="workspace">
        <header>
          <div>
            <p className="eyebrow">Операционный центр</p>
            <h1>Городская доставка — Томск</h1>
            <p>Сегодня, 28 июля</p>
          </div>
          <div className="header-actions">
            <button className="new-order" onClick={() => setDialog(true)}>＋ Новый заказ</button>
            <button className="profile"><span>РТ</span><b>Администратор</b></button>
          </div>
        </header>

        <div className="content">
          <section className="kpis">
            <article><span className="kpi-icon orange">▤</span><div><p>Заказы</p><strong>{orders.length + 121}</strong><small>+18% к вчера</small></div></article>
            <article><span className="kpi-icon blue">→</span><div><p>В доставке</p><strong>{orders.filter((o) => o.status === "В пути").length + 32}</strong><small>+6% к вчера</small></div></article>
            <article><span className="kpi-icon green">✓</span><div><p>Доставлено</p><strong>{orders.filter((o) => o.status === "Доставлен").length + 83}</strong><small>+22% к вчера</small></div></article>
            <article><span className="kpi-icon purple">₽</span><div><p>Выручка</p><strong>184 320 ₽</strong><small>+15% к вчера</small></div></article>
          </section>

          <div className="dashboard-grid">
            <section className="panel orders-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">Операции</p><h2>Заказы сегодня</h2></div>
                <div className="filters">
                  {["Все", "Новый", "В пути", "Доставлен"].map((item) => (
                    <button className={filter === item ? "selected" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>
                  ))}
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Заказ</th><th>Клиент и маршрут</th><th>Курьер</th><th>Статус</th><th>Сумма</th></tr></thead>
                  <tbody>
                    {visibleOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="order-id">#{order.id}</td>
                        <td><b>{order.client}</b><small>{order.route}</small></td>
                        <td>{order.courier}</td>
                        <td><span className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</span></td>
                        <td className="amount">{rub(order.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <aside className="right-rail">
              <section className="panel courier-panel">
                <div className="panel-heading"><h2>Курьеры</h2><button>Все →</button></div>
                <div className="courier-list">
                  {couriers.map((courier) => (
                    <div className="courier" key={courier.name}>
                      <span className="avatar">{courier.initials}</span>
                      <div><b>{courier.name}</b><small className={courier.color}>{courier.state}</small></div>
                      <i className={courier.color} />
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel payout-panel">
                <p className="eyebrow">Финансы</p>
                <h2>Выплаты курьерам</h2>
                <strong>42 680 ₽</strong>
                <div className="progress"><span /></div>
                <p><b>12</b> подготовлено к перечислению</p>
                <button onClick={() => setNotice("Реестр выплат сформирован")}>Сформировать реестр</button>
              </section>
            </aside>
          </div>
        </div>
      </section>

      {dialog && (
        <div className="modal-backdrop" onMouseDown={() => setDialog(false)}>
          <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-title"><div><p className="eyebrow">Новая операция</p><h2>Создать заказ</h2></div><button onClick={() => setDialog(false)}>×</button></div>
            <form onSubmit={createOrder}>
              <label>Клиент<input name="client" placeholder="Имя или организация" required /></label>
              <div className="form-row">
                <label>Откуда<input name="from" placeholder="Адрес отправления" required /></label>
                <label>Куда<input name="to" placeholder="Адрес доставки" required /></label>
              </div>
              <label>Стоимость для клиента<input name="amount" type="number" min="1" placeholder="₽" required /></label>
              <p className="form-note">Оплата только безналичная. После доставки курьеру будет сформировано начисление.</p>
              <div className="modal-actions"><button type="button" onClick={() => setDialog(false)}>Отмена</button><button className="primary" type="submit">Создать заказ</button></div>
            </form>
          </section>
        </div>
      )}
      {notice && <div className="toast">✓ {notice}</div>}
    </main>
  );
}
