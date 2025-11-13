function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    const obj = {};
    headers.forEach((h,i) => obj[h] = cols[i]);
    return obj;
  });
}

// Elementos DOM
const categorySelect = document.getElementById('categoryFilter');
const resetBtn = document.getElementById('resetBtn');
const detailsContent = document.getElementById('detailsContent');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

// Chart.js variables
let chart = null;
let rawData = [];

async function loadData(){
  try {
    const res = await fetch('sales.csv');
    if(!res.ok) throw new Error('No se pudo cargar sales.csv (ver servidor).');
    const txt = await res.text();
    rawData = parseCSV(txt);
    initFilters();
    renderChart('all');
  } catch (err) {
    detailsContent.textContent = 'Error cargando datos: ' + err.message ;
  }
}

// Inicializar filtros (llenar select según categorías únicas)
function initFilters(){
  const cats = Array.from(new Set(rawData.map(r => r.category))).sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });
}


function aggregateByMonth(category){
  const filtered = category === 'all' ? rawData : rawData.filter(r => r.category === category);
  const map = new Map();
  filtered.forEach(r => {
    const m = r.month;
    const val = Number(r.value) || 0;
    map.set(m, (map.get(m) || 0) + val);
  });
  const months = Array.from(map.keys()).sort();
  const values = months.map(m => map.get(m));
  return { months, values, sampleRows: filtered.slice(0,5) };
}


function renderChart(category){
  const ctx = document.getElementById('mainChart').getContext('2d');
  const agg = aggregateByMonth(category);
  const data = {
    labels: agg.months,
    datasets: [{
      label: 'Productos',
      data: agg.values,
      borderRadius: 6,
      barThickness: 28,
      backgroundColor: function(context){
        // gradiente o color según índice
        return 'rgba(155,79,209,0.85)';
      }
    }]
  };

  const config = {
    type: 'bar',
    data,
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}`
          }
        },
        legend: { display: false }
      },
      onClick: (evt, elements) => {
        if(elements.length > 0){
          const el = elements[0];
          const idx = el.index;
          const month = data.labels[idx];
          const value = data.datasets[0].data[idx];
          showDetailModal(month, value, agg.sampleRows);
        }
      },
      scales: {
        x: { title: { display: true, text: 'Mes' } },
        y: { title: { display: true, text: 'Productos' }, beginAtZero: true }
      }
    }
  };

  if(chart) chart.destroy();
  chart = new Chart(ctx, config);

  detailsContent.innerHTML = `Mostrando <strong>${category}</strong>. Meses: ${agg.months.length}. Haz clic en una barra para ver detalle.`;
}

function showDetailModal(month, value, sampleRows){
  modalBody.innerHTML = `<p><strong>Mes:</strong> ${month}</p>
                         <p><strong>Total productos: </strong> ${value}</p>
                         <h4>Muestras (primeras filas)</h4>
                         <pre style="white-space:pre-wrap">${JSON.stringify(sampleRows, null, 2)}</pre>`;
  modal.setAttribute('aria-hidden','false');
  modal.style.display = 'flex';
  modalClose.focus();
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
  modal.style.display = 'none';
  categorySelect.focus();
}


categorySelect.addEventListener('change', (e) => renderChart(e.target.value));
resetBtn.addEventListener('click', () => {
  categorySelect.value = 'all';
  renderChart('all');
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if(e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
});

// Iniciar
loadData();
