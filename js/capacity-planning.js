(function () {
  'use strict';
  if(!document.getElementById('capacity-calculator'))return;
  const byId = (id) => document.getElementById(id);
  const n = (id) => Math.max(0, Number.parseFloat(byId(id).value) || 0);

  function calculate() {
    const invalid=[...document.querySelectorAll('#capacity-calculator input:not([readonly])')].some(input=>input.value!==''&&(!Number.isFinite(Number(input.value))||Number(input.value)<0));
    if(invalid){byId('capacity-validation').textContent='Enter non-negative numbers. Negative values cannot be used in a forecast.';byId('prediction-number').textContent='—';byId('prediction-raw').textContent='—';return;}
    const velocityN = n('velocity-n');
    const velocityN1 = n('velocity-n1');
    const velocityN2 = n('velocity-n2');
    const sprintDays = n('sprint-days');
    const developers = n('developers');
    const availableDays = n('available-days');
    const validation = byId('capacity-validation');

    const values = ['velocity-n','velocity-n1','velocity-n2'].filter(id=>byId(id).value.trim()!=='').map(n);
    const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    const allocatedDays = sprintDays * developers;
    const availableHeadcount = sprintDays > 0 ? availableDays / sprintDays : 0;
    const capacityFactor = allocatedDays > 0 ? availableDays / allocatedDays : 0;
    const prediction = average * capacityFactor;

    byId('average-velocity').value = average ? average.toFixed(2).replace(/\.00$/, '') : '0';
    byId('average-velocity-display').textContent = average ? average.toFixed(2).replace(/\.00$/, '') : '0';
    byId('rolling-average').value = average ? average.toFixed(2).replace(/\.00$/, '') : '0';
    byId('allocated-days').value = allocatedDays ? allocatedDays.toFixed(2).replace(/\.00$/, '') : '0';
    byId('available-headcount').textContent = availableHeadcount.toFixed(2).replace(/\.00$/, '');
    byId('capacity-factor').textContent = (capacityFactor * 100).toFixed(1) + '%';
    byId('prediction-number').textContent = prediction ? Math.round(prediction) : '0';
    byId('prediction-raw').textContent = prediction ? prediction.toFixed(2) : '0.00';
    byId('prediction-capacity').textContent = (capacityFactor * 100).toFixed(1) + '%';
    byId('prediction-history').textContent = average ? average.toFixed(2).replace(/\.00$/, '') : '0';

    validation.textContent = '';
    if (developers > 0 && sprintDays > 0 && availableDays > allocatedDays) {
      validation.textContent = 'Available Person-Days exceed allocated capacity. Check the input if this is not intentional.';
    }
  }

  function reset() {
    byId('velocity-n').value = '';
    byId('velocity-n1').value = '';
    byId('velocity-n2').value = '';
    byId('available-days').value = '';
    byId('sprint-days').value = '10';
    byId('developers').value = '7';
    calculate();
  }

  document.querySelectorAll('#capacity-calculator input').forEach((input) => input.addEventListener('input', calculate));
  byId('capacity-reset').addEventListener('click', reset);
  calculate();
})();
