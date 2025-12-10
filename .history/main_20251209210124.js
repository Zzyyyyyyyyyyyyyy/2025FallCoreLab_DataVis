// State variables
let chart = null;
let compareMode = false;
let baseYear = 2015;
let isPlaying = false;
let playInterval = null;
let currentYearIndex = 0;

function getSelectedCountries() {
  const chips = document.querySelectorAll('.country-chip.selected');
  return Array.from(chips).map(chip => chip.dataset.country);
}

// Gradient fill effect: fades from color to transparent
function createGradient(ctx, color) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 500);
  gradient.addColorStop(0, color + '60');
  gradient.addColorStop(0.5, color + '20');
  gradient.addColorStop(1, color + '00');
  return gradient;
}

// Transform data: raw GDP or percentage growth from base year
function getChartData(country, maxIndex = null) {
  const rawData = gdpData.countries[country];
  let data = maxIndex !== null ? rawData.slice(0, maxIndex + 1) : rawData;

  if (!compareMode) {
    return data;
  }

  // Calculate percentage change from base year
  const baseIndex = gdpData.labels.indexOf(baseYear);
  const baseValue = rawData[baseIndex];

  return data.map(value => {
    return Math.round((((value - baseValue) / baseValue) * 100) * 10) / 10;
  });
}

function createDatasets(countries, ctx, maxIndex = null) {
  return countries.map((country) => {
    const data = getChartData(country, maxIndex);
    const color = countryColors[country];

    return {
      label: country,
      data: data,
      borderColor: color,
      backgroundColor: createGradient(ctx, color),
      tension: 0.4,
      fill: true,
      pointRadius: 5,
      pointHoverRadius: 9,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: color,
      pointHoverBorderWidth: 3,
      borderWidth: 3,
      // Segment styling: green for rising, red for falling
      segment: {
        borderColor: function(ctx) {
          if (ctx.p0.parsed.y < ctx.p1.parsed.y) {
            return '#22c55e'; // green
          } else if (ctx.p0.parsed.y > ctx.p1.parsed.y) {
            return '#ef4444'; // red
          }
          return color;
        }
      }
    };
  });
}

function createChart(countries, maxIndex = null, animate = true) {
  const canvas = document.getElementById('gdpChart');
  const ctx = canvas.getContext('2d');

  if (chart) {
    chart.destroy();
  }

  if (countries.length === 0) {
    return;
  }

  const datasets = createDatasets(countries, ctx, maxIndex);
  const labels = maxIndex !== null
    ? gdpData.labels.slice(0, maxIndex + 1)
    : gdpData.labels;

  // Dynamic titles based on mode
  const yAxisTitle = compareMode
    ? `Growth from ${baseYear} (%)`
    : 'GDP (Trillion USD)';

  const chartTitle = compareMode
    ? `GDP Growth Comparison (Base: ${baseYear})`
    : 'GDP Comparison by Country';

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: animate ? {
        duration: 400,
        easing: 'easeOutQuart'
      } : false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: chartTitle,
          font: { size: 20, weight: 'bold' },
          padding: { bottom: 20 }
        },
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: { size: 13 }
          }
        },
        // Custom tooltip with trend arrows
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 13 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              const current = context.parsed.y;
              const dataIndex = context.dataIndex;
              const dataset = context.dataset.data;
              let trend = '';

              // Add trend arrow
              if (dataIndex > 0) {
                const prev = dataset[dataIndex - 1];
                if (current > prev) trend = ' ▲';
                else if (current < prev) trend = ' ▼';
              }

              // Format based on mode
              if (compareMode) {
                const sign = current >= 0 ? '+' : '';
                return ' ' + context.dataset.label + ': ' + sign + current + '%' + trend;
              }
              return ' ' + context.dataset.label + ': $' + current + ' Trillion' + trend;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Year',
            font: { size: 14, weight: 'bold' }
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        y: {
          title: {
            display: true,
            text: yAxisTitle,
            font: { size: 14, weight: 'bold' }
          },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        }
      }
    }
  });
}

// Timeline playback: animate through years
function startPlayback() {
  const playBtn = document.getElementById('playBtn');
  const yearDisplay = document.getElementById('yearDisplay');

  isPlaying = true;
  currentYearIndex = 0;
  playBtn.classList.add('playing');
  playBtn.innerHTML = '<span class="mode-icon">⏸</span>Pause';
  yearDisplay.classList.remove('hidden');

  function tick() {
    if (currentYearIndex >= gdpData.labels.length) {
      stopPlayback();
      return;
    }

    yearDisplay.textContent = gdpData.labels[currentYearIndex];
    createChart(getSelectedCountries(), currentYearIndex, true);
    currentYearIndex++;
  }

  tick();
  playInterval = setInterval(tick, 800);
}

function stopPlayback() {
  const playBtn = document.getElementById('playBtn');
  const yearDisplay = document.getElementById('yearDisplay');

  isPlaying = false;
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }

  playBtn.classList.remove('playing');
  playBtn.innerHTML = '<span class="mode-icon">▶</span>Play Timeline';
  yearDisplay.classList.add('hidden');
  createChart(getSelectedCountries());
}

// Event listeners
document.querySelectorAll('.country-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    this.classList.toggle('selected');
    if (isPlaying) stopPlayback();
    createChart(getSelectedCountries());
  });
});

document.getElementById('playBtn').addEventListener('click', function() {
  if (isPlaying) {
    stopPlayback();
  } else {
    startPlayback();
  }
});

document.getElementById('compareModeBtn').addEventListener('click', function() {
  compareMode = !compareMode;
  this.classList.toggle('active', compareMode);
  this.innerHTML = compareMode
    ? '<span class="mode-icon">📈</span>Compare Mode: ON'
    : '<span class="mode-icon">📊</span>Compare Mode: OFF';

  document.getElementById('baseYearControl').classList.toggle('hidden', !compareMode);

  if (isPlaying) stopPlayback();
  createChart(getSelectedCountries());
});

document.getElementById('baseYearSelect').addEventListener('change', function() {
  baseYear = parseInt(this.value);
  if (isPlaying) stopPlayback();
  createChart(getSelectedCountries());
});

// Initialize chart
createChart(getSelectedCountries());
