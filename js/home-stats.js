(function () {
  const stats = {
    learn: document.querySelector('[data-stat="learn"]'),
    tools: document.querySelector('[data-stat="tools"]'),
    practice: document.querySelector('[data-stat="practice"]'),
    prompts: document.querySelector('[data-stat="prompts"]'),
    jql: document.querySelector('[data-stat="jql"]'),
    books: document.querySelector('[data-stat="books"]')
  };

  if (!Object.values(stats).some(Boolean)) return;

  const fallback = { learn: 19, tools: 12, practice: 7, prompts: 11, jql: 40, books: 35 };

  function setStat(key, value) {
    if (!stats[key] || !Number.isFinite(value)) return;
    stats[key].textContent = value;
  }

  Object.keys(fallback).forEach(key => setStat(key, fallback[key]));

  async function fetchRepoTree() {
    const repo = window.SITE_CONFIG?.githubRepo;
    const branch = window.SITE_CONFIG?.githubBranch || 'main';
    if (!repo) return null;

    const response = await fetch(
      `https://api.github.com/repos/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (!response.ok) throw new Error(`GitHub tree request failed: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.tree) ? data.tree : null;
  }

  function countHtml(tree, prefix) {
    return tree.filter(item =>
      item.type === 'blob' &&
      item.path.startsWith(prefix + '/') &&
      item.path.endsWith('.html') &&
      item.path !== prefix + '/index.html'
    ).length;
  }

  async function fetchText(path) {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`${path}: ${response.status}`);
    return response.text();
  }

  async function updateDataDrivenCounts() {
    try {
      const [booksText, jqlText] = await Promise.all([
        fetchText(`${window.SITE_CONFIG?.basePath || ''}js/books-data.js`),
        fetchText(`${window.SITE_CONFIG?.basePath || ''}js/jql-data.js`)
      ]);

      const bookCount = (booksText.match(/"title"\s*:/g) || []).length;
      const jqlCount = (jqlText.match(/\{n:\s*\d+/g) || []).length;
      if (bookCount) setStat('books', bookCount);
      if (jqlCount) setStat('jql', jqlCount);
    } catch (_) {
      // Keep the truthful fallback values if local data files cannot be read.
    }
  }

  async function updatePageCounts() {
    try {
      const tree = await fetchRepoTree();
      if (!tree) return;
      setStat('learn', countHtml(tree, 'learn'));
      setStat('tools', countHtml(tree, 'tools'));
      setStat('practice', countHtml(tree, 'practice'));
      setStat('prompts', countHtml(tree, 'resources/prompts'));
    } catch (_) {
      // GitHub API is an enhancement. The page remains useful with local fallback counts.
    }
  }

  updatePageCounts();
  updateDataDrivenCounts();
})();
