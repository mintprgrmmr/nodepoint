(function () {
  const themes = [
    'theme-classic',
    'theme-crisp',
    'theme-gray',
    'theme-neptune',
    'theme-triton'
  ];

  const defaultTheme = 'theme-triton';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  function getSavedTheme() {
    let theme = localStorage.getItem('theme');
    if (!theme || !themes.includes(theme)) {
      theme = defaultTheme;
      localStorage.setItem('theme', theme);
    }
    return theme;
  }

  function getSavedMode() {
    return localStorage.getItem('mode') || (prefersDark ? 'dark' : 'light');
  }

  function updateThemePreviews(themeKey, mode) {
    document.querySelectorAll('.theme-preview').forEach(p => {
      const isSelected = p.dataset.theme === themeKey;
      p.classList.toggle('selected', isSelected);
      p.classList.toggle('dark', mode === 'dark');
    });
  }

  function updateToggleUI(mode) {
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) toggle.checked = mode === 'dark';
  }

  function setupUI(container) {
    const previews = container.querySelectorAll('.theme-preview');
    const toggle = container.querySelector('#dark-mode-toggle');

    previews.forEach(p => {
      p.addEventListener('click', () => {
        const selected = p.dataset.theme;
        if (!themes.includes(selected)) return;
        localStorage.setItem('theme', selected);
        location.reload();
      });

      const title = p.dataset.tooltip || p.title;
      if (title) {
        p.addEventListener('mouseenter', () => {
          const tooltip = document.createElement('div');
          tooltip.className = 'theme-tooltip';
          tooltip.textContent = title;
          document.body.appendChild(tooltip);
          const rect = p.getBoundingClientRect();
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.top - 24}px`;
          p._tooltip = tooltip;
        });

        p.addEventListener('mouseleave', () => {
          if (p._tooltip) {
            document.body.removeChild(p._tooltip);
            p._tooltip = null;
          }
        });
      }
    });

    toggle?.addEventListener('change', () => {
      const mode = toggle.checked ? 'dark' : 'light';
      localStorage.setItem('mode', mode);
      location.reload();
    });
  }

  // Глобальный инициализатор для вызова из Main.js
  window.__themeSwitcherInit__ = function(container) {
    const themeKey = getSavedTheme();
    const mode = getSavedMode();
    updateThemePreviews(themeKey, mode);
    updateToggleUI(mode);
    setupUI(container);
  };
})();
