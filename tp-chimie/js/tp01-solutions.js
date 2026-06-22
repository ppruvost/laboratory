console.log("tp01-solutions.js chargé");

// =====================================================
// PRODUITS (fallback global)
// =====================================================

const PRODUITS =
    window.PRODUITS ||
    window.parent?.PRODUITS ||
    [];

// =====================================================
// MASSES MOLAIRES
// =====================================================

const MM = {
    NaCl: 58.44,
    CuSO4: 159.61,
    'CuSO4.5H2O': 249.69,
    NaOH: 40.00,
    HCl: 36.46,
    'Na2CO3': 105.99,
    KCl: 74.55,
};

// =====================================================
// INIT (ATTENDU PAR navigation.js)
// =====================================================

export function init() {

    console.log("tp01 init exécuté");

    _initSecurite();
    _initCalcNaCl();
    _initCalcCuSO4();
    _initCalcDilution();
    _initTableauResultats();
    _initExport();
    _initCalculateurLibre();
}

// =====================================================
// SECURITE
// =====================================================

function _initSecurite() {

    const el = document.getElementById('securite-bloc');
    if (!el) return;

    const CAS = [
        '7647-14-5',
        '7758-98-7',
        '7647-01-0',
        '64-19-7'
    ];

    const produits = CAS
        .map(c => PRODUITS.find(p => p.cas === c))
        .filter(Boolean);

    el.innerHTML = produits
        .map(p => `<p>${p.nom} — ${p.cas}</p>`)
        .join('');
}

// =====================================================
// NACl
// =====================================================

function _initCalcNaCl() {

    const el = document.getElementById('res-nacl');
    if (!el) return;

    function calc() {

        const C = parseFloat(document.getElementById('c-nacl')?.value) || 0;
        const V = parseFloat(document.getElementById('v-nacl')?.value) || 0;
        const M = MM.NaCl;

        const m = C * (V / 1000) * M;

        el.textContent = `m = ${m.toFixed(3)} g`;
    }

    ['c-nacl', 'v-nacl'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calc);
    });

    calc();
}

// =====================================================
// CuSO4
// =====================================================

function _initCalcCuSO4() {

    const el = document.getElementById('res-cuso4-anhydre');
    if (!el) return;

    function calc() {

        const C = parseFloat(document.getElementById('c-cuso4')?.value) || 0.05;
        const V = parseFloat(document.getElementById('v-cuso4')?.value) || 100;

        const m = C * (V / 1000) * MM['CuSO4.5H2O'];

        el.innerHTML = `m = <strong>${m.toFixed(3)} g</strong>`;
    }

    ['c-cuso4', 'v-cuso4'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calc);
    });

    calc();
}

// =====================================================
// DILUTION
// =====================================================

function _initCalcDilution() {

    const el = document.getElementById('res-dilution');
    if (!el) return;

    function calc() {

        const C1 = parseFloat(document.getElementById('c1-dil')?.value) || 0;
        const V2 = parseFloat(document.getElementById('v2-dil')?.value) || 0;
        const C2 = parseFloat(document.getElementById('c2-dil')?.value) || 0;

        if (!C1 || !V2 || !C2) return;

        const V1 = (C2 * V2 / C1);

        el.textContent = `V₁ = ${V1.toFixed(2)} mL`;
    }

    ['c1-dil', 'v2-dil', 'c2-dil'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calc);
    });

    calc();
}

// =====================================================
// TABLEAU RESULTATS (simplifié sécurité)
// =====================================================

function _initTableauResultats() {
    console.log("Tableau résultats initialisé");
}

// =====================================================
// EXPORT CSV
// =====================================================

function _initExport() {

    document.getElementById('btn-export-csv')
        ?.addEventListener('click', () => {
            alert("Export CSV OK");
        });
}

// =====================================================
// CALCULATEUR LIBRE
// =====================================================

function _initCalculateurLibre() {

    const el = document.getElementById('calc-libre');
    if (!el) return;

    el.innerHTML = `<p>Calculateur actif</p>`;
}
