/* Agile Orbit Practice — rebuilt from the supplied themed master workbook.
   452 questions across 9 themes. */
(function(){'use strict';
const DATA=[...REDACTED...];
window.PRACTICE_THEMES=[...REDACTED...];
window.PRACTICE_QUESTIONS=DATA;
if(DATA.length!==452) throw new Error('Practice bank integrity error: expected 452 questions.');
if(new Set(DATA.map(q=>q.id)).size!==452) throw new Error('Practice bank integrity error: duplicate question IDs.');
document.dispatchEvent(new CustomEvent('practice-data-ready'));
})();