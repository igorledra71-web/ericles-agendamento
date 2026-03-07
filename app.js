
        const firebaseConfig = {
          apiKey: "AIzaSyBGlI8QRX8VY3vBLdRfp2Mq9m1943WUSeU",
          authDomain: "ericles-agendamento.firebaseapp.com",
          databaseURL: "https://ericles-agendamento-default-rtdb.firebaseio.com/",
          projectId: "ericles-agendamento",
          storageBucket: "ericles-agendamento.firebasestorage.app",
          messagingSenderId: "513587837356",
          appId: "1:513587837356:web:84cc72808597933dc76209",
        };

        firebase.initializeApp(firebaseConfig);

        const db = firebase.database();

        const DB = {
          servicos: db.ref("ericles-barbearia/servicos"),
          barbeiros: db.ref("ericles-barbearia/barbeiros"),
          config: db.ref("ericles-barbearia/config"),
          ag: db.ref("ericles-barbearia/agendamentos"),
          disp: db.ref("ericles-barbearia/disponibilidade"),
          vendas: db.ref("ericles-barbearia/vendas"),
          despesas: db.ref("ericles-barbearia/despesas"),
          clientes: db.ref("ericles-barbearia/clientes"),
        };

        // ================= ESTADO GLOBAL =================

        let servicos = [];
        let barbeiros = [];
        let disponibilidade = {};
        let agendamentos = [];
        let agendamentosMap = {};
        let despesas = {};
        let clientes = {};

        let servicosMulti = [];

        let barbeiroSel = null;
        let dataSel = null;
        let horaSel = null;
        let pagamentoSel = null;

        let reservando = false;

        const NOME_BARBEARIA = "Ericles Barbearia";
        const PIX_CHAVE = "49999474936";

        let config = { intervalo: 30 };

        const COMISSOES = {
          "Lucas": 42,
          "Rafael": 42,
          "Bruno": 42,
        };

        // ================= HELPERS =================

        function hojeISO() {
          return new Date().toISOString().split("T")[0];
        }

        function rolarPara(el) {
          if (!el) return;
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
        }

        function abrirAdminOverlay(id) {
          document.getElementById(id).classList.add("active");
          document.body.style.overflow = "hidden";
        }
        function fecharAdminOverlay(id) {
          document.getElementById(id).classList.remove("active");
          document.body.style.overflow = "";
        }
        function fecharTodosOverlays() {
          document.querySelectorAll(".admin-overlay.active").forEach(el => {
            el.classList.remove("active");
          });
          document.body.style.overflow = "";
        }

        function formatarPreco(v) {
          return Number(v || 0)
            .toFixed(2)
            .replace(".", ",");
        }

        function aplicarNome() {
          topo.innerText = NOME_BARBEARIA;
          document.title = NOME_BARBEARIA + " • Agendamento";
        }

        aplicarNome();


        function exportarExcel(dados, nomeArquivo) {
          let csv = "\uFEFF";
          dados.forEach((linha) => {
            csv += linha.map((cel) => {
              let v = String(cel == null ? "" : cel);
              v = v.replace(/"/g, '""');
              return '"' + v + '"';
            }).join(";") + "\n";
          });
          let blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});
          let link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = nomeArquivo + ".csv";
          link.click();
        }

        // ================= RESET ESTADO =================

        function resetEscolha() {
          servicosMulti = [];
          barbeiroSel = null;
          dataSel = null;
          horaSel = null;
          pagamentoSel = null;

          cardBarbeiro.classList.add("hidden");
          cardData.classList.add("hidden");
          cardHorarios.classList.add("hidden");
          cardCliente.classList.add("hidden");
          cardServicosSel.classList.add("hidden");

          boxPagamento.classList.add("hidden");

          document
            .querySelectorAll(".pagamento-btn")
            .forEach((b) => b.classList.remove("sel"));
        }

        // ================= SPLASH → CLIENTE =================

        btnEntrar.onclick = () => {
          telaSplash.style.display = "none";
          document.querySelector(".container").style.display = "block";

          telaCliente.classList.remove("hidden");
          telaAdmin.classList.add("hidden");
          telaBarbeiro.classList.add("hidden");
          telaExclusao.classList.add("hidden");

          btnBack.classList.remove("hidden");

          resetEscolha();
        };

        // ================= SPLASH → BARBEIRO =================

        btnModoBarbeiro.onclick = () => {
          let s = prompt("Senha barbeiro");

          if (!s || s.toLowerCase() !== "barbeiro123") {
            alert("Senha incorreta");
            return;
          }

          telaSplash.style.display = "none";
          document.querySelector(".container").style.display = "block";

          telaCliente.classList.add("hidden");
          telaAdmin.classList.add("hidden");
          telaExclusao.classList.add("hidden");
          telaBarbeiro.classList.remove("hidden");

          btnBack.classList.remove("hidden");

          popularModoBarbeiro();
          document.getElementById("agendDiaBox").classList.add("hidden");
        };

        btnLogout.onclick = () => {
          fecharTodosOverlays();
          telaAdmin.classList.add("hidden");
          document.querySelector(".container").style.display = "none";
          telaSplash.style.display = "";
          btnBack.classList.add("hidden");
        };

        // ================= ADMIN LOGIN =================

        btnAdminFab.onclick = () => {
          let s = prompt("Senha admin");

          if (!s || s.toLowerCase() !== "ericles123") {
            if (s !== null) alert("Senha incorreta");
            return;
          }

          telaSplash.style.display = "none";
          document.querySelector(".container").style.display = "block";

          telaCliente.classList.add("hidden");
          telaBarbeiro.classList.add("hidden");
          telaExclusao.classList.add("hidden");
          telaAdmin.classList.remove("hidden");

          btnBack.classList.remove("hidden");

          renderDespesas();
          renderClientes();
        };

        // ================= BACK =================

        btnBack.onclick = () => {
          let overlayAberto = document.querySelector(".admin-overlay.active");
          if (overlayAberto) {
            overlayAberto.classList.remove("active");
            document.body.style.overflow = "";
            return;
          }

          if (!telaExclusao.classList.contains("hidden")) {
            telaExclusao.classList.add("hidden");
            telaAdmin.classList.remove("hidden");
            return;
          }

          if (!telaAdmin.classList.contains("hidden")) {
            telaAdmin.classList.add("hidden");
            telaCliente.classList.remove("hidden");
            return;
          }

          if (!telaBarbeiro.classList.contains("hidden")) {
            telaBarbeiro.classList.add("hidden");
            telaCliente.classList.remove("hidden");
            return;
          }

          document.querySelector(".container").style.display = "none";
          telaSplash.style.display = "flex";
          btnBack.classList.add("hidden");
        };

        // ================= TELEFONE INPUT =================

        clienteFone.addEventListener("input", () => {
          clienteFone.value = clienteFone.value.replace(/\D/g, "").slice(0, 11);
        });

        // ================= PIX COPY =================

        btnCopiarPix.onclick = () => {
          navigator.clipboard.writeText(PIX_CHAVE);
          alert("Chave PIX copiada");
        };

        btnCopiarPixConfirm.onclick = () => {
          navigator.clipboard.writeText(PIX_CHAVE);
          alert("Chave PIX copiada");
        };

        btnVoltarPagamento.onclick = () => {
          telaConfirmaPix.classList.add("hidden");
          cardCliente.classList.remove("hidden");
          rolarPara(cardCliente);
        };

        // ================= PAGAMENTO UI =================

        function ativarPagamentoUI(total) {
          boxPagamento.classList.remove("hidden");
          pixValorView.innerText = formatarPreco(total);

          document.querySelectorAll(".pagamento-btn").forEach((btn) => {
            btn.onclick = () => {
              document
                .querySelectorAll(".pagamento-btn")
                .forEach((b) => b.classList.remove("sel"));

              btn.classList.add("sel");
              pagamentoSel = btn.dataset.pg;

              if (pagamentoSel === "pix") {
                pixInfo.classList.remove("hidden");
              } else {
                pixInfo.classList.add("hidden");
              }
            };
          });
        }

        // =====================================================
        // ================= SERVIÇOS CLIENTE ==================
        // =====================================================

        function renderServicos() {
          listaServicos.innerHTML = "";

          if (!servicos.length) {
            listaServicos.innerHTML = "Sem serviços cadastrados";
            return;
          }

          servicos.forEach((s) => {
            let b = document.createElement("button");
            b.className = "btn";

            b.innerHTML = `
<div style="font-size:16px;font-weight:800">
${s.nome}
</div>
<div class="price">
R$ ${formatarPreco(s.preco)}
</div>
`;

            b.onclick = () => {
              if (!servicosMulti.find((x) => x.nome === s.nome)) {
                servicosMulti.push(s);
              }

              renderServicosSelecionados();

              cardBarbeiro.classList.remove("hidden");
              renderBarbeiros();
              rolarPara(cardServicosSel);
            };

            listaServicos.appendChild(b);
          });
        }

        // ================= LISTA SERVIÇOS SELECIONADOS =================

        function renderServicosSelecionados() {
          listaServicosSel.innerHTML = "";

          if (!servicosMulti.length) {
            cardServicosSel.classList.add("hidden");
            return;
          }

          cardServicosSel.classList.remove("hidden");

          servicosMulti.forEach((s, i) => {
            let div = document.createElement("div");
            div.className = "card-sub";
            div.style.padding = "12px";
            div.style.marginBottom = "10px";

            div.innerHTML = `
<b>${s.nome}</b><br>
R$ ${formatarPreco(s.preco)}
<button class="btn-danger btn"
style="margin-top:8px"
onclick="removerServicoSel(${i})">
Remover
</button>
`;

            listaServicosSel.appendChild(div);
          });

          atualizarResumo();
        }

        function removerServicoSel(i) {
          servicosMulti.splice(i, 1);
          renderServicosSelecionados();
        }

        btnLimparServicos.onclick = () => {
          servicosMulti = [];
          renderServicosSelecionados();
        };

        // =====================================================
        // ================= BARBEIROS =========================
        // =====================================================

        function renderBarbeiros() {
          listaBarbeiros.innerHTML = "";

          if (!barbeiros.length) {
            listaBarbeiros.innerHTML = "Sem barbeiros";
            return;
          }

          barbeiros.forEach((b) => {
            let nome = b.nome || b;

            let btn = document.createElement("button");
            btn.className = "btn-outline";
            btn.innerText = nome;

            btn.onclick = () => {
              barbeiroSel = nome;

              cardData.classList.remove("hidden");
              renderDatasCliente();
              rolarPara(cardData);
            };

            listaBarbeiros.appendChild(btn);
          });
        }

        // =====================================================
        // ================= DATAS CLIENTE =====================
        // =====================================================

        function renderDatasCliente() {
          dataEscolhida.innerHTML = "";

          let diasObj = disponibilidade[barbeiroSel] || {};
          let dias = Object.keys(diasObj).sort();

          let hoje = hojeISO();

          dias = dias.filter((d) => d >= hoje);

          if (!dias.length) {
            let o = document.createElement("option");
            o.textContent = "Sem dias disponíveis";
            dataEscolhida.appendChild(o);
            return;
          }

          dias.forEach((d) => {
            let o = document.createElement("option");
            o.value = d;
            o.textContent = d;
            dataEscolhida.appendChild(o);
          });
        }

        // =====================================================
        // ================= CONFIRMAR DATA ====================
        // =====================================================

        btnConfirmarData.onclick = () => {
          dataSel = dataEscolhida.value;

          if (!dataSel) {
            alert("Escolha um dia");
            return;
          }

          cardHorarios.classList.remove("hidden");
          renderHorariosCliente();
          rolarPara(cardHorarios);
        };

        function renderHorariosCliente() {
          listaHorarios.innerHTML = "";
          horaSel = null;

          let lista =
            (disponibilidade[barbeiroSel] &&
              disponibilidade[barbeiroSel][dataSel]) ||
            [];

          if (!lista.length) {
            listaHorarios.innerHTML = "Sem horários";
            return;
          }

          lista.forEach((hora) => {
            let div = document.createElement("div");
            div.className = "slot";
            div.innerText = hora;

            let ocupado = agendamentos.find(
              (a) =>
                a.data === dataSel &&
                a.hora === hora &&
                a.barbeiro === barbeiroSel,
            );

            if (ocupado) {
              div.classList.add("booked");
            }

            div.onclick = () => {
              if (div.classList.contains("booked")) return;

              document
                .querySelectorAll("#listaHorarios .slot")
                .forEach((s) => s.classList.remove("selected"));

              div.classList.add("selected");

              horaSel = hora;

              cardCliente.classList.remove("hidden");
              atualizarResumo();

              let total = totalServicos();
              ativarPagamentoUI(total);

              rolarPara(cardCliente);
            };

            listaHorarios.appendChild(div);
          });
        }

        // =====================================================
        // ================= TOTAL + RESUMO ====================
        // =====================================================

        function totalServicos() {
          return servicosMulti.reduce((t, s) => t + Number(s.preco || 0), 0);
        }

        function nomesServicos() {
          return servicosMulti.map((s) => s.nome).join(", ");
        }

        function atualizarResumo() {
          if (!horaSel) return;

          let total = totalServicos();

          resumoEscolha.innerHTML = `
<div class="card-sub" style="padding:16px">
<b>Serviços:</b> ${nomesServicos()}<br>
<b>Barbeiro:</b> ${barbeiroSel}<br>
<b>Data:</b> ${dataSel}<br>
<b>Hora:</b> ${horaSel}<br>
<div class="price" style="margin-top:10px">
R$ ${formatarPreco(total)}
</div>
</div>
`;

          pixValorView.innerText = formatarPreco(total);
        }

        // =====================================================
        // ================= WHATSAPP LOJA =====================
        // =====================================================

        function enviarWhatsLoja(ag) {
          let msg = `✂️ ${NOME_BARBEARIA}

Novo agendamento:

Cliente: ${ag.cliente}
Whats: ${ag.fone}
Serviços: ${ag.servico}
Barbeiro: ${ag.barbeiro}
Data: ${ag.data}
Hora: ${ag.hora}
Pagamento: ${ag.pagamento}
Valor: R$ ${formatarPreco(ag.preco)}
`;

          let url =
            "https://wa.me/5549999474936?text=" + encodeURIComponent(msg);

          window.location.href = url;
        }

        // =====================================================
        // ================= REGISTRAR VENDA ===================
        // =====================================================

        function registrarVenda(ag, estorno = false) {
          let dia = ag.data;
          let forma = ag.pagamento;
          let valor = Number(ag.preco || 0);
          if (estorno) valor = -valor;
          DB.vendas
            .child(dia)
            .child(forma)
            .transaction((v) => (v || 0) + valor);
        }

        // =====================================================
        // ================= RESERVAR ==========================
        // =====================================================

        btnReservar.onclick = async () => {
          if (reservando) return;
          if (!servicosMulti.length) {
            alert("Escolha ao menos um serviço");
            return;
          }
          if (!barbeiroSel || !dataSel || !horaSel) {
            alert("Complete as escolhas");
            return;
          }
          if (!clienteNome.value || clienteNome.value.length < 2) {
            alert("Digite o nome");
            return;
          }
          if (clienteFone.value.length < 10) {
            alert("WhatsApp inválido");
            return;
          }
          if (!pagamentoSel) {
            alert("Escolha a forma de pagamento");
            return;
          }

          if (pagamentoSel === "pix") {
            cardCliente.classList.add("hidden");
            telaConfirmaPix.classList.remove("hidden");
            pixValorConfirm.innerText = formatarPreco(totalServicos());
            rolarPara(telaConfirmaPix);
            return;
          }

          executarReserva();
        };

        btnJaFizPix.onclick = () => {
          executarReserva();
        };

        async function executarReserva() {
          if (reservando) return;
          reservando = true;
          const btnAcao = pagamentoSel === "pix" ? btnJaFizPix : btnReservar;
          btnAcao.innerText = "Verificando...";
          btnAcao.disabled = true;

          try {
            let snap = await DB.ag
              .orderByChild("data")
              .equalTo(dataSel)
              .once("value");
            let ags = snap.val() || {};
            let ocupado = Object.values(ags).find(
              (a) => a.hora === horaSel && a.barbeiro === barbeiroSel,
            );

            if (ocupado) {
              alert("Este horário já foi reservado. Escolha outro.");
              reservando = false;
              btnAcao.innerText =
                pagamentoSel === "pix"
                  ? "Já realizei o pagamento"
                  : "Reservar horário";
              btnAcao.disabled = false;
              renderHorariosCliente();
              if (pagamentoSel === "pix") {
                telaConfirmaPix.classList.add("hidden");
                cardHorarios.classList.remove("hidden");
              }
              return;
            }

            let total = totalServicos();
            let ag = {
              servico: nomesServicos(),
              preco: total,
              barbeiro: barbeiroSel,
              data: dataSel,
              hora: horaSel,
              cliente: clienteNome.value,
              fone: clienteFone.value,
              pagamento: pagamentoSel,
              ts: Date.now(),
            };

            await DB.ag.push(ag);
            registrarVenda(ag);

            let foneKey = clienteFone.value.replace(/\D/g, "");
            if (foneKey) {
              DB.clientes.child(foneKey).set({
                nome: clienteNome.value,
                fone: clienteFone.value,
                ultimoAgendamento: dataSel,
              });
            }

            enviarWhatsLoja(ag);
          } catch (e) {
            alert("Erro ao salvar agendamento");
            reservando = false;
            btnAcao.innerText =
              pagamentoSel === "pix"
                ? "Já realizei o pagamento"
                : "Reservar horário";
            btnAcao.disabled = false;
          }
        }

        // =====================================================
        // ================= ADMIN SERVIÇOS ====================
        // =====================================================

        function renderAdminServicos() {
          adminServicos.innerHTML = "";

          if (!servicos.length) {
            adminServicos.innerHTML = "Sem serviços";
            return;
          }

          servicos.forEach((s, i) => {
            let div = document.createElement("div");
            div.className = "card card-sub";

            div.innerHTML = `
<b>${s.nome}</b><br>
<div class="price">R$ ${formatarPreco(s.preco)}</div>

<button class="btn-danger btn"
style="margin-top:10px"
onclick="removerServicoAdmin(${i})">
Excluir
</button>
`;

            adminServicos.appendChild(div);
          });
        }

        btnAddServico.onclick = () => {
          if (!novoServicoNome.value || !novoServicoPreco.value) {
            alert("Preencha nome e preço");
            return;
          }

          servicos.push({
            nome: novoServicoNome.value,
            preco: Number(novoServicoPreco.value),
          });

          DB.servicos.set(servicos);

          novoServicoNome.value = "";
          novoServicoPreco.value = "";
        };

        // =====================================================
        // ================= ADMIN BARBEIROS ===================
        // =====================================================

        function renderAdminBarbeiros() {
          adminBarbeiros.innerHTML = "";

          barbeiros.forEach((b, i) => {
            let nome = b.nome || b;
            let whats = b.whats || "";

            let div = document.createElement("div");
            div.className = "card card-sub";

            div.innerHTML = `
<b>${nome}</b><br>
Whats: ${whats || "-"}

<input id="wb_${i}" placeholder="Whats barbeiro">

<button class="btn-dark btn"
style="margin-top:8px"
onclick="salvarWhatsBarbeiro(${i})">
Salvar Whats
</button>

<button class="btn-danger btn"
style="margin-top:8px"
onclick="removerBarbeiroAdmin(${i})">
Excluir
</button>
`;

            adminBarbeiros.appendChild(div);
          });
        }

        btnAddBarbeiro.onclick = () => {
          if (!novoBarbeiro.value) {
            alert("Digite o nome");
            return;
          }

          barbeiros.push({
            nome: novoBarbeiro.value,
            whats: "",
          });

          DB.barbeiros.set(barbeiros);
          novoBarbeiro.value = "";
        };

        function salvarWhatsBarbeiro(i) {
          let v = document.getElementById("wb_" + i).value.replace(/\D/g, "");

          if (v.length < 10) {
            alert("Whats inválido");
            return;
          }

          barbeiros[i].whats = v;
          DB.barbeiros.set(barbeiros);
        }

        function removerBarbeiroAdmin(i) {
          if (!confirm("Excluir barbeiro?")) return;
          barbeiros.splice(i, 1);
          DB.barbeiros.set(barbeiros);
        }

        function removerServicoAdmin(i) {
          if (!confirm("Excluir serviço?")) return;
          servicos.splice(i, 1);
          DB.servicos.set(servicos);
        }

        // =====================================================
        // ============ POPULAR SELECTS BARBEIRO ===============
        // =====================================================

        function popularSelectsBarbeiro() {
          barbeiroModoSel.innerHTML = "";
          excBarbeiro.innerHTML = "";

          let barbDispSel = document.getElementById("barbDispBarbeiroSel");
          let barbResetSel = document.getElementById("barbResetBarbeiroSel");
          let ocBarbSel = document.getElementById("ocBarbeiroSel");
          if (barbDispSel) barbDispSel.innerHTML = "";
          if (barbResetSel) barbResetSel.innerHTML = "";
          if (ocBarbSel) ocBarbSel.innerHTML = "";

          barbeiros.forEach((b) => {
            let nome = b.nome || b;

            barbeiroModoSel.add(new Option(nome, nome));
            excBarbeiro.add(new Option(nome, nome));
            if (barbDispSel) barbDispSel.add(new Option(nome, nome));
            if (barbResetSel) barbResetSel.add(new Option(nome, nome));
            if (ocBarbSel) ocBarbSel.add(new Option(nome, nome));
          });

          popularComissaoBarbeiroFiltro();

          let agendFiltro = document.getElementById("agendBarbeiroFiltro");
          if (agendFiltro) {
            let currentVal = agendFiltro.value;
            agendFiltro.innerHTML = '<option value="todos">Todos</option>';
            barbeiros.forEach((b) => {
              let nome = b.nome || b;
              agendFiltro.add(new Option(nome, nome));
            });
            if (currentVal) agendFiltro.value = currentVal;
          }
        }

        // =====================================================
        // ================= HORÁRIOS BASE =====================
        // =====================================================

        function blocosDiaSemana(dataISO) {
          let d = new Date(dataISO + "T00:00:00");
          let dia = d.getDay();

          if (dia === 0) return [];

          if (dia === 6) {
            return [["09:00", "17:00"]];
          }

          return [
            ["09:00", "12:00"],
            ["14:00", "19:00"],
          ];
        }

        // =====================================================
        // ================= GERAR SLOTS =======================
        // =====================================================

        function gerarSlotsFixos(dataISO) {
          let blocos = blocosDiaSemana(dataISO);
          let lista = [];
          let intervalo = config.intervalo || 30;

          blocos.forEach((b) => {
            let [ai, af] = b;

            let [ha, ma] = ai.split(":").map(Number);
            let [hf, mf] = af.split(":").map(Number);

            let ini = ha * 60 + ma;
            let fim = hf * 60 + mf;

            for (let t = ini; t < fim; t += intervalo) {
              let h = Math.floor(t / 60)
                .toString()
                .padStart(2, "0");
              let m = (t % 60).toString().padStart(2, "0");

              lista.push(h + ":" + m);
            }
          });

          return lista;
        }

        // =====================================================
        // ========= BARBER MODE: GERAR SLOTS ==================
        // =====================================================

        btnBarbGerarSlots.onclick = () => {
          let barbeiro = document.getElementById("barbDispBarbeiroSel").value;
          let data = barbDispDataPick.value;

          if (!barbeiro) {
            alert("Escolha o barbeiro");
            return;
          }
          if (!data) {
            alert("Escolha a data");
            return;
          }

          let base = gerarSlotsFixos(data);

          barbSlotsGrid.innerHTML = "";

          if (!base.length) {
            barbSlotsGrid.innerHTML = "Domingo fechado";
            return;
          }

          let ja =
            (disponibilidade[barbeiro] && disponibilidade[barbeiro][data]) ||
            [];

          base.forEach((hora) => {
            let div = document.createElement("div");
            div.className = "slot";
            div.innerText = hora;

            if (ja.includes(hora)) {
              div.classList.add("selected");
            }

            div.onclick = () => div.classList.toggle("selected");

            barbSlotsGrid.appendChild(div);
          });

          rolarPara(barbSlotsGrid);
        };

        // =====================================================
        // ======= BARBER MODE: SALVAR DISPONIBILIDADE =========
        // =====================================================

        btnBarbSalvarSlotsDia.onclick = () => {
          let barbeiro = document.getElementById("barbDispBarbeiroSel").value;
          let data = barbDispDataPick.value;

          if (!barbeiro) {
            alert("Escolha o barbeiro");
            return;
          }
          if (!data) {
            alert("Escolha a data");
            return;
          }

          let sel = [];

          document
            .querySelectorAll("#barbSlotsGrid .slot.selected")
            .forEach((s) => sel.push(s.innerText));

          if (!sel.length) {
            alert("Selecione horários");
            return;
          }

          DB.disp.child(barbeiro).child(data).set(sel);

          alert("Disponibilidade salva");

          barbSlotsGrid.innerHTML = "";
          barbDispDataPick.value = "";
        };

        btnBarbLimparGerador.onclick = () => {
          barbSlotsGrid.innerHTML = "";
        };

        // =====================================================
        // ======= BARBER MODE: RESET GUIADO ===================
        // =====================================================

        btnBarbAbrirReset.onclick = () => {
          barbResetBox.classList.toggle("hidden");

          if (!barbResetBox.classList.contains("hidden")) {
            renderBarbResetDias();
            rolarPara(barbResetBox);
          }
        };

        document.getElementById("barbResetBarbeiroSel").onchange = () => {
          if (!barbResetBox.classList.contains("hidden")) {
            renderBarbResetDias();
          }
        };

        document.getElementById("barbDispBarbeiroSel").onchange = () => {
          barbSlotsGrid.innerHTML = "";
        };

        function renderBarbResetDias() {
          barbResetDias.innerHTML = "";
          barbResetHorarios.innerHTML = "";

          let barbeiro = document.getElementById("barbResetBarbeiroSel").value;

          if (!barbeiro) {
            barbResetDias.innerHTML = "Escolha o barbeiro";
            return;
          }

          let diasObj = disponibilidade[barbeiro] || {};
          let hoje = hojeISO();
          let dias = Object.keys(diasObj).filter((d) => d >= hoje).sort();

          if (!dias.length) {
            barbResetDias.innerHTML = "Sem dias disponíveis";
            return;
          }

          dias.forEach((d) => {
            let b = document.createElement("button");
            b.className = "btn-dark btn";
            b.style.marginBottom = "8px";
            b.textContent = d;

            b.onclick = () => renderBarbResetHorarios(barbeiro, d);

            barbResetDias.appendChild(b);
          });
        }

        function renderBarbResetHorarios(barbeiro, data) {
          barbResetHorarios.innerHTML = "";

          let lista =
            (disponibilidade[barbeiro] && disponibilidade[barbeiro][data]) ||
            [];

          if (!lista.length) {
            barbResetHorarios.innerHTML = "Sem horários";
            return;
          }

          lista.forEach((h) => {
            let div = document.createElement("div");
            div.className = "slot";
            div.innerText = h;
            div.onclick = () => div.classList.toggle("selected");

            barbResetHorarios.appendChild(div);
          });

          barbResetHorarios.dataset.barbeiro = barbeiro;
          barbResetHorarios.dataset.data = data;

          rolarPara(barbResetHorarios);
        }

        btnBarbExcluirSlots.onclick = () => {
          let barbeiro = barbResetHorarios.dataset.barbeiro;
          let data = barbResetHorarios.dataset.data;

          if (!barbeiro || !data) {
            alert("Escolha barbeiro e dia");
            return;
          }

          let remover = [];

          document
            .querySelectorAll("#barbResetHorarios .slot.selected")
            .forEach((s) => remover.push(s.innerText));

          if (!remover.length) {
            alert("Selecione horários");
            return;
          }

          if (!confirm("Remover horários?")) return;

          let atuais =
            (disponibilidade[barbeiro] && disponibilidade[barbeiro][data]) ||
            [];

          let novos = atuais.filter((h) => !remover.includes(h));

          DB.disp.child(barbeiro).child(data).set(novos);

          alert("Horários removidos");

          renderBarbResetHorarios(barbeiro, data);
        };

        // =====================================================
        // ================= ADMIN AGENDA ======================
        // =====================================================

        document.getElementById("btnToggleAgendDia").onclick = () => {
          let box = document.getElementById("agendDiaBox");
          box.classList.toggle("hidden");
          if (!box.classList.contains("hidden")) {
            renderAdminAgendamentos();
          }
        };

        function renderAdminAgendamentos() {
          let container = document.getElementById("listaAgendamentos");
          if (!container) return;
          container.innerHTML = "";

          let filtro = document.getElementById("agendBarbeiroFiltro");
          let barbeiroFiltro = filtro ? filtro.value : "todos";

          let hoje = hojeISO();
          let lista = Object.entries(agendamentosMap).filter(([key, a]) => a.data === hoje);

          if (barbeiroFiltro !== "todos") {
            lista = lista.filter(([key, a]) => a.barbeiro === barbeiroFiltro);
          }

          if (!lista.length) {
            container.innerHTML = `<div style="text-align:center;padding:20px;opacity:0.6;font-size:14px;">Nenhum agendamento para hoje.</div>`;
            return;
          }

          lista
            .sort((a, b) =>
              ((a[1].hora || "")).localeCompare((b[1].hora || "")),
            )
            .forEach(([key, a]) => {
              let div = document.createElement("div");
              div.className = "card card-sub";

              div.innerHTML = `
<b>${a.hora || "-"}</b><br>
Cliente: ${a.cliente || "-"}<br>
Serviços: ${a.servico || "-"}<br>
Barbeiro: ${a.barbeiro || "-"}<br>
Pagamento: ${a.pagamento || "-"}<br>
<div class="price">R$ ${formatarPreco(a.preco)}</div>

<button class="btn-danger btn"
style="margin-top:10px"
onclick="excluirAgendamentoAdmin('${key}')">
Excluir
</button>
`;

              container.appendChild(div);
            });
        }

        document.getElementById("agendBarbeiroFiltro").onchange = renderAdminAgendamentos;

        function excluirAgendamentoAdmin(key) {
          if (!confirm("Excluir agendamento?")) return;
          let ag = agendamentosMap[key];
          if (ag) {
            registrarVenda(ag, true);
          }
          DB.ag.child(key).remove();
        }

        // =====================================================
        // ================= TELA EXCLUSÃO =====================
        // =====================================================

        btnCarregarExc.onclick = () => {
          let barb = excBarbeiro.value;
          let data = excData.value;

          if (!barb || !data) {
            alert("Escolha barbeiro e data");
            return;
          }

          listaExclusao.innerHTML = "";

          let lista = Object.entries(agendamentosMap)
            .filter(([k, a]) => a.barbeiro === barb && a.data === data)
            .sort((a, b) => a[1].hora.localeCompare(b[1].hora));

          if (!lista.length) {
            listaExclusao.innerHTML = "Nenhum agendamento";
            return;
          }

          lista.forEach(([key, a]) => {
            let div = document.createElement("div");
            div.className = "card card-sub";

            div.innerHTML = `
<b>${a.hora}</b><br>
${a.cliente}<br>
${a.servico}

<button class="btn-danger btn"
style="margin-top:8px"
onclick="excluirAgendamentoAdmin('${key}')">
Excluir
</button>
`;

            listaExclusao.appendChild(div);
          });
        };

        // =====================================================
        // ================= MODO BARBEIRO =====================
        // =====================================================

        btnVerAgendaBarbeiro.onclick = renderAgendaBarbeiro;

        barbeiroModoSel.onchange = () => {
          renderAgendaBarbeiro();
        };

        function popularModoBarbeiro() {
          barbeiroModoSel.innerHTML = "";
          let barbDispSel = document.getElementById("barbDispBarbeiroSel");
          let barbResetSel = document.getElementById("barbResetBarbeiroSel");
          let ocBarbSel = document.getElementById("ocBarbeiroSel");
          if (barbDispSel) barbDispSel.innerHTML = "";
          if (barbResetSel) barbResetSel.innerHTML = "";
          if (ocBarbSel) ocBarbSel.innerHTML = "";

          barbeiros.forEach((b) => {
            let nome = b.nome || b;
            barbeiroModoSel.add(new Option(nome, nome));
            if (barbDispSel) barbDispSel.add(new Option(nome, nome));
            if (barbResetSel) barbResetSel.add(new Option(nome, nome));
            if (ocBarbSel) ocBarbSel.add(new Option(nome, nome));
          });
          popularComissaoBarbeiroFiltro();
          renderOCServicos();

          let agendFiltro = document.getElementById("agendBarbeiroFiltro");
          if (agendFiltro) {
            let currentVal = agendFiltro.value;
            agendFiltro.innerHTML = '<option value="todos">Todos</option>';
            barbeiros.forEach((b) => {
              let nome = b.nome || b;
              agendFiltro.add(new Option(nome, nome));
            });
            if (currentVal) agendFiltro.value = currentVal;
          }
        }

        // =====================================================
        // ========= REGISTRO ORDEM DE CHEGADA ================
        // =====================================================

        let ocPagSel = null;

        function ocAvancar(step) {
          if (step === 2) {
            let barb = document.getElementById("ocBarbeiroSel").value;
            if (!barb) { alert("Escolha o barbeiro"); return; }
          }
          if (step === 3) {
            let grid = document.getElementById("ocServicosGrid");
            let sel = grid.querySelectorAll(".slot.selected");
            if (!sel.length) { alert("Escolha pelo menos um serviço"); return; }
          }
          document.getElementById("ocStep1").classList.add("hidden");
          document.getElementById("ocStep2").classList.add("hidden");
          document.getElementById("ocStep3").classList.add("hidden");
          document.getElementById("ocStep" + step).classList.remove("hidden");
        }
        function ocVoltar(step) {
          document.getElementById("ocStep1").classList.add("hidden");
          document.getElementById("ocStep2").classList.add("hidden");
          document.getElementById("ocStep3").classList.add("hidden");
          document.getElementById("ocStep" + step).classList.remove("hidden");
        }
        function ocResetWizard() {
          document.getElementById("ocStep1").classList.remove("hidden");
          document.getElementById("ocStep2").classList.add("hidden");
          document.getElementById("ocStep3").classList.add("hidden");
        }

        document.querySelectorAll(".oc-pag-btn").forEach((btn) => {
          btn.onclick = () => {
            document.querySelectorAll(".oc-pag-btn").forEach((b) => b.classList.remove("sel"));
            btn.classList.add("sel");
            ocPagSel = btn.dataset.pag;
          };
        });

        function renderOCServicos() {
          let grid = document.getElementById("ocServicosGrid");
          if (!grid) return;
          grid.innerHTML = "";
          servicos.forEach((s) => {
            let div = document.createElement("div");
            div.className = "slot";
            div.innerHTML = `${s.nome}<br><small>R$ ${formatarPreco(s.preco)}</small>`;
            div.onclick = () => div.classList.toggle("selected");
            grid.appendChild(div);
          });
        }

        document.getElementById("btnRegistrarOC").onclick = async () => {
          let barbeiro = document.getElementById("ocBarbeiroSel").value;
          let grid = document.getElementById("ocServicosGrid");
          let nome = document.getElementById("ocClienteNome").value.trim();
          let fone = document.getElementById("ocClienteFone").value.trim();

          if (!barbeiro) { alert("Escolha o barbeiro"); return; }

          let selServicos = [];
          let totalPreco = 0;
          grid.querySelectorAll(".slot.selected").forEach((s) => {
            let txt = s.innerText.split("\n")[0].trim();
            let svc = servicos.find((sv) => sv.nome === txt);
            if (svc) {
              selServicos.push(svc.nome);
              totalPreco += Number(svc.preco || 0);
            }
          });

          if (!selServicos.length) { alert("Escolha pelo menos um serviço"); return; }
          if (!nome) { alert("Informe o nome do cliente"); return; }
          if (!ocPagSel) { alert("Escolha a forma de pagamento"); return; }

          let agora = new Date();
          let dataHoje = agora.toISOString().split("T")[0];
          let horaAgora = agora.getHours().toString().padStart(2, "0") + ":" + agora.getMinutes().toString().padStart(2, "0");

          let ag = {
            servico: selServicos.join(", "),
            preco: totalPreco,
            barbeiro: barbeiro,
            data: dataHoje,
            hora: horaAgora,
            cliente: nome,
            fone: fone || "",
            pagamento: ocPagSel,
            ts: Date.now(),
            ordemChegada: true,
          };

          try {
            await DB.ag.push(ag);
            registrarVenda(ag);

            if (fone) {
              let foneKey = fone.replace(/\D/g, "");
              if (foneKey) {
                DB.clientes.child(foneKey).set({
                  nome: nome,
                  fone: fone,
                  ultimoAgendamento: dataHoje,
                });
              }
            }

            alert("Atendimento registrado!");

            document.getElementById("ocClienteNome").value = "";
            document.getElementById("ocClienteFone").value = "";
            ocPagSel = null;
            document.querySelectorAll(".oc-pag-btn").forEach((b) => b.classList.remove("sel"));
            grid.querySelectorAll(".slot.selected").forEach((s) => s.classList.remove("selected"));
            ocResetWizard();
          } catch (e) {
            alert("Erro ao registrar: " + e.message);
          }
        };

        function popularComissaoBarbeiroFiltro() {
          let sel = document.getElementById("comissaoBarbeiroFiltro");
          if (!sel) return;
          let current = sel.value;
          sel.innerHTML = '<option value="todos">Todos os barbeiros</option>';
          barbeiros.forEach((b) => {
            let nome = b.nome || b;
            sel.add(new Option(nome, nome));
          });
          if (current) sel.value = current;
        }

        function renderAgendaBarbeiro() {
          let nome = barbeiroModoSel.value;
          let data = barbeiroModoData.value || hojeISO();

          listaBarbeiroAgenda.innerHTML = "";

          let lista = agendamentos
            .filter((a) => a.barbeiro === nome && a.data === data)
            .sort((a, b) => a.hora.localeCompare(b.hora));

          if (!lista.length) {
            listaBarbeiroAgenda.innerHTML = "Sem clientes";
            return;
          }

          lista.forEach((a) => {
            let div = document.createElement("div");
            div.className = "card card-sub";

            div.innerHTML = `
<b>${a.hora}</b><br>
${a.cliente}<br>
${a.servico}<br>

<button class="btn-dark btn"
onclick="window.open('https://wa.me/55${a.fone}')">
WhatsApp
</button>

<button class="btn-outline"
onclick="copiarFone('${a.fone}')">
Copiar telefone
</button>

<button class="btn"
onclick="enviarLembreteCliente(
'${a.cliente}',
'${a.fone}',
'${a.data}',
'${a.hora}',
'${a.servico}'
)">
Lembrete
</button>
`;

            listaBarbeiroAgenda.appendChild(div);
          });
        }

        function copiarFone(f) {
          navigator.clipboard.writeText(f);
          alert("Telefone copiado");
        }

        function enviarLembreteCliente(nome, fone, data, hora, servico) {
          let msg = `✂️ ${NOME_BARBEARIA}

Olá ${nome}!
Lembrete do seu horário:

Serviço: ${servico}
Data: ${data}
Hora: ${hora}
`;

          let url =
            "https://wa.me/55" +
            fone.replace(/\D/g, "") +
            "?text=" +
            encodeURIComponent(msg);

          window.open(url, "_blank");
        }

        // =====================================================
        // ================= RELATÓRIO HOJE ====================
        // =====================================================

        function renderRelHoje() {
          let hoje = hojeISO();
          let lista = agendamentos.filter((a) => a.data && a.data === hoje);

          relHojeBox.classList.remove("hidden");
          relPeriodoBox.classList.add("hidden");

          if (lista.length === 0) {
            relHojeBox.innerHTML = `<div style="text-align:center;padding:20px;opacity:0.6;font-size:14px;">Nenhum registro encontrado para hoje.</div>`;
            return;
          }

          let total = 0;
          let porTipo = { pix: 0, debito: 0, credito: 0, dinheiro: 0 };
          let porBarbeiro = {};

          lista.forEach((a) => {
            let v = Number(a.preco || 0);
            total += v;
            if (porTipo[a.pagamento] != null) {
              porTipo[a.pagamento] += v;
            }
            if (!porBarbeiro[a.barbeiro]) porBarbeiro[a.barbeiro] = 0;
            porBarbeiro[a.barbeiro] += v;
          });

          let barbeiroHtml = Object.entries(porBarbeiro).map(([n,v]) => `${n}: R$ ${formatarPreco(v)}`).join("<br>");

          relHojeBox.innerHTML = `
<b>Hoje — ${hoje}</b><br><br>
<b>Por forma de pagamento:</b><br>
PIX: R$ ${formatarPreco(porTipo.pix)}<br>
Débito: R$ ${formatarPreco(porTipo.debito)}<br>
Crédito: R$ ${formatarPreco(porTipo.credito)}<br>
Dinheiro: R$ ${formatarPreco(porTipo.dinheiro)}<br><br>
<b>Por barbeiro:</b><br>
${barbeiroHtml || "Nenhum"}<br><br>
<div class="price">
Total: R$ ${formatarPreco(total)}
</div>
<button class="btn-export" style="margin-top:12px" onclick="exportarRelHoje()">📊 Exportar para Excel</button>
`;

          window._relHojeDados = [
            ["Relatório do dia", hoje],
            [],
            ["Cliente", "Barbeiro", "Serviço", "Hora", "Pagamento", "Valor (R$)"]
          ];
          lista.sort((a,b) => a.hora.localeCompare(b.hora));
          lista.forEach((a) => {
            window._relHojeDados.push([a.cliente, a.barbeiro, a.servico, a.hora, a.pagamento, formatarPreco(a.preco)]);
          });
          window._relHojeDados.push([]);
          window._relHojeDados.push(["PIX", "", "", "", "", formatarPreco(porTipo.pix)]);
          window._relHojeDados.push(["Débito", "", "", "", "", formatarPreco(porTipo.debito)]);
          window._relHojeDados.push(["Crédito", "", "", "", "", formatarPreco(porTipo.credito)]);
          window._relHojeDados.push(["Dinheiro", "", "", "", "", formatarPreco(porTipo.dinheiro)]);
          window._relHojeDados.push(["TOTAL", "", "", "", "", formatarPreco(total)]);
        }

        function exportarRelHoje() {
          if (window._relHojeDados) {
            exportarExcel(window._relHojeDados, "vendas_hoje_" + hojeISO());
          }
        }

        btnRelHoje.onclick = renderRelHoje;

        btnZerarVendas.onclick = () => {
          if (
            confirm(
              "ATENÇÃO: Isso apagará TODOS os dados de vendas permanentemente. Você tem certeza absoluta?"
            )
          ) {
            if (
              confirm(
                "ÚLTIMA CHANCE: Confirmar exclusão total de relatórios de vendas?"
              )
            ) {
              DB.vendas.remove().then(() => {
                alert("Relatórios zerados com sucesso.");
                relHojeBox.classList.add("hidden");
                relPeriodoBox.classList.add("hidden");
              });
            }
          }
        };

        // =====================================================
        // ================= RELATÓRIO PERÍODO =================
        // =====================================================

        btnRelPeriodo.onclick = () => {
          relHojeBox.classList.add("hidden");
          relPeriodoBox.classList.remove("hidden");

          relPeriodoBox.innerHTML = `
<select id="relTipoSel" style="width:100%; padding:16px; border-radius:14px; border:none; margin-bottom:8px; color:#000; font-size:15px;">
<option value="dia">Dia</option>
<option value="mes">Mês</option>
<option value="ano">Ano</option>
</select>
<div id="relInputContainer" style="margin-top:10px">
<input type="date" id="relRefDia" style="width:100%; padding:16px; border-radius:14px; border:none; margin-top:8px; margin-bottom:14px; color:#000; font-size:15px;">
</div>
<button id="btnGerarRel" class="btn" style="margin-top:10px"> Gerar </button>
<div id="relOut" style="margin-top:12px"></div>
`;

          const relTipoSel = document.getElementById("relTipoSel");
          const relInputContainer =
            document.getElementById("relInputContainer");

          relTipoSel.onchange = () => {
            const tipo = relTipoSel.value;
            if (tipo === "dia") {
              relInputContainer.innerHTML = `<input type="date" id="relRefDia" style="width:100%; padding:16px; border-radius:14px; border:none; margin-top:8px; margin-bottom:14px; color:#000; font-size:15px;">`;
            } else if (tipo === "mes") {
              relInputContainer.innerHTML = `<input type="month" id="relRefDia" style="width:100%; padding:16px; border-radius:14px; border:none; margin-top:8px; margin-bottom:14px; color:#000; font-size:15px;">`;
            } else if (tipo === "ano") {
              const anos = [
                ...new Set(agendamentos.map((a) => a.data.split("-")[0])),
              ]
                .sort()
                .reverse();
              if (anos.length === 0) {
                const anoAtual = new Date().getFullYear();
                anos.push(anoAtual.toString());
              }
              let options = anos
                .map((a) => `<option value="${a}">${a}</option>`)
                .join("");
              relInputContainer.innerHTML = `<select id="relRefDia" style="width:100%; padding:16px; border-radius:14px; border:none; margin-top:8px; margin-bottom:14px; color:#000; font-size:15px;">${options}</select>`;
            }
          };

          document.getElementById("btnGerarRel").onclick = () => {
            let d = document.getElementById("relRefDia").value;
            let tipo = relTipoSel.value;
            if (!d) return;

            let refParts = d.split("-");
            let lista = agendamentos.filter((a) => {
              if (!a.data) return false;
              let aParts = a.data.split("-");
              if (tipo === "dia") return a.data === d;
              if (tipo === "mes")
                return aParts[0] === refParts[0] && aParts[1] === refParts[1];
              if (tipo === "ano") return aParts[0] === d;
              return false;
            });

            let relOut = document.getElementById("relOut");

            if (lista.length === 0) {
              relOut.innerHTML = `<div style="text-align:center;padding:20px;opacity:0.6;font-size:14px;">Nenhum registro encontrado para este período.</div>`;
              return;
            }

            let total = 0;
            let porTipo = { pix: 0, debito: 0, credito: 0, dinheiro: 0 };
            let porBarbeiro = {};

            lista.forEach((a) => {
              let v = Number(a.preco || 0);
              total += v;
              if (porTipo[a.pagamento] != null) porTipo[a.pagamento] += v;
              if (!porBarbeiro[a.barbeiro]) porBarbeiro[a.barbeiro] = 0;
              porBarbeiro[a.barbeiro] += v;
            });

            let barbeiroHtml = Object.entries(porBarbeiro).map(([n,v]) => `${n}: R$ ${formatarPreco(v)}`).join("<br>");

            relOut.innerHTML = `
<b>Por forma de pagamento:</b><br>
PIX: R$ ${formatarPreco(porTipo.pix)}<br>
Débito: R$ ${formatarPreco(porTipo.debito)}<br>
Crédito: R$ ${formatarPreco(porTipo.credito)}<br>
Dinheiro: R$ ${formatarPreco(porTipo.dinheiro)}<br><br>
<b>Por barbeiro:</b><br>
${barbeiroHtml || "Nenhum"}<br><br>
<div class="price">Total: R$ ${formatarPreco(total)}</div>
<button class="btn-export" style="margin-top:12px" onclick="exportarRelPeriodo()">📊 Exportar para Excel</button>
`;

            window._relPeriodoDados = [
              ["Relatório - Período: " + d],
              [],
              ["Cliente", "Barbeiro", "Serviço", "Data", "Hora", "Pagamento", "Valor (R$)"]
            ];
            lista.sort((a,b) => (a.data + a.hora).localeCompare(b.data + b.hora));
            lista.forEach((a) => {
              window._relPeriodoDados.push([a.cliente, a.barbeiro, a.servico, a.data, a.hora, a.pagamento, formatarPreco(a.preco)]);
            });
            window._relPeriodoDados.push([]);
            window._relPeriodoDados.push(["TOTAL", "", "", "", "", "", formatarPreco(total)]);

            window._relPeriodoRef = d;
          };
        };

        function exportarRelPeriodo() {
          if (window._relPeriodoDados) {
            exportarExcel(window._relPeriodoDados, "vendas_periodo_" + (window._relPeriodoRef || "relatorio"));
          }
        }

        // =====================================================
        // ================= COMISSÕES =========================
        // =====================================================

        comissaoTipoSel.onchange = () => {
          let tipo = comissaoTipoSel.value;
          let container = document.getElementById("comissaoInputContainer");
          if (tipo === "dia") {
            container.innerHTML = `<input type="date" id="comissaoRefDia" />`;
          } else if (tipo === "mes") {
            container.innerHTML = `<input type="month" id="comissaoRefDia" style="width:100%; padding:16px; border-radius:14px; border:none; margin-top:8px; margin-bottom:14px; color:#000; font-size:15px;" />`;
          } else if (tipo === "ano") {
            const anos = [...new Set(agendamentos.map((a) => a.data.split("-")[0]))].sort().reverse();
            if (anos.length === 0) {
              const anoAtual = new Date().getFullYear();
              anos.push(anoAtual.toString());
            }
            let options = anos.map((a) => `<option value="${a}">${a}</option>`).join("");
            container.innerHTML = `<select id="comissaoRefDia" style="width:100%; padding:16px; border-radius:14px; border:none; margin-top:8px; margin-bottom:14px; color:#000; font-size:15px;">${options}</select>`;
          }
        };

        btnGerarComissao.onclick = () => {
          let d = document.getElementById("comissaoRefDia").value;
          let tipo = comissaoTipoSel.value;
          if (!d) { alert("Selecione o período"); return; }

          let refParts = d.split("-");
          let lista = agendamentos.filter((a) => {
            if (!a.data) return false;
            let aParts = a.data.split("-");
            if (tipo === "dia") return a.data === d;
            if (tipo === "mes") return aParts[0] === refParts[0] && aParts[1] === refParts[1];
            if (tipo === "ano") return aParts[0] === d;
            return false;
          });

          let porBarbeiro = {};
          lista.forEach((a) => {
            let nome = a.barbeiro;
            if (!porBarbeiro[nome]) porBarbeiro[nome] = [];
            porBarbeiro[nome].push(a);
          });

          let html = "";
          let grandTotal = 0;
          let grandComissaoTotal = 0;
          let csvDados = [["Barbeiro", "Serviço", "Data", "Hora", "Valor (R$)", "% Comissão", "Comissão (R$)"]];

          let nomesBarbeiros = Object.keys(porBarbeiro).sort();

          let filtBarbeiro = document.getElementById("comissaoBarbeiroFiltro").value;
          if (filtBarbeiro !== "todos") {
            let filtered = {};
            if (porBarbeiro[filtBarbeiro]) filtered[filtBarbeiro] = porBarbeiro[filtBarbeiro];
            porBarbeiro = filtered;
            nomesBarbeiros = Object.keys(porBarbeiro).sort();
          }

          nomesBarbeiros.forEach((nome) => {
            let ags = porBarbeiro[nome];
            let subtotal = 0;
            let pct = null;
            for (let key in COMISSOES) {
              if (key.toLowerCase() === nome.toLowerCase()) { pct = COMISSOES[key]; break; }
            }
            if (pct == null) pct = 42;

            html += `<table class="comissao-table">`;
            html += `<tr><th colspan="4" style="font-size:15px;">✂️ ${nome} — Comissão: ${pct}%</th></tr>`;
            html += `<tr><th>Serviço</th><th>Data</th><th>Hora</th><th>Valor</th></tr>`;

            ags.sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));

            ags.forEach((a) => {
              let v = Number(a.preco || 0);
              subtotal += v;
              html += `<tr><td>${a.servico}</td><td>${a.data}</td><td>${a.hora}</td><td>R$ ${formatarPreco(v)}</td></tr>`;
              csvDados.push([nome, a.servico, a.data, a.hora, formatarPreco(v), pct + "%", formatarPreco(v * pct / 100)]);
            });

            let comissaoVal = subtotal * pct / 100;
            grandTotal += subtotal;
            grandComissaoTotal += comissaoVal;

            html += `<tr class="subtotal-row"><td colspan="3">Subtotal / Comissão</td><td>R$ ${formatarPreco(subtotal)} → R$ ${formatarPreco(comissaoVal)}</td></tr>`;
            html += `</table><br>`;

            csvDados.push([nome, "SUBTOTAL", "", "", formatarPreco(subtotal), pct + "%", formatarPreco(comissaoVal)]);
            csvDados.push([]);
          });

          if (nomesBarbeiros.length === 0) {
            html = "<p>Nenhum agendamento encontrado no período.</p>";
          } else {
            html += `<table class="comissao-table"><tr class="grand-total-row"><td colspan="3">TOTAL GERAL</td><td>R$ ${formatarPreco(grandTotal)}</td></tr>`;
            html += `<tr class="grand-total-row"><td colspan="3">TOTAL COMISSÕES</td><td>R$ ${formatarPreco(grandComissaoTotal)}</td></tr></table>`;

            csvDados.push(["TOTAL GERAL", "", "", "", formatarPreco(grandTotal), "", formatarPreco(grandComissaoTotal)]);

            html += `<button class="btn-export" onclick="exportarComissaoCSV()">📊 Exportar para Excel</button>`;

            window._comissaoCsvDados = csvDados;
            window._comissaoPeriodo = d;
          }

          comissaoOut.innerHTML = html;
        };

        function exportarComissaoCSV() {
          if (window._comissaoCsvDados) {
            exportarExcel(window._comissaoCsvDados, "comissoes_" + (window._comissaoPeriodo || "relatorio"));
          }
        }

        // =====================================================
        // ================= DESPESAS ==========================
        // =====================================================

        btnAddDespesa.onclick = () => {
          let produto = despesaProduto.value.trim();
          let qtd = Number(despesaQtd.value) || 1;
          let valor = Number(despesaValor.value) || 0;
          let data = despesaData.value;

          if (!produto) { alert("Informe o nome do produto"); return; }
          if (!valor) { alert("Informe o valor"); return; }
          if (!data) { alert("Informe a data"); return; }

          DB.despesas.push({
            produto: produto,
            quantidade: qtd,
            valor: valor,
            data: data,
            ts: Date.now(),
          });

          despesaProduto.value = "";
          despesaQtd.value = "";
          despesaValor.value = "";
          despesaData.value = "";

          alert("Despesa adicionada");
        };

        despesaFiltroTipo.onchange = () => {
          let tipo = despesaFiltroTipo.value;
          let container = document.getElementById("despesaFiltroContainer");
          if (tipo === "todos") {
            container.innerHTML = "";
          } else if (tipo === "dia") {
            container.innerHTML = `<input type="date" id="despesaFiltroRef" onchange="renderDespesas()" />`;
          } else if (tipo === "mes") {
            container.innerHTML = `<input type="month" id="despesaFiltroRef" style="width:100%; padding:16px; border-radius:14px; border:none; color:#000; font-size:15px;" onchange="renderDespesas()" />`;
          } else if (tipo === "ano") {
            let anos = [];
            Object.values(despesas).forEach((d) => {
              if (d.data) {
                let y = d.data.split("-")[0];
                if (!anos.includes(y)) anos.push(y);
              }
            });
            anos.sort().reverse();
            if (!anos.length) anos.push(new Date().getFullYear().toString());
            let opts = anos.map((a) => `<option value="${a}">${a}</option>`).join("");
            container.innerHTML = `<select id="despesaFiltroRef" style="width:100%; padding:16px; border-radius:14px; border:none; color:#000; font-size:15px;" onchange="renderDespesas()">${opts}</select>`;
          }
          renderDespesas();
        };

        function renderDespesas() {
          listaDespesas.innerHTML = "";
          totalDespesas.innerHTML = "";

          let tipo = despesaFiltroTipo.value;
          let ref = "";
          let refEl = document.getElementById("despesaFiltroRef");
          if (refEl) ref = refEl.value;

          let entries = Object.entries(despesas);
          let filtered = entries.filter(([k, d]) => {
            if (tipo === "todos") return true;
            if (!d.data || !ref) return false;
            let parts = d.data.split("-");
            let refParts = ref.split("-");
            if (tipo === "dia") return d.data === ref;
            if (tipo === "mes") return parts[0] === refParts[0] && parts[1] === refParts[1];
            if (tipo === "ano") return parts[0] === ref;
            return false;
          });

          let total = 0;

          filtered.sort((a, b) => (b[1].ts || 0) - (a[1].ts || 0));

          filtered.forEach(([key, d]) => {
            let v = Number(d.valor || 0) * Number(d.quantidade || 1);
            total += v;

            let div = document.createElement("div");
            div.className = "card card-sub";
            div.style.marginBottom = "10px";

            div.innerHTML = `
<b>${d.produto}</b><br>
Qtd: ${d.quantidade || 1} | Valor: R$ ${formatarPreco(d.valor)} | Total: R$ ${formatarPreco(v)}<br>
Data: ${d.data || "-"}
<button class="btn-danger btn" style="margin-top:8px" onclick="excluirDespesa('${key}')">Excluir</button>
`;

            listaDespesas.appendChild(div);
          });

          if (!filtered.length) {
            listaDespesas.innerHTML = "Nenhuma despesa encontrada.";
          }

          totalDespesas.innerHTML = `<div class="price">Total despesas: R$ ${formatarPreco(total)}</div>
<button class="btn-export" style="margin-top:12px" onclick="exportarDespesas()">📊 Exportar para Excel</button>`;

          window._despesasDados = [["Produto", "Quantidade", "Valor Unit.", "Total", "Data"]];
          filtered.forEach(([key, d]) => {
            let v = Number(d.valor || 0) * Number(d.quantidade || 1);
            window._despesasDados.push([d.produto, d.quantidade || 1, formatarPreco(d.valor), formatarPreco(v), d.data || "-"]);
          });
          window._despesasDados.push([]);
          window._despesasDados.push(["TOTAL", "", "", formatarPreco(total), ""]);
        }

        function excluirDespesa(key) {
          if (!confirm("Excluir despesa?")) return;
          DB.despesas.child(key).remove();
        }

        function exportarDespesas() {
          if (window._despesasDados) {
            exportarExcel(window._despesasDados, "despesas_relatorio");
          }
        }

        // =====================================================
        // ================= CLIENTES ==========================
        // =====================================================

        function renderClientes() {
          listaClientes.innerHTML = "";

          let entries = Object.entries(clientes);

          if (!entries.length) {
            listaClientes.innerHTML = "Nenhum cliente registrado.";
            return;
          }

          entries.sort((a, b) => (a[1].nome || "").localeCompare(b[1].nome || ""));

          entries.forEach(([key, c]) => {
            let div = document.createElement("div");
            div.className = "card card-sub";
            div.style.marginBottom = "10px";

            div.innerHTML = `
<b>${c.nome || "-"}</b><br>
📱 ${c.fone || key}

<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
<button class="btn-outline" style="flex:1;min-width:90px;font-size:12px;padding:10px;" onclick="copiarFone('${c.fone || key}')">Copiar tel.</button>
<button class="btn-dark btn" style="flex:1;min-width:90px;font-size:12px;padding:10px;" onclick="window.open('https://wa.me/55${(c.fone || key).replace(/\\D/g,'')}')">WhatsApp</button>
<button class="btn-outline" style="flex:1;min-width:90px;font-size:12px;padding:10px;" onclick="editarCliente('${key}')">Editar</button>
<button class="btn-danger btn" style="flex:1;min-width:90px;font-size:12px;padding:10px;" onclick="excluirCliente('${key}')">Excluir</button>
</div>
`;

            listaClientes.appendChild(div);
          });
        }

        function editarCliente(key) {
          let c = clientes[key];
          if (!c) return;
          let novoNome = prompt("Nome do cliente:", c.nome || "");
          if (novoNome === null) return;
          let novoFone = prompt("Telefone do cliente:", c.fone || key);
          if (novoFone === null) return;
          novoNome = novoNome.trim();
          novoFone = novoFone.trim();
          if (!novoNome || !novoFone) { alert("Nome e telefone são obrigatórios."); return; }
          DB.clientes.child(key).update({ nome: novoNome, fone: novoFone });
          alert("Cliente atualizado!");
        }

        function excluirCliente(key) {
          if (!confirm("Excluir este cliente da lista?")) return;
          DB.clientes.child(key).remove();
        }

        // =====================================================
        // ================= SYNC FIREBASE =====================
        // =====================================================

        DB.servicos.on("value", (snap) => {
          if (snap.exists()) {
            servicos = Object.values(snap.val());
          } else {
            DB.servicos.set([
              { nome: "Degradê", preco: 40 },
              { nome: "Social", preco: 35 },
              { nome: "Barba", preco: 30 },
            ]);
            return;
          }

          renderServicos();
          renderAdminServicos();
          renderOCServicos();
        });

        DB.barbeiros.on("value", (snap) => {
          if (snap.exists()) {
            barbeiros = Object.values(snap.val());
          } else {
            DB.barbeiros.set([{nome:"Lucas"},{nome:"Rafael"},{nome:"Bruno"}]);
            return;
          }

          renderBarbeiros();
          renderAdminBarbeiros();
          popularSelectsBarbeiro();
          popularModoBarbeiro();
        });

        DB.disp.on("value", (snap) => {
          disponibilidade = snap.exists() ? snap.val() : {};
          if (barbeiroSel) renderDatasCliente();
          if (!telaBarbeiro.classList.contains("hidden")) {
            renderBarbResetDias();
          }
        });

        DB.ag.on("value", (snap) => {
          agendamentosMap = snap.exists() ? snap.val() : {};
          agendamentos = Object.values(agendamentosMap);
          if (!telaBarbeiro.classList.contains("hidden")) {
            renderAdminAgendamentos();
            renderAgendaBarbeiro();
          }
          if (barbeiroSel && dataSel) renderHorariosCliente();
        });

        DB.config.on("value", (snap) => {
          if (snap.exists()) {
            config = snap.val();
          }
        });

        DB.despesas.on("value", (snap) => {
          despesas = snap.exists() ? snap.val() : {};
          if (!telaAdmin.classList.contains("hidden")) {
            renderDespesas();
          }
        });

        DB.clientes.on("value", (snap) => {
          clientes = snap.exists() ? snap.val() : {};
          if (!telaAdmin.classList.contains("hidden")) {
            renderClientes();
          }
        });

        (function initInstallApp() {
          const btnInstalar = document.getElementById("btnInstalarApp");
          const installModal = document.getElementById("installModal");
          const installModalClose = document.getElementById("installModalClose");
          const installModalOk = document.getElementById("installModalOk");

          if (!btnInstalar || !installModal) return;

          const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

          if (isStandalone) {
            btnInstalar.style.display = "none";
            return;
          }

          function detectPlatform() {
            const ua = navigator.userAgent || "";
            if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
              return "ios";
            }
            if (/Android/i.test(ua)) {
              return "android";
            }
            return "desktop";
          }

          const platform = detectPlatform();
          let deferredPrompt = null;

          window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
          });

          window.addEventListener("appinstalled", () => {
            deferredPrompt = null;
            btnInstalar.style.display = "none";
          });

          function showInstructionsModal() {
            const instrAndroid = document.getElementById("instrucaoAndroid");
            const instrIOS = document.getElementById("instrucaoIOS");
            const instrDesktop = document.getElementById("instrucaoDesktop");
            if (instrAndroid) instrAndroid.classList.toggle("hidden", platform !== "android");
            if (instrIOS) instrIOS.classList.toggle("hidden", platform !== "ios");
            if (instrDesktop) instrDesktop.classList.toggle("hidden", platform !== "desktop");
            installModal.classList.remove("hidden");
          }

          function closeModal() {
            installModal.classList.add("hidden");
          }

          btnInstalar.addEventListener("click", async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              const result = await deferredPrompt.userChoice;
              if (result.outcome === "accepted") {
                btnInstalar.style.display = "none";
              }
              deferredPrompt = null;
            } else {
              showInstructionsModal();
            }
          });

          if (installModalClose) installModalClose.addEventListener("click", closeModal);
          if (installModalOk) installModalOk.addEventListener("click", closeModal);
          installModal.addEventListener("click", (e) => {
            if (e.target === installModal) closeModal();
          });
        })();
      
