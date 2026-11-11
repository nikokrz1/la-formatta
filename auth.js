(function () {
  var SB_URL = "https://fwsvefewovxfdjytktxn.supabase.co";
  var ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3c3ZlZmV3b3Z4ZmRqeXRrdHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2Nzg4MzMsImV4cCI6MjEwMzI1NDgzM30.hweZym6XaB1G1QCSFLXxE4Sm2JhC775XxW6nhtZ0APc";
  var EMAIL = "equipe@laformatta.app";
  var KEY = "lbd_session";
  var pending = null;

  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function authCall(grant, body) {
    return fetch(SB_URL + '/auth/v1/token?grant_type=' + grant, {
      method: 'POST',
      headers: { 'apikey': ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) { return { ok: r.ok, data: j }; });
    });
  }

  function store(d) {
    save({ access_token: d.access_token, refresh_token: d.refresh_token, expires_at: Date.now() + (d.expires_in - 30) * 1000 });
    return d.access_token;
  }

  function showLogin() {
    return new Promise(function (resolve) {
      var ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#fff8f0;display:flex;align-items:center;justify-content:center;padding:20px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
      ov.innerHTML =
        '<form style="width:100%;max-width:320px;text-align:center">' +
        '<div style="font-size:42px">🍕</div>' +
        '<h1 style="font-size:20px;margin:8px 0 4px;color:#222">La Formatta Pizzaria</h1>' +
        '<p style="color:#666;font-size:14px;margin:0 0 18px">Digite a senha para continuar</p>' +
        '<input type="password" autocomplete="current-password" placeholder="Senha" style="width:100%;box-sizing:border-box;padding:12px;font-size:16px;border:1px solid #ccc;border-radius:8px">' +
        '<div class="lbd-err" style="color:#c0392b;font-size:13px;min-height:18px;margin:8px 0"></div>' +
        '<button type="submit" style="width:100%;padding:12px;font-size:16px;border:0;border-radius:8px;background:#c0392b;color:#fff;cursor:pointer">Entrar</button>' +
        '</form>';
      document.body.appendChild(ov);
      var form = ov.querySelector('form');
      var input = ov.querySelector('input');
      var err = ov.querySelector('.lbd-err');
      var btn = ov.querySelector('button');
      input.focus();
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!input.value) return;
        btn.disabled = true;
        err.textContent = '';
        authCall('password', { email: EMAIL, password: input.value }).then(function (res) {
          if (res.ok) {
            var t = store(res.data);
            ov.remove();
            resolve(t);
          } else {
            err.textContent = 'Senha incorreta';
            input.select();
            btn.disabled = false;
          }
        }).catch(function () {
          err.textContent = 'Sem conexão — tente de novo';
          btn.disabled = false;
        });
      });
    });
  }

  function ensure() {
    var s = load();
    if (s && s.expires_at > Date.now()) return Promise.resolve(s.access_token);
    if (pending) return pending;
    var p;
    if (s && s.refresh_token) {
      p = authCall('refresh_token', { refresh_token: s.refresh_token }).then(function (res) {
        if (res.ok) return store(res.data);
        clear();
        return showLogin();
      });
    } else {
      p = showLogin();
    }
    pending = p.then(function (t) { pending = null; return t; }, function (e) { pending = null; throw e; });
    return pending;
  }

  window.lbdAuth = { ensure: ensure };
})();
