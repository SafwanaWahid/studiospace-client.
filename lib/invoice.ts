import type { Booking } from "./types";
import { money } from "./types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function downloadInvoice(booking: Booking) {
  const printWindow = window.open("", "_blank", "width=850,height=950");
  if (!printWindow)
    throw new Error("Allow pop-ups for this site to create the invoice PDF.");

  const studioCharge = Math.max(0, booking.total - booking.deposit);
  const rows = [
    ["Studio", booking.studioTitle],
    ["Location", booking.location],
    ["Creator", booking.userName],
    ["Session starts", formatDate(booking.start)],
    ["Session ends", formatDate(booking.end)],
    ["Reserved time", `${booking.hours.toFixed(2)} hours`],
    ["Hourly rate", `${money(booking.hourlyRate)} / hour`],
    ["Studio charge", money(studioCharge)],
    ["Refundable security deposit", money(booking.deposit)],
  ];
  const lineItems = rows
    .map(
      ([label, value]) =>
        `<div class="row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`,
    )
    .join("");

  printWindow.document.open();
  let printed = false;
  const print = () => {
    if (printed || printWindow.closed) return;
    printed = true;
    printWindow.focus();
    printWindow.print();
  };
  printWindow.addEventListener("load", print, { once: true });
  printWindow.document.write(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>StudioSpace invoice ${escapeHtml(booking._id.slice(-8))}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 40px; color: #24251f; font: 14px/1.55 Arial, sans-serif; }
          main { max-width: 720px; margin: 0 auto; }
          header { display: flex; justify-content: space-between; gap: 24px; align-items: start; padding-bottom: 26px; border-bottom: 1px solid #deded4; }
          h1 { margin: 0; font-size: 28px; letter-spacing: -.04em; }
          h2 { margin: 34px 0 8px; font-size: 20px; }
          p { color: #68695f; }
          .brand { color: #24251f; font-weight: 700; font-size: 18px; }
          .meta { text-align: right; color: #68695f; font-size: 12px; }
          .row { display: flex; justify-content: space-between; gap: 24px; padding: 13px 0; border-bottom: 1px solid #e7e7df; }
          .row span { color: #68695f; }
          .row strong { text-align: right; }
          .total { margin-top: 18px; padding-top: 18px; border-top: 2px solid #24251f; display: flex; justify-content: space-between; font-size: 20px; }
          .notice { margin-top: 28px; padding: 14px 16px; background: #f3f3ed; border-radius: 8px; color: #55564f; font-size: 12px; }
          .actions { margin-top: 24px; }
          button { border: 0; border-radius: 5px; padding: 12px 18px; color: white; background: #24251f; font-weight: 700; cursor: pointer; }
          @media print { body { padding: 0; } .actions { display: none; } }
          @page { margin: 18mm; }
        </style>
      </head>
      <body>
        <main>
          <header>
            <div><div class="brand">StudioSpace</div><h1>Booking invoice</h1><p>Reservation details and estimated charges</p></div>
            <div class="meta">Invoice ${escapeHtml(booking._id.slice(-8).toUpperCase())}<br />Issued ${escapeHtml(formatDate(new Date().toISOString()))}<br />Status: ${escapeHtml(booking.status)}</div>
          </header>
          <h2>${escapeHtml(booking.studioTitle)}</h2>
          ${lineItems}
          <div class="total"><strong>Total reservation estimate</strong><strong>${escapeHtml(money(booking.total))}</strong></div>
          <div class="notice">This document is a booking estimate, not proof of payment. StudioSpace does not process payments. The host handles payment and any refundable security deposit.</div>
          <div class="actions"><button onclick="window.print()">Print or save as PDF</button></div>
        </main>
      </body>
    </html>`);
  printWindow.document.close();
  window.setTimeout(print, 400);
}
