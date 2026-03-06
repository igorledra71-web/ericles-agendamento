* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Poppins, sans-serif;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
html {
  overflow-x: hidden;
}
input, textarea {
  user-select: text;
  -webkit-user-select: text;
}
body {
  background: #0a0a0f;
  color: #e8e8ec;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
  max-width: 100vw;
  overscroll-behavior-x: none;
}
header {
  background: linear-gradient(180deg, #12121a 0%, #0a0a0f 100%);
  padding: 18px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: sticky;
  top: 0;
  z-index: 50;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #b8b8c8;
}
.btn-back {
  position: fixed;
  left: 14px;
  top: 14px;
  z-index: 9999;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #c8c8d8;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.btn-back:active {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.3);
}
.admin-fab {
  position: fixed;
  top: 14px;
  right: 14px;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 900;
  z-index: 9999;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}
.admin-fab:active {
  background: rgba(255,255,255,0.12);
}
.container {
  max-width: 520px;
  margin: 0 auto;
  padding: 20px 16px 120px 16px;
  display: none;
  width: 100%;
}
@media (min-width: 768px) {
  .container { max-width: 580px; }
}
@media (min-width: 1200px) {
  .container { max-width: 640px; }
}
.card {
  background: rgba(255,255,255,0.03);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid rgba(255,255,255,0.06);
}
.card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
  color: #d8d8e8;
}
.card-sub {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
}
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
.grid > * {
  flex: 1 1 calc(50% - 4px);
  min-width: 0;
  max-width: 100%;
}
@media (min-width: 420px) {
  .grid > * {
    flex: 1 1 calc(33.333% - 6px);
  }
}
.step {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6b6b8a;
  margin-bottom: 6px;
  font-weight: 700;
}
.btn {
  background: linear-gradient(135deg, #d0d0e0, #ffffff);
  border: none;
  padding: 14px 16px;
  border-radius: 12px;
  font-weight: 800;
  width: 100%;
  color: #111;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn:active {
  transform: scale(0.97);
  opacity: 0.9;
}
.btn-outline {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: #b8b8c8;
  padding: 12px 16px;
  border-radius: 12px;
  width: 100%;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: 0.5px;
  font-size: 13px;
}
.btn-outline:active {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.3);
}
.btn-dark {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #d0d0e0;
}
.btn-dark:active {
  background: rgba(255,255,255,0.1);
}
.btn-danger {
  background: rgba(220,50,50,0.12);
  border: 1px solid rgba(220,50,50,0.3);
  color: #ff8888;
}
input, select {
  width: 100%;
  padding: 13px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  margin-top: 8px;
  margin-bottom: 14px;
  color: #e8e8ec;
  font-size: 14px;
  background: rgba(255,255,255,0.04);
  transition: border-color 0.2s ease;
}
input:focus, select:focus {
  outline: none;
  border-color: rgba(255,255,255,0.25);
}
.price {
  font-size: 17px;
  font-weight: 900;
  background: #1a1a2e;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 8px;
  border: 1px solid rgba(255,255,255,0.12);
}
.slot {
  background: rgba(255,255,255,0.04);
  padding: 12px 8px;
  border-radius: 10px;
  text-align: center;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s ease;
}
.slot.selected {
  border: 2px solid rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.1);
  color: #fff;
}
.slot.booked {
  background: rgba(200,50,50,0.08);
  opacity: 0.35;
  pointer-events: none;
}
.splash {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center top, #14142a 0%, #0a0a0f 60%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 24px;
  padding-bottom: env(safe-area-inset-bottom, 20px);
  text-align: center;
  height: 100dvh;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
@supports (height: 100dvh) {
  .splash { height: 100dvh; }
}
.logo-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}
.logo-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(150,150,220,0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  filter: blur(50px);
  z-index: 0;
  animation: pulse-glow 4s ease-in-out infinite alternate;
}
@keyframes pulse-glow {
  0% { opacity: 0.5; transform: translate(-50%, -55%) scale(0.95); }
  100% { opacity: 1; transform: translate(-50%, -55%) scale(1.08); }
}
.logo-image {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.15);
  box-shadow: 0 0 80px rgba(120,120,200,0.12);
  position: relative;
  z-index: 1;
  background: #12121a;
}
.logo-text {
  font-size: 28px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-top: 18px;
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, #ffffff 0%, #b8b8d0 50%, #7070a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.logo-subtitle {
  font-size: 10px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #5a5a7a;
  margin-top: 4px;
  position: relative;
  z-index: 1;
}
.hidden { display: none; }
.pagamento-box {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}
.pagamento-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
}
.pagamento-btn {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  color: #b8b8c8;
  transition: all 0.15s ease;
  font-size: 13px;
}
.pagamento-btn.sel,
.oc-pag-btn.sel {
  border: 2px solid rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.08);
  color: #fff;
}
.pix-box {
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px dashed rgba(255,255,255,0.15);
  font-size: 13px;
  line-height: 1.6;
}
.relatorio-btn {
  background: linear-gradient(135deg, #1b6e1f, #4caf50);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  width: 100%;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 14px;
}
.comissao-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  font-size: 12px;
}
.comissao-table th, .comissao-table td {
  padding: 8px 6px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.comissao-table th {
  background: rgba(255,255,255,0.04);
  color: #9898a8;
  font-weight: 700;
}
.comissao-table tr:nth-child(even) {
  background: rgba(255,255,255,0.02);
}
.comissao-table .subtotal-row {
  background: rgba(255,255,255,0.04);
  font-weight: 800;
}
.comissao-table .grand-total-row {
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.15));
  color: #fff;
  font-weight: 900;
  font-size: 14px;
}
.btn-export {
  background: linear-gradient(135deg, #1565c0, #42a5f5);
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  width: 100%;
  margin-top: 12px;
  font-size: 13px;
  cursor: pointer;
}
.admin-menu-btn {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  color: #c0c0d0;
  padding: 16px 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  text-align: left;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.admin-menu-btn:active {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.2);
}
.admin-menu-btn .menu-icon {
  font-size: 18px;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
}
.admin-overlay {
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  z-index: 9000;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: none;
  padding: 60px 16px 40px 16px;
}
.admin-overlay.active { display: block; }
.admin-overlay-close {
  position: fixed;
  left: 14px;
  top: 14px;
  z-index: 9500;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: #c8c8d8;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.admin-overlay-title {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 20px;
  color: #9898b0;
  letter-spacing: 1px;
  text-transform: uppercase;
}
