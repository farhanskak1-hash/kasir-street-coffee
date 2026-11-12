/**
 * BLS Street Coffee - Cashier POS Application
 * Outlet Tepi Jalan • Booth POS Engine
 */

(function () {
  'use strict';

  // ==========================================
  // 1. STATE MANAGEMENT & LOCAL STORAGE
  // ==========================================
  const STORAGE_KEYS = {
    MENU: 'bls_menu_data_v1',
    TRANSACTIONS: 'bls_transactions_v1',
    ORDER_COUNTER: 'bls_order_counter_v1',
    SOUND: 'bls_sound_enabled_v1',
    ADMIN_PIN: 'bls_admin_pin_v1',
    STORE_PROFILE: 'bls_store_profile_v1',
    PAYMENT_SETTINGS: 'bls_payment_settings_v1',
    TOPPINGS: 'bls_toppings_v1'
  };

  // Preset Pilihan Gambar Menu untuk Pengguna Non-Teknis (No Coding!)
  const PRESET_IMAGES = [
    { name: 'Kopi Susu Aren', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=60' },
    { name: 'Kopi Susu Creamy', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=60' },
    { name: 'Iced Americano', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60' },
    { name: 'Kopi Tubruk / Latte', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop&q=60' },
    { name: 'Cokelat Signature', url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&auto=format&fit=crop&q=60' },
    { name: 'Matcha Latte', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=60' },
    { name: 'Es Teh Segar', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=60' },
    { name: 'Toast / Roti Bakar', url: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=400&auto=format&fit=crop&q=60' }
  ];

  // Default Profil Toko
  const DEFAULT_STORE_PROFILE = {
    name: 'BLS STREET COFFEE',
    sub: 'Outlet Kopi Tepi Jalan',
    address: 'Jln. Raya Utama No. 88 (Depan Halte)',
    wa: '081234567890',
    ig: '@bls.streetcoffee',
    footerMsg: 'Terima Kasih Sudah Ngopi di BLS!\nNikmati Kopi Jalanan Rasa Bintang Lima.'
  };

  let storeProfile = { ...DEFAULT_STORE_PROFILE };
  try {
    const savedProf = localStorage.getItem(STORAGE_KEYS.STORE_PROFILE);
    if (savedProf) storeProfile = JSON.parse(savedProf);
  } catch (e) {
    storeProfile = { ...DEFAULT_STORE_PROFILE };
  }

  // Default Pengaturan Pembayaran
  const DEFAULT_PAYMENT_SETTINGS = {
    bankName: 'BCA',
    bankNumber: '872-049-1122',
    bankOwner: 'BLS Street Coffee',
    walletNumber: '0812-3456-7890',
    qrisNmid: 'ID1029384756102 - BLS STREET COFFEE'
  };

  let paymentSettings = { ...DEFAULT_PAYMENT_SETTINGS };
  try {
    const savedPay = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
    if (savedPay) paymentSettings = JSON.parse(savedPay);
  } catch (e) {
    paymentSettings = { ...DEFAULT_PAYMENT_SETTINGS };
  }

  // PIN Admin (Default: 1234)
  let adminPin = '1234';
  try {
    const savedPin = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);
    if (savedPin) adminPin = savedPin;
  } catch (e) {
    adminPin = '1234';
  }

  // Extra Toppings State
  let extraToppings = [...EXTRA_TOPPINGS];
  try {
    const savedTops = localStorage.getItem(STORAGE_KEYS.TOPPINGS);
    if (savedTops) extraToppings = JSON.parse(savedTops);
  } catch (e) {
    extraToppings = [...EXTRA_TOPPINGS];
  }

  // Load Menu from Storage or Default
  let menuItems = [];
  try {
    const savedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
    menuItems = savedMenu ? JSON.parse(savedMenu) : [...INITIAL_MENU];
  } catch (e) {
    menuItems = [...INITIAL_MENU];
  }

  // Load Transactions History
  let transactions = [];
  try {
    const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    transactions = savedTx ? JSON.parse(savedTx) : [];
  } catch (e) {
    transactions = [];
  }

  // Order Counter (e.g., 1001)
  let orderCounter = 1001;
  try {
    const savedCounter = localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER);
    orderCounter = savedCounter ? parseInt(savedCounter, 10) : 1001;
  } catch (e) {
    orderCounter = 1001;
  }

  // Sound State
  let soundEnabled = true;
  try {
    const savedSound = localStorage.getItem(STORAGE_KEYS.SOUND);
    soundEnabled = savedSound !== null ? JSON.parse(savedSound) : true;
  } catch (e) {
    soundEnabled = true;
  }

  // Cart & Active Session State
  let cart = [];
  let activeCategory = 'all';
  let searchQuery = '';
  let orderType = 'takeaway'; // 'takeaway' | 'dinein'
  let discountPercent = 0; // 0, 5, 10, or manual
  let manualDiscountAmount = 0;
  let activePaymentMethod = 'cash'; // 'cash' | 'qris' | 'transfer'
  let configuringItem = null; // item being configured in modal
  let lastCompletedTransaction = null;

  // Temporary config options for Modal
  let currentConfig = {
    temp: 'Ice',
    sugar: 'Normal',
    toppings: [], // array of topping objects
    qty: 1
  };

  // ==========================================
  // 2. WEB AUDIO API SYNTHESIZER (POS BEEP)
  // ==========================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playBeep(type = 'add') {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'add') {
        // High crisp beep (780Hz -> 960Hz)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(780, now);
        osc.frequency.exponentialRampToValueAtTime(960, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'remove') {
        // Lower descending blip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        // Chime for successful payment
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.09); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // ==========================================
  // 3. CURRENCY & DATE FORMATTING HELPERS
  // ==========================================
  function formatIDR(amount) {
    const num = Math.round(Number(amount) || 0);
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function getOrderIdString(num) {
    return '#BLS-' + num;
  }

  function updateLiveClock() {
    const now = new Date();
    const clockEl = document.getElementById('liveClock');
    const dateEl = document.getElementById('liveDate');
    const shiftEl = document.getElementById('currentShift');

    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
    }

    if (dateEl) {
      const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
      dateEl.textContent = now.toLocaleDateString('id-ID', options);
    }

    if (shiftEl) {
      const hour = now.getHours();
      let shiftText = 'Shift 1 (Pagi - Sore)';
      if (hour >= 15 && hour < 22) {
        shiftText = 'Shift 2 (Sore - Malam)';
      } else if (hour >= 22 || hour < 6) {
        shiftText = 'Shift Malam';
      }
      shiftEl.textContent = shiftText + ' • Booth Aktif';
    }
  }

  // ==========================================
  // 4. RENDER CATEGORIES & PRODUCT MENU
  // ==========================================
  function renderCategories() {
    const container = document.getElementById('categoryTabsContainer');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => {
      const isActive = cat.id === activeCategory;
      return `
        <button type="button" class="tab-pill ${isActive ? 'active' : ''}" data-cat-id="${cat.id}">
          <span>${cat.name}</span>
        </button>
      `;
    }).join('');

    // Event listeners for Category Tabs
    container.querySelectorAll('.tab-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-cat-id');
        renderCategories();
        renderMenuGrid();
      });
    });
  }

  function renderMenuGrid() {
    const container = document.getElementById('menuGridContainer');
    const emptyState = document.getElementById('emptyMenuState');
    if (!container) return;

    // Filter by Category and Search Query
    const query = searchQuery.trim().toLowerCase();
    const filtered = menuItems.filter(item => {
      const matchesCategory = (activeCategory === 'all') || (item.category === activeCategory);
      const matchesQuery = query === '' || 
        item.name.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(item => {
      const isAvailable = item.isAvailable !== false;
      return `
        <div class="menu-card ${isAvailable ? '' : 'sold-out'}" data-item-id="${item.id}">
          <div class="card-image-wrap">
            <img class="card-img" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60'">
            ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
            ${!isAvailable ? `<div class="card-sold-out-overlay">STOK HABIS</div>` : ''}
          </div>
          <div class="card-content">
            <h3 class="card-name">${item.name}</h3>
            <p class="card-desc">${item.desc}</p>
            <div class="card-footer">
              <span class="card-price">${formatIDR(item.price)}</span>
              <button type="button" class="btn-card-add" title="${isAvailable ? 'Tambah ke pesanan' : 'Habis'}" ${!isAvailable ? 'disabled' : ''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card click event
    container.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', () => {
        const itemId = card.getAttribute('data-item-id');
        const item = menuItems.find(i => i.id === itemId);
        if (!item || item.isAvailable === false) return;
        openConfigModal(item);
      });
    });
  }

  // ==========================================
  // 5. ITEM CONFIGURATION MODAL (SUHU, GULA, TOPPING)
  // ==========================================
  function openConfigModal(item) {
    configuringItem = item;
    
    // Set default configuration
    const tempOpts = (item.options && item.options.temperature) || ['Ice', 'Hot'];
    const sugarOpts = (item.options && item.options.sugar) || ['Normal', 'Less Sugar', 'No Sugar'];

    currentConfig = {
      temp: tempOpts[0] || 'Ice',
      sugar: sugarOpts[0] || 'Normal',
      toppings: [],
      qty: 1
    };

    // Populate modal contents
    const modal = document.getElementById('modalConfigItem');
    document.getElementById('configItemName').textContent = item.name;
    document.getElementById('configItemDesc').textContent = item.desc;
    document.getElementById('configItemBadge').textContent = item.badge || 'Menu Pilihan';

    // 1. Suhu Options
    const tempContainer = document.getElementById('configOptionsTemp');
    tempContainer.innerHTML = tempOpts.map(t => `
      <div class="config-radio-btn ${t === currentConfig.temp ? 'selected' : ''}" data-val="${t}">
        ${t === 'Ice' ? '❄️ Dingin (Ice)' : t === 'Hot' ? '🔥 Hangat (Hot)' : t}
      </div>
    `).join('');

    tempContainer.querySelectorAll('.config-radio-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tempContainer.querySelectorAll('.config-radio-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        currentConfig.temp = btn.getAttribute('data-val');
        updateConfigSubtotal();
      });
    });

    // 2. Sugar Options
    const sugarGroup = document.getElementById('configGroupSugar');
    const sugarContainer = document.getElementById('configOptionsSugar');
    if (sugarOpts && sugarOpts.length > 1) {
      sugarGroup.style.display = 'flex';
      sugarContainer.innerHTML = sugarOpts.map(s => `
        <div class="config-radio-btn ${s === currentConfig.sugar ? 'selected' : ''}" data-val="${s}">
          ${s}
        </div>
      `).join('');

      sugarContainer.querySelectorAll('.config-radio-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sugarContainer.querySelectorAll('.config-radio-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          currentConfig.sugar = btn.getAttribute('data-val');
          updateConfigSubtotal();
        });
      });
    } else {
      sugarGroup.style.display = 'none';
      currentConfig.sugar = sugarOpts[0] || 'Standard';
    }

    // 3. Topping Options
    const toppingGroup = document.getElementById('configGroupTopping');
    const toppingContainer = document.getElementById('configOptionsTopping');
    if (item.category === 'cemilan') {
      toppingGroup.style.display = 'none';
    } else {
      toppingGroup.style.display = 'flex';
      toppingContainer.innerHTML = extraToppings.map(top => `
        <div class="topping-checkbox-card" data-topping-id="${top.id}">
          <div class="topping-left">
            <input type="checkbox" class="topping-checkbox" id="top_${top.id}">
            <label for="top_${top.id}" class="topping-name">${top.name}</label>
          </div>
          <span class="topping-price">+${formatIDR(top.price)}</span>
        </div>
      `).join('');

      toppingContainer.querySelectorAll('.topping-checkbox-card').forEach(card => {
        const chk = card.querySelector('.topping-checkbox');
        card.addEventListener('click', (e) => {
          if (e.target !== chk) {
            chk.checked = !chk.checked;
          }
          if (chk.checked) {
            card.classList.add('selected');
          } else {
            card.classList.remove('selected');
          }

          // Recalculate selected toppings
          const selectedTops = [];
          toppingContainer.querySelectorAll('.topping-checkbox-card').forEach(c => {
            const cb = c.querySelector('.topping-checkbox');
            if (cb.checked) {
              const tid = c.getAttribute('data-topping-id');
              const foundTop = extraToppings.find(t => t.id === tid);
              if (foundTop) selectedTops.push(foundTop);
            }
          });
          currentConfig.toppings = selectedTops;
          updateConfigSubtotal();
        });
      });
    }

    // Reset Stepper
    document.getElementById('configQtyDisplay').textContent = currentConfig.qty;
    updateConfigSubtotal();

    modal.style.display = 'flex';
  }

  function closeConfigModal() {
    const modal = document.getElementById('modalConfigItem');
    if (modal) modal.style.display = 'none';
    configuringItem = null;
  }

  function updateConfigSubtotal() {
    if (!configuringItem) return;
    const basePrice = configuringItem.price;
    const toppingsPrice = currentConfig.toppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice = basePrice + toppingsPrice;
    const total = unitPrice * currentConfig.qty;

    const displayEl = document.getElementById('configItemSubtotalDisplay');
    if (displayEl) {
      displayEl.textContent = formatIDR(total);
    }
  }

  function confirmAddToCart() {
    if (!configuringItem) return;

    const toppingsPrice = currentConfig.toppings.reduce((sum, t) => sum + t.price, 0);
    const unitPrice = configuringItem.price + toppingsPrice;

    // Unique signature key to merge identical items
    const toppingIds = currentConfig.toppings.map(t => t.id).sort().join(',');
    const itemKey = `${configuringItem.id}_${currentConfig.temp}_${currentConfig.sugar}_${toppingIds}`;

    const existingIndex = cart.findIndex(c => c.key === itemKey);
    if (existingIndex > -1) {
      cart[existingIndex].qty += currentConfig.qty;
      cart[existingIndex].lineTotal = cart[existingIndex].qty * cart[existingIndex].unitPrice;
    } else {
      cart.push({
        key: itemKey,
        id: configuringItem.id,
        name: configuringItem.name,
        category: configuringItem.category,
        basePrice: configuringItem.price,
        unitPrice: unitPrice,
        temp: currentConfig.temp,
        sugar: currentConfig.sugar,
        toppings: [...currentConfig.toppings],
        qty: currentConfig.qty,
        lineTotal: unitPrice * currentConfig.qty
      });
    }

    playBeep('add');
    closeConfigModal();
    renderCart();
  }

  // ==========================================
  // 6. RENDER CART & ORDER TERMINAL
  // ==========================================
  function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('cartEmptyState');
    const payBtn = document.getElementById('btnOpenPayment');
    const totalItemsEl = document.getElementById('cartTotalItems');
    const subtotalEl = document.getElementById('cartSubtotalText');
    const discountEl = document.getElementById('cartDiscountText');
    const grandTotalEl = document.getElementById('cartGrandTotalText');
    const payBadge = document.getElementById('btnPayAmountBadge');

    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = '';
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      if (payBtn) payBtn.disabled = true;

      if (totalItemsEl) totalItemsEl.textContent = '0';
      if (subtotalEl) subtotalEl.textContent = formatIDR(0);
      if (discountEl) discountEl.textContent = '- ' + formatIDR(0);
      if (grandTotalEl) grandTotalEl.textContent = formatIDR(0);
      if (payBadge) payBadge.textContent = formatIDR(0);
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    container.style.display = 'flex';
    if (payBtn) payBtn.disabled = false;

    // Render items list
    container.innerHTML = cart.map((item, idx) => {
      const toppingText = item.toppings.length > 0 
        ? `+ ${item.toppings.map(t => t.name).join(', ')}` 
        : '';
      const optionDetails = [
        item.temp ? (item.temp === 'Ice' ? 'Dingin (Ice)' : 'Hangat (Hot)') : null,
        item.sugar ? `Gula: ${item.sugar}` : null
      ].filter(Boolean).join(' • ');

      return `
        <div class="cart-item">
          <div class="cart-item-header">
            <span class="cart-item-title">${item.name}</span>
            <button type="button" class="btn-remove-item" data-idx="${idx}" title="Hapus Item">&times;</button>
          </div>
          <div class="cart-item-options">${optionDetails}</div>
          ${toppingText ? `<div class="cart-item-toppings">${toppingText}</div>` : ''}
          <div class="cart-item-footer">
            <div class="cart-item-stepper">
              <button type="button" class="step-btn-mini minus" data-idx="${idx}">-</button>
              <span class="cart-qty-val">${item.qty}</span>
              <button type="button" class="step-btn-mini plus" data-idx="${idx}">+</button>
            </div>
            <span class="cart-item-total">${formatIDR(item.lineTotal)}</span>
          </div>
        </div>
      `;
    }).join('');

    // Attach Stepper & Remove Events
    container.querySelectorAll('.btn-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        cart.splice(idx, 1);
        playBeep('remove');
        renderCart();
      });
    });

    container.querySelectorAll('.step-btn-mini.minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
          cart[idx].lineTotal = cart[idx].qty * cart[idx].unitPrice;
          playBeep('add');
        } else {
          cart.splice(idx, 1);
          playBeep('remove');
        }
        renderCart();
      });
    });

    container.querySelectorAll('.step-btn-mini.plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        cart[idx].qty++;
        cart[idx].lineTotal = cart[idx].qty * cart[idx].unitPrice;
        playBeep('add');
        renderCart();
      });
    });

    // Calculate Summary Values
    const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    let discountAmount = 0;
    if (discountPercent > 0) {
      discountAmount = Math.round(subtotal * (discountPercent / 100));
    } else if (manualDiscountAmount > 0) {
      discountAmount = Math.min(subtotal, manualDiscountAmount);
    }

    const grandTotal = Math.max(0, subtotal - discountAmount);

    if (totalItemsEl) totalItemsEl.textContent = totalQty;
    if (subtotalEl) subtotalEl.textContent = formatIDR(subtotal);
    if (discountEl) discountEl.textContent = '- ' + formatIDR(discountAmount);
    if (grandTotalEl) grandTotalEl.textContent = formatIDR(grandTotal);
    if (payBadge) payBadge.textContent = formatIDR(grandTotal);
  }

  function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Yakin ingin mereset keranjang pesanan ini?')) {
      cart = [];
      discountPercent = 0;
      manualDiscountAmount = 0;
      const notesInput = document.getElementById('orderNotesInput');
      if (notesInput) notesInput.value = '';
      
      // Reset discount pills
      document.querySelectorAll('.disc-pill').forEach(p => p.classList.remove('active'));
      const defPill = document.querySelector('.disc-pill[data-disc="0"]');
      if (defPill) defPill.classList.add('active');

      playBeep('remove');
      renderCart();
    }
  }

  // ==========================================
  // 7. PAYMENT MODAL LOGIC (CASH, QRIS, TRANSFER)
  // ==========================================
  function openPaymentModal() {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    let discountAmount = 0;
    if (discountPercent > 0) {
      discountAmount = Math.round(subtotal * (discountPercent / 100));
    } else if (manualDiscountAmount > 0) {
      discountAmount = manualDiscountAmount;
    }
    const grandTotal = Math.max(0, subtotal - discountAmount);

    document.getElementById('payModalOrderId').textContent = getOrderIdString(orderCounter);
    document.getElementById('payModalTotalAmount').textContent = formatIDR(grandTotal);
    document.getElementById('qrisDisplayAmount').textContent = formatIDR(grandTotal);

    // Default to Cash tab
    setPaymentTab('cash');

    // Reset Cash Input
    const cashInput = document.getElementById('cashReceivedInput');
    cashInput.value = '';
    updateCashChange();

    document.getElementById('modalPayment').style.display = 'flex';
    setTimeout(() => {
      cashInput.focus();
    }, 100);
  }

  function closePaymentModal() {
    document.getElementById('modalPayment').style.display = 'none';
  }

  function setPaymentTab(method) {
    activePaymentMethod = method;

    // Tabs UI
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.pay-tab[data-method="${method}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Views
    document.getElementById('viewPaymentCash').style.display = method === 'cash' ? 'block' : 'none';
    document.getElementById('viewPaymentQris').style.display = method === 'qris' ? 'block' : 'none';
    document.getElementById('viewPaymentTransfer').style.display = method === 'transfer' ? 'block' : 'none';

    // Auto calculate if cash
    if (method === 'cash') {
      updateCashChange();
    }
  }

  function updateCashChange() {
    const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    let discountAmount = (discountPercent > 0) 
      ? Math.round(subtotal * (discountPercent / 100)) 
      : manualDiscountAmount;
    const grandTotal = Math.max(0, subtotal - discountAmount);

    const cashInput = document.getElementById('cashReceivedInput');
    const receivedVal = parseFloat(cashInput.value) || 0;
    const change = receivedVal - grandTotal;

    const changeEl = document.getElementById('cashChangeAmount');
    const noticeEl = document.getElementById('changeNotice');
    const completeBtn = document.getElementById('btnCompletePayment');

    if (receivedVal === 0) {
      changeEl.textContent = formatIDR(0);
      changeEl.className = 'calc-amount';
      noticeEl.textContent = 'Masukkan nominal uang yang diberikan pelanggan.';
      noticeEl.style.color = 'var(--text-dim)';
    } else if (change < 0) {
      changeEl.textContent = formatIDR(change);
      changeEl.className = 'calc-amount insufficient';
      noticeEl.textContent = `Uang masih kurang ${formatIDR(Math.abs(change))}`;
      noticeEl.style.color = 'var(--status-danger)';
    } else if (change === 0) {
      changeEl.textContent = 'Rp 0 (UANG PAS)';
      changeEl.className = 'calc-amount';
      noticeEl.textContent = 'Pembayaran pas, tidak ada kembalian.';
      noticeEl.style.color = 'var(--status-success)';
    } else {
      changeEl.textContent = formatIDR(change);
      changeEl.className = 'calc-amount';
      noticeEl.textContent = `Kembalikan ${formatIDR(change)} ke pelanggan.`;
      noticeEl.style.color = 'var(--status-success)';
    }
  }

  function completeTransaction() {
    const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    let discountAmount = (discountPercent > 0) 
      ? Math.round(subtotal * (discountPercent / 100)) 
      : manualDiscountAmount;
    const grandTotal = Math.max(0, subtotal - discountAmount);

    let cashGiven = grandTotal;
    let changeAmount = 0;

    if (activePaymentMethod === 'cash') {
      const cashInput = document.getElementById('cashReceivedInput');
      const val = parseFloat(cashInput.value);
      if (isNaN(val) || val < grandTotal) {
        alert('Nominal uang tunai yang dimasukkan masih kurang dari total tagihan!');
        cashInput.focus();
        return;
      }
      cashGiven = val;
      changeAmount = val - grandTotal;
    }

    const orderId = getOrderIdString(orderCounter);
    const orderNotes = document.getElementById('orderNotesInput') 
      ? document.getElementById('orderNotesInput').value.trim() 
      : '';

    const newTransaction = {
      orderId: orderId,
      timestamp: new Date().toISOString(),
      orderType: orderType, // 'takeaway' | 'dinein'
      items: JSON.parse(JSON.stringify(cart)),
      totalQty: totalQty,
      subtotal: subtotal,
      discountAmount: discountAmount,
      grandTotal: grandTotal,
      method: activePaymentMethod, // 'cash' | 'qris' | 'transfer'
      cashGiven: cashGiven,
      cashChange: changeAmount,
      notes: orderNotes
    };

    // Save to State & LocalStorage
    transactions.unshift(newTransaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

    // Increment Order Counter
    orderCounter++;
    localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, orderCounter.toString());
    document.getElementById('currentOrderId').textContent = getOrderIdString(orderCounter);

    // Save Reference to last transaction
    lastCompletedTransaction = newTransaction;

    // Beep sound effect
    playBeep('success');

    // Close Payment Modal & Open Receipt Modal
    closePaymentModal();
    openReceiptModal(newTransaction);

    // Clear cart
    cart = [];
    discountPercent = 0;
    manualDiscountAmount = 0;
    if (document.getElementById('orderNotesInput')) {
      document.getElementById('orderNotesInput').value = '';
    }
    renderCart();
    updateHeaderOmzet();
  }

  // ==========================================
  // 8. THERMAL RECEIPT MODAL & PRINTING
  // ==========================================
  function openReceiptModal(tx) {
    if (!tx) return;

    // Apply store profile to receipt header
    const recTitle = document.querySelector('.receipt-title');
    if (recTitle) recTitle.textContent = storeProfile.name;
    const recSub = document.querySelector('.receipt-sub');
    if (recSub) recSub.textContent = storeProfile.sub;
    const recAddr = document.querySelector('.receipt-address');
    if (recAddr) recAddr.textContent = storeProfile.address;
    const recContact = document.querySelector('.receipt-contact');
    if (recContact) recContact.textContent = `WA: ${storeProfile.wa} • IG: ${storeProfile.ig}`;
    const recFooter = document.querySelector('.footer-msg');
    if (recFooter) recFooter.textContent = storeProfile.footerMsg;

    document.getElementById('recOrderId').textContent = tx.orderId;
    const dt = new Date(tx.timestamp);
    document.getElementById('recTimestamp').textContent = dt.toLocaleString('id-ID', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('recOrderType').textContent = tx.orderType === 'takeaway' 
      ? 'Bungkus (Takeaway)' 
      : 'Minum Sini (Dine-in)';

    const notesWrap = document.getElementById('recNotesWrap');
    if (tx.notes) {
      notesWrap.style.display = 'flex';
      document.getElementById('recNotes').textContent = tx.notes;
    } else {
      notesWrap.style.display = 'none';
    }

    // Items table in receipt
    const itemsTable = document.getElementById('recItemsTable');
    itemsTable.innerHTML = tx.items.map(it => {
      const topStr = it.toppings && it.toppings.length > 0 
        ? ` (+${it.toppings.map(t => t.name).join(', ')})` 
        : '';
      const optStr = `${it.temp || 'Ice'}${it.sugar ? ', Gula ' + it.sugar : ''}${topStr}`;

      return `
        <div class="rec-item-row">
          <div class="rec-item-main">
            <span>${it.qty}x ${it.name}</span>
            <span>${formatIDR(it.lineTotal)}</span>
          </div>
          <div class="rec-item-sub">${optStr}</div>
        </div>
      `;
    }).join('');

    // Totals
    document.getElementById('recSubtotal').textContent = formatIDR(tx.subtotal);
    const discLine = document.getElementById('recDiscountLine');
    if (tx.discountAmount > 0) {
      discLine.style.display = 'flex';
      document.getElementById('recDiscount').textContent = '- ' + formatIDR(tx.discountAmount);
    } else {
      discLine.style.display = 'none';
    }

    document.getElementById('recGrandTotal').textContent = formatIDR(tx.grandTotal);

    let methodLabel = 'Tunai (Cash)';
    if (tx.method === 'qris') methodLabel = 'QRIS Digital';
    if (tx.method === 'transfer') methodLabel = 'Transfer / E-Wallet';
    document.getElementById('recMethod').textContent = methodLabel;

    const payCashLine = document.getElementById('recPayCashLine');
    const changeLine = document.getElementById('recChangeLine');
    if (tx.method === 'cash') {
      payCashLine.style.display = 'flex';
      changeLine.style.display = 'flex';
      document.getElementById('recCashGiven').textContent = formatIDR(tx.cashGiven);
      document.getElementById('recCashChange').textContent = formatIDR(tx.cashChange);
    } else {
      payCashLine.style.display = 'none';
      changeLine.style.display = 'none';
    }

    document.getElementById('modalReceipt').style.display = 'flex';
  }

  function closeReceiptModal() {
    document.getElementById('modalReceipt').style.display = 'none';
  }

  function shareReceiptToWhatsApp() {
    if (!lastCompletedTransaction) return;
    const tx = lastCompletedTransaction;
    const dt = new Date(tx.timestamp).toLocaleString('id-ID');

    let text = `*${storeProfile.name} - STRUK RESMI*\n`;
    text += `${storeProfile.sub}\n`;
    text += `${storeProfile.address}\n`;
    text += `--------------------------------\n`;
    text += `No. Nota : ${tx.orderId}\n`;
    text += `Waktu    : ${dt}\n`;
    text += `Tipe     : ${tx.orderType === 'takeaway' ? 'Bungkus' : 'Minum Sini'}\n`;
    text += `--------------------------------\n`;
    tx.items.forEach(i => {
      text += `${i.qty}x ${i.name} = ${formatIDR(i.lineTotal)}\n`;
    });
    text += `--------------------------------\n`;
    text += `Subtotal : ${formatIDR(tx.subtotal)}\n`;
    if (tx.discountAmount > 0) {
      text += `Diskon   : -${formatIDR(tx.discountAmount)}\n`;
    }
    text += `*TOTAL    : ${formatIDR(tx.grandTotal)}*\n`;
    text += `Metode   : ${tx.method.toUpperCase()}\n`;
    text += `--------------------------------\n`;
    text += `${storeProfile.footerMsg.split('\n')[0]}\n`;
    text += `WA Booth : ${storeProfile.wa}\n`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  // ==========================================
  // 9. REPORT MODAL & SHIFT SUMMARY
  // ==========================================
  function updateHeaderOmzet() {
    const today = new Date().toDateString();
    const todayTx = transactions.filter(t => new Date(t.timestamp).toDateString() === today);
    const totalOmzet = todayTx.reduce((sum, t) => sum + t.grandTotal, 0);

    const badge = document.getElementById('headerOmzetBadge');
    if (badge) {
      badge.textContent = formatIDR(totalOmzet);
    }
  }

  function openReportModal() {
    const today = new Date().toDateString();
    const todayTx = transactions.filter(t => new Date(t.timestamp).toDateString() === today);

    const totalOmzet = todayTx.reduce((sum, t) => sum + t.grandTotal, 0);
    const totalCups = todayTx.reduce((sum, t) => sum + (t.totalQty || 0), 0);
    const cashTotal = todayTx
      .filter(t => t.method === 'cash')
      .reduce((sum, t) => sum + t.grandTotal, 0);
    const nonCashTotal = todayTx
      .filter(t => t.method !== 'cash')
      .reduce((sum, t) => sum + t.grandTotal, 0);

    // Populate Metrics
    document.getElementById('reportOmzetTotal').textContent = formatIDR(totalOmzet);
    document.getElementById('reportTransactionCount').textContent = `${todayTx.length} Transaksi Sukses`;
    document.getElementById('reportCupsSold').textContent = `${totalCups} Cup/Item`;
    document.getElementById('reportCashTotal').textContent = formatIDR(cashTotal);
    document.getElementById('reportNonCashTotal').textContent = formatIDR(nonCashTotal);

    // Populate Table
    const tbody = document.getElementById('reportTableBody');
    if (transactions.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">
            Belum ada transaksi terekam di shift ini.
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = transactions.map((t, index) => {
        const timeStr = new Date(t.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const itemsSummary = t.items.map(it => `${it.qty}x ${it.name}`).join(', ');

        return `
          <tr>
            <td><strong>${t.orderId}</strong></td>
            <td>${timeStr}</td>
            <td><span class="type-pill">${t.orderType === 'takeaway' ? 'Bungkus' : 'Dine In'}</span></td>
            <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemsSummary}">${itemsSummary}</td>
            <td><span class="method-tag">${t.method.toUpperCase()}</span></td>
            <td><strong>${formatIDR(t.grandTotal)}</strong></td>
            <td>
              <button type="button" class="btn-table-action" data-idx="${index}">Lihat Struk</button>
            </td>
          </tr>
        `;
      }).join('');

      tbody.querySelectorAll('.btn-table-action').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          const tx = transactions[idx];
          if (tx) {
            closeReportModal();
            openReceiptModal(tx);
          }
        });
      });
    }

    document.getElementById('modalReport').style.display = 'flex';
  }

  function closeReportModal() {
    document.getElementById('modalReport').style.display = 'none';
  }

  function exportReportToCSV() {
    if (transactions.length === 0) {
      alert('Belum ada data transaksi untuk diexport!');
      return;
    }

    let csv = 'No. Nota,Waktu,Tipe,Metode,Subtotal,Diskon,Total,Catatan,Detail Item\n';
    transactions.forEach(t => {
      const dt = new Date(t.timestamp).toLocaleString('id-ID').replace(/,/g, '');
      const itemsList = t.items.map(i => `${i.qty}x ${i.name}`).join('; ');
      csv += `"${t.orderId}","${dt}","${t.orderType}","${t.method}",${t.subtotal},${t.discountAmount},${t.grandTotal},"${t.notes || ''}","${itemsList}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_BLS_Coffee_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function resetShift() {
    if (confirm('PERINGATAN: Apakah Anda yakin ingin menutup dan mereset shift kasir? Semua riwayat transaksi saat ini akan diarsipkan/dibersihkan.')) {
      transactions = [];
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      updateHeaderOmzet();
      openReportModal();
      alert('Shift baru telah dimulai! Data transaksi telah direset.');
    }
  }

  // ==========================================
  // 10. MENU MANAGEMENT MODAL (SOLD OUT TOGGLE)
  // ==========================================
  function openMenuManageModal() {
    const container = document.getElementById('manageMenuListContainer');
    if (!container) return;

    container.innerHTML = menuItems.map(item => {
      const isAvailable = item.isAvailable !== false;
      return `
        <div class="manage-item-card" data-id="${item.id}">
          <div class="manage-item-info">
            <img class="manage-item-thumb" src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60'">
            <div>
              <div class="manage-item-name">${item.name}</div>
              <div class="manage-item-price">${formatIDR(item.price)} • ${item.category}</div>
            </div>
          </div>
          <div class="switch-wrap">
            <span class="switch-label">${isAvailable ? 'Tersedia' : 'HABIS'}</span>
            <label class="switch">
              <input type="checkbox" class="chk-avail" ${isAvailable ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </div>
      `;
    }).join('');

    // Toggle switch live label
    container.querySelectorAll('.manage-item-card').forEach(card => {
      const chk = card.querySelector('.chk-avail');
      const label = card.querySelector('.switch-label');
      chk.addEventListener('change', () => {
        label.textContent = chk.checked ? 'Tersedia' : 'HABIS';
        label.style.color = chk.checked ? 'var(--status-success)' : 'var(--status-danger)';
      });
    });

    document.getElementById('modalMenuManage').style.display = 'flex';
  }

  function closeMenuManageModal() {
    document.getElementById('modalMenuManage').style.display = 'none';
  }

  function saveMenuManagement() {
    const container = document.getElementById('manageMenuListContainer');
    container.querySelectorAll('.manage-item-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const isChecked = card.querySelector('.chk-avail').checked;
      const item = menuItems.find(m => m.id === id);
      if (item) {
        item.isAvailable = isChecked;
      }
    });

    // Save to storage
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    renderMenuGrid();
    closeMenuManageModal();
    playBeep('add');
  }

  function resetMenuToDefault() {
    if (confirm('Kembalikan seluruh stok menu ke kondisi awal bawaan?')) {
      menuItems = JSON.parse(JSON.stringify(INITIAL_MENU));
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
      openMenuManageModal();
      renderMenuGrid();
    }
  }

  // ==========================================
  // 11. ADMIN PANEL MANAGEMENT (NO-CODE FOR STORE OWNER)
  // ==========================================
  function showToast(msg) {
    const toast = document.getElementById('posToast');
    const msgEl = document.getElementById('toastMessage');
    if (toast && msgEl) {
      msgEl.textContent = msg;
      toast.style.display = 'flex';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 2500);
    }
  }

  function updateStoreProfileUI() {
    // Header brand
    const brandNameEl = document.querySelector('.brand-name');
    if (brandNameEl) brandNameEl.textContent = storeProfile.name;
    const brandTaglineEl = document.querySelector('.brand-tagline');
    if (brandTaglineEl) brandTaglineEl.textContent = storeProfile.sub;

    // Receipt header
    const recTitle = document.querySelector('.receipt-title');
    if (recTitle) recTitle.textContent = storeProfile.name;
    const recSub = document.querySelector('.receipt-sub');
    if (recSub) recSub.textContent = storeProfile.sub;
    const recAddr = document.querySelector('.receipt-address');
    if (recAddr) recAddr.textContent = storeProfile.address;
    const recContact = document.querySelector('.receipt-contact');
    if (recContact) recContact.textContent = `WA: ${storeProfile.wa} • IG: ${storeProfile.ig}`;
    const recFooter = document.querySelector('.footer-msg');
    if (recFooter) recFooter.textContent = storeProfile.footerMsg;

    // Payment view
    const bankBadge = document.querySelector('.bank-badge');
    if (bankBadge) bankBadge.textContent = paymentSettings.bankName;
    const bankDetailsStrong = document.querySelector('.bank-details strong');
    if (bankDetailsStrong) bankDetailsStrong.textContent = paymentSettings.bankNumber;
    const bankDetailsSmall = document.querySelector('.bank-details small');
    if (bankDetailsSmall) bankDetailsSmall.textContent = `a.n ${paymentSettings.bankOwner}`;

    const walletStrong = document.querySelectorAll('.bank-details strong')[1];
    if (walletStrong) walletStrong.textContent = paymentSettings.walletNumber;

    const qrisNmidEl = document.querySelector('.qris-info h4');
    if (qrisNmidEl) qrisNmidEl.textContent = `NMID: ${paymentSettings.qrisNmid}`;
  }

  // --- PIN VERIFICATION ---
  let enteredPin = '';
  function openPinModal() {
    enteredPin = '';
    const pinInput = document.getElementById('adminPinInput');
    if (pinInput) pinInput.value = '';
    document.getElementById('modalAdminPin').style.display = 'flex';
  }

  function closePinModal() {
    document.getElementById('modalAdminPin').style.display = 'none';
    enteredPin = '';
  }

  function handlePinKey(digit) {
    if (enteredPin.length < 6) {
      enteredPin += digit;
      const pinInput = document.getElementById('adminPinInput');
      if (pinInput) pinInput.value = enteredPin;
      playBeep('add');
    }
  }

  function handlePinClear() {
    enteredPin = '';
    const pinInput = document.getElementById('adminPinInput');
    if (pinInput) pinInput.value = '';
    playBeep('remove');
  }

  function verifyAdminPin() {
    if (enteredPin === adminPin) {
      closePinModal();
      openAdminModal();
      playBeep('success');
      showToast('Selamat datang di Panel Manajemen BLS!');
    } else {
      playBeep('remove');
      alert(`PIN Admin salah! (Gunakan PIN default: ${adminPin})`);
      handlePinClear();
    }
  }

  // --- ADMIN MODAL & TABS ---
  let activeAdminTab = 'menu';
  function openAdminModal() {
    updateStoreProfileUI();
    switchAdminTab('menu');
    document.getElementById('modalAdmin').style.display = 'flex';
  }

  function closeAdminModal() {
    document.getElementById('modalAdmin').style.display = 'none';
  }

  function switchAdminTab(tabName) {
    activeAdminTab = tabName;
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });

    const panes = {
      menu: 'tabPaneMenu',
      toppings: 'tabPaneToppings',
      profile: 'tabPaneProfile',
      payments: 'tabPanePayments',
      analytics: 'tabPaneAnalytics',
      security: 'tabPaneSecurity'
    };

    Object.keys(panes).forEach(k => {
      const el = document.getElementById(panes[k]);
      if (el) el.style.display = (k === tabName) ? 'flex' : 'none';
    });

    if (tabName === 'menu') renderAdminMenuTable();
    if (tabName === 'toppings') renderAdminToppingsTable();
    if (tabName === 'profile') loadStoreProfileForm();
    if (tabName === 'payments') loadPaymentSettingsForm();
    if (tabName === 'analytics') loadAdminAnalytics();
  }

  // --- TAB 1: MENU CRUD ---
  function renderAdminMenuTable() {
    const tbody = document.getElementById('adminMenuTableBody');
    if (!tbody) return;

    tbody.innerHTML = menuItems.map(item => {
      const isAvail = item.isAvailable !== false;
      return `
        <tr>
          <td><img src="${item.image}" class="admin-table-thumb" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60'"></td>
          <td>
            <strong>${item.name}</strong><br>
            <small style="color:var(--text-dim)">${item.desc || '-'}</small>
          </td>
          <td><span class="tab-pill" style="padding:2px 8px; font-size:11px">${item.category}</span></td>
          <td><strong style="color:var(--brand-accent)">${formatIDR(item.price)}</strong></td>
          <td>${item.badge ? `<span class="card-badge" style="position:static; display:inline-block">${item.badge}</span>` : '-'}</td>
          <td>
            <span class="admin-status-badge ${isAvail ? 'available' : 'soldout'}">
              ${isAvail ? 'Tersedia' : 'HABIS'}
            </span>
          </td>
          <td>
            <div class="admin-table-actions">
              <button type="button" class="btn-action-small" onclick="window.toggleMenuStatusAdmin('${item.id}')">
                ${isAvail ? 'Tandai Habis' : 'Tandai Ada'}
              </button>
              <button type="button" class="btn-action-small edit" onclick="window.editMenuAdmin('${item.id}')">
                Edit
              </button>
              <button type="button" class="btn-action-small danger" onclick="window.deleteMenuAdmin('${item.id}')">
                Hapus
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Global window functions for table action buttons
  window.toggleMenuStatusAdmin = function(id) {
    const item = menuItems.find(m => m.id === id);
    if (item) {
      item.isAvailable = (item.isAvailable === false);
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
      renderAdminMenuTable();
      renderMenuGrid();
      playBeep('add');
      showToast(`Status "${item.name}" diubah jadi ${item.isAvailable ? 'Tersedia' : 'Habis'}.`);
    }
  };

  window.editMenuAdmin = function(id) {
    openEditMenuForm(id);
  };

  window.deleteMenuAdmin = function(id) {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;
    if (confirm(`Yakin ingin menghapus menu "${item.name}" dari sistem?`)) {
      menuItems = menuItems.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
      renderAdminMenuTable();
      renderMenuGrid();
      playBeep('remove');
      showToast(`Menu "${item.name}" berhasil dihapus.`);
    }
  };

  // Preset Images selector
  function renderPresetImages(selectedUrl) {
    const container = document.getElementById('presetImagesContainer');
    if (!container) return;

    container.innerHTML = PRESET_IMAGES.map(p => {
      const isSel = p.url === selectedUrl;
      return `
        <div class="preset-img-card ${isSel ? 'selected' : ''}" data-url="${p.url}" title="${p.name}">
          <img src="${p.url}" alt="${p.name}">
        </div>
      `;
    }).join('');

    container.querySelectorAll('.preset-img-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.preset-img-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const url = card.getAttribute('data-url');
        document.getElementById('menuFormImage').value = url;
        playBeep('add');
      });
    });
  }

  function openAddMenuForm() {
    document.getElementById('formMenuModalTitle').textContent = 'Tambah Menu Baru';
    document.getElementById('menuFormId').value = '';
    document.getElementById('menuFormName').value = '';
    document.getElementById('menuFormCategory').value = 'kopi-susu';
    document.getElementById('menuFormPrice').value = '10000';
    document.getElementById('menuFormBadge').value = '';
    document.getElementById('menuFormAvailable').value = 'true';
    document.getElementById('menuFormDesc').value = '';
    document.getElementById('menuFormImage').value = PRESET_IMAGES[0].url;

    renderPresetImages(PRESET_IMAGES[0].url);
    document.getElementById('modalFormMenu').style.display = 'flex';
  }

  function openEditMenuForm(id) {
    const item = menuItems.find(m => m.id === id);
    if (!item) return;

    document.getElementById('formMenuModalTitle').textContent = `Edit Menu: ${item.name}`;
    document.getElementById('menuFormId').value = item.id;
    document.getElementById('menuFormName').value = item.name;
    document.getElementById('menuFormCategory').value = item.category;
    document.getElementById('menuFormPrice').value = item.price;
    document.getElementById('menuFormBadge').value = item.badge || '';
    document.getElementById('menuFormAvailable').value = item.isAvailable !== false ? 'true' : 'false';
    document.getElementById('menuFormDesc').value = item.desc || '';
    document.getElementById('menuFormImage').value = item.image;

    renderPresetImages(item.image);
    document.getElementById('modalFormMenu').style.display = 'flex';
  }

  function closeMenuForm() {
    document.getElementById('modalFormMenu').style.display = 'none';
  }

  function saveMenuForm() {
    const id = document.getElementById('menuFormId').value.trim();
    const name = document.getElementById('menuFormName').value.trim();
    const category = document.getElementById('menuFormCategory').value;
    const price = parseFloat(document.getElementById('menuFormPrice').value);
    const badge = document.getElementById('menuFormBadge').value.trim();
    const isAvailable = document.getElementById('menuFormAvailable').value === 'true';
    const desc = document.getElementById('menuFormDesc').value.trim();
    let image = document.getElementById('menuFormImage').value.trim();

    if (!name) {
      alert('Nama menu minuman/makanan wajib diisi!');
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert('Harga harus berupa angka yang valid!');
      return;
    }
    if (!image) {
      image = PRESET_IMAGES[0].url;
    }

    if (id) {
      // Edit
      const idx = menuItems.findIndex(m => m.id === id);
      if (idx > -1) {
        menuItems[idx] = {
          ...menuItems[idx],
          name, category, price, badge, isAvailable, desc, image
        };
      }
    } else {
      // Add
      const newId = 'bls_' + Date.now();
      menuItems.unshift({
        id: newId,
        name,
        category,
        price,
        badge,
        desc,
        image,
        isAvailable,
        options: {
          temperature: ['Ice', 'Hot'],
          sugar: ['Normal', 'Less Sugar', 'No Sugar']
        }
      });
    }

    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
    renderMenuGrid();
    renderAdminMenuTable();
    closeMenuForm();
    playBeep('success');
    showToast(`Menu "${name}" berhasil disimpan!`);
  }

  // --- TAB 2: TOPPINGS CRUD ---
  function renderAdminToppingsTable() {
    const tbody = document.getElementById('adminToppingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = extraToppings.map(top => `
      <tr>
        <td><code>${top.id}</code></td>
        <td><strong>${top.name}</strong></td>
        <td><strong style="color:var(--brand-accent)">+${formatIDR(top.price)}</strong></td>
        <td>
          <button type="button" class="btn-action-small danger" onclick="window.deleteToppingAdmin('${top.id}')">
            Hapus
          </button>
        </td>
      </tr>
    `).join('');
  }

  window.deleteToppingAdmin = function(id) {
    const top = extraToppings.find(t => t.id === id);
    if (!top) return;
    if (confirm(`Hapus topping "${top.name}"?`)) {
      extraToppings = extraToppings.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TOPPINGS, JSON.stringify(extraToppings));
      renderAdminToppingsTable();
      playBeep('remove');
      showToast(`Topping "${top.name}" berhasil dihapus.`);
    }
  };

  function openAddToppingPrompt() {
    const name = prompt('Masukkan nama topping baru (contoh: Extra Espresso Shot / Jelly Kelapa):');
    if (!name || !name.trim()) return;

    const priceStr = prompt('Masukkan harga tambahan topping (contoh: 3000):', '3000');
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      alert('Harga topping tidak valid!');
      return;
    }

    const id = 'top_' + Date.now();
    extraToppings.push({ id, name: name.trim(), price });
    localStorage.setItem(STORAGE_KEYS.TOPPINGS, JSON.stringify(extraToppings));
    renderAdminToppingsTable();
    playBeep('add');
    showToast(`Topping "${name}" berhasil ditambahkan!`);
  }

  // --- TAB 3: PROFIL TOKO ---
  function loadStoreProfileForm() {
    document.getElementById('profStoreName').value = storeProfile.name;
    document.getElementById('profStoreSub').value = storeProfile.sub;
    document.getElementById('profStoreAddress').value = storeProfile.address;
    document.getElementById('profStoreWa').value = storeProfile.wa;
    document.getElementById('profStoreIg').value = storeProfile.ig;
    document.getElementById('profStoreFooterMsg').value = storeProfile.footerMsg;
  }

  function saveStoreProfileForm() {
    storeProfile.name = document.getElementById('profStoreName').value.trim() || DEFAULT_STORE_PROFILE.name;
    storeProfile.sub = document.getElementById('profStoreSub').value.trim() || DEFAULT_STORE_PROFILE.sub;
    storeProfile.address = document.getElementById('profStoreAddress').value.trim() || DEFAULT_STORE_PROFILE.address;
    storeProfile.wa = document.getElementById('profStoreWa').value.trim() || DEFAULT_STORE_PROFILE.wa;
    storeProfile.ig = document.getElementById('profStoreIg').value.trim() || DEFAULT_STORE_PROFILE.ig;
    storeProfile.footerMsg = document.getElementById('profStoreFooterMsg').value.trim() || DEFAULT_STORE_PROFILE.footerMsg;

    localStorage.setItem(STORAGE_KEYS.STORE_PROFILE, JSON.stringify(storeProfile));
    updateStoreProfileUI();
    playBeep('success');
    showToast('Profil outlet & struk berhasil diperbarui!');
  }

  // --- TAB 4: METODE BAYAR & REKENING ---
  function loadPaymentSettingsForm() {
    document.getElementById('payBankName').value = paymentSettings.bankName;
    document.getElementById('payBankNumber').value = paymentSettings.bankNumber;
    document.getElementById('payBankOwner').value = paymentSettings.bankOwner;
    document.getElementById('payWalletNumber').value = paymentSettings.walletNumber;
    document.getElementById('payQrisNmid').value = paymentSettings.qrisNmid;
  }

  function savePaymentSettingsForm() {
    paymentSettings.bankName = document.getElementById('payBankName').value.trim() || DEFAULT_PAYMENT_SETTINGS.bankName;
    paymentSettings.bankNumber = document.getElementById('payBankNumber').value.trim() || DEFAULT_PAYMENT_SETTINGS.bankNumber;
    paymentSettings.bankOwner = document.getElementById('payBankOwner').value.trim() || DEFAULT_PAYMENT_SETTINGS.bankOwner;
    paymentSettings.walletNumber = document.getElementById('payWalletNumber').value.trim() || DEFAULT_PAYMENT_SETTINGS.walletNumber;
    paymentSettings.qrisNmid = document.getElementById('payQrisNmid').value.trim() || DEFAULT_PAYMENT_SETTINGS.qrisNmid;

    localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(paymentSettings));
    updateStoreProfileUI();
    playBeep('success');
    showToast('Rekening & QRIS kasir berhasil diperbarui!');
  }

  // --- TAB 5: ANALISIS & STATISTIK ---
  function loadAdminAnalytics() {
    const totalOmzet = transactions.reduce((sum, t) => sum + t.grandTotal, 0);
    const totalCups = transactions.reduce((sum, t) => sum + (t.totalQty || 0), 0);

    document.getElementById('anaTotalOmzet').textContent = formatIDR(totalOmzet);
    document.getElementById('anaTotalCups').textContent = `${totalCups} Cup/Item`;
    document.getElementById('anaTotalTx').textContent = `${transactions.length} Nota`;

    // Calculate Best Sellers
    const itemCountMap = {};
    transactions.forEach(tx => {
      tx.items.forEach(it => {
        itemCountMap[it.name] = (itemCountMap[it.name] || 0) + it.qty;
      });
    });

    const sortedItems = Object.keys(itemCountMap)
      .map(name => ({ name, count: itemCountMap[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const listContainer = document.getElementById('anaBestSellersList');
    if (!listContainer) return;

    if (sortedItems.length === 0) {
      listContainer.innerHTML = '<p style="color:var(--text-dim); font-size:12px">Belum ada transaksi terekam untuk analisis.</p>';
    } else {
      listContainer.innerHTML = sortedItems.map((it, idx) => `
        <div class="best-seller-row">
          <div class="bs-info">
            <span class="bs-rank">#${idx + 1}</span>
            <span class="bs-name">${it.name}</span>
          </div>
          <span class="bs-count">${it.count} Terjual</span>
        </div>
      `).join('');
    }
  }

  // --- TAB 6: KEAMANAN & BACKUP ---
  function saveNewPin() {
    const newPin = document.getElementById('inputNewPin').value.trim();
    const confPin = document.getElementById('inputConfirmPin').value.trim();

    if (!newPin || newPin.length < 4) {
      alert('PIN baru harus minimal 4 angka!');
      return;
    }
    if (newPin !== confPin) {
      alert('Konfirmasi PIN baru tidak cocok!');
      return;
    }

    adminPin = newPin;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, adminPin);
    document.getElementById('inputNewPin').value = '';
    document.getElementById('inputConfirmPin').value = '';
    playBeep('success');
    showToast('PIN Admin berhasil diubah!');
  }

  function downloadBackupFile() {
    const backupData = {
      appName: 'BLS Street Coffee POS',
      exportDate: new Date().toISOString(),
      storeProfile: storeProfile,
      paymentSettings: paymentSettings,
      menuItems: menuItems,
      extraToppings: extraToppings,
      orderCounter: orderCounter,
      transactions: transactions
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BLS_Coffee_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('File cadangan data berhasil diunduh!');
  }

  function restoreBackupFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data = JSON.parse(evt.target.result);
        if (!data.menuItems || !Array.isArray(data.menuItems)) {
          alert('Format berkas cadangan tidak valid!');
          return;
        }

        if (confirm('Pulihkan data dari berkas cadangan ini? Data saat ini akan digantikan.')) {
          if (data.storeProfile) {
            storeProfile = data.storeProfile;
            localStorage.setItem(STORAGE_KEYS.STORE_PROFILE, JSON.stringify(storeProfile));
          }
          if (data.paymentSettings) {
            paymentSettings = data.paymentSettings;
            localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(paymentSettings));
          }
          if (data.menuItems) {
            menuItems = data.menuItems;
            localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
          }
          if (data.extraToppings) {
            extraToppings = data.extraToppings;
            localStorage.setItem(STORAGE_KEYS.TOPPINGS, JSON.stringify(extraToppings));
          }
          if (data.transactions) {
            transactions = data.transactions;
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
          }
          if (data.orderCounter) {
            orderCounter = data.orderCounter;
            localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, orderCounter.toString());
          }

          updateStoreProfileUI();
          renderMenuGrid();
          renderCart();
          updateHeaderOmzet();
          switchAdminTab('menu');
          playBeep('success');
          alert('Data berhasil dipulihkan!');
        }
      } catch (err) {
        alert('Gagal membaca berkas cadangan: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // ==========================================
  // 12. EVENT LISTENERS & INITIALIZATION
  // ==========================================
  function initEvents() {
    // 1. Search Bar Input
    const searchInput = document.getElementById('menuSearchInput');
    const clearSearchBtn = document.getElementById('btnClearSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearSearchBtn) {
          clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
        }
        renderMenuGrid();
      });

      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          clearSearchBtn.style.display = 'none';
          searchInput.focus();
          renderMenuGrid();
        });
      }
    }

    // 2. Order Type Toggle (Bungkus / Minum Sini)
    const btnTakeaway = document.getElementById('typeTakeaway');
    const btnDinein = document.getElementById('typeDinein');
    if (btnTakeaway && btnDinein) {
      btnTakeaway.addEventListener('click', () => {
        orderType = 'takeaway';
        btnTakeaway.classList.add('active');
        btnDinein.classList.remove('active');
        playBeep('add');
      });
      btnDinein.addEventListener('click', () => {
        orderType = 'dinein';
        btnDinein.classList.add('active');
        btnTakeaway.classList.remove('active');
        playBeep('add');
      });
    }

    // 3. Discount Quick Pills
    document.querySelectorAll('.disc-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.disc-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const val = pill.getAttribute('data-disc');
        if (val === 'manual') {
          const manualVal = prompt('Masukkan nominal diskon potongan harga (dalam Rp):', '5000');
          if (manualVal !== null) {
            manualDiscountAmount = parseFloat(manualVal) || 0;
            discountPercent = 0;
          }
        } else {
          discountPercent = parseInt(val, 10) || 0;
          manualDiscountAmount = 0;
        }
        renderCart();
      });
    });

    // 4. Cart Action Buttons
    const clearCartBtn = document.getElementById('btnClearCart');
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

    const openPayBtn = document.getElementById('btnOpenPayment');
    if (openPayBtn) openPayBtn.addEventListener('click', openPaymentModal);

    // 5. Config Modal Stepper & Actions
    document.getElementById('btnConfigQtyMinus').addEventListener('click', () => {
      if (currentConfig.qty > 1) {
        currentConfig.qty--;
        document.getElementById('configQtyDisplay').textContent = currentConfig.qty;
        updateConfigSubtotal();
      }
    });

    document.getElementById('btnConfigQtyPlus').addEventListener('click', () => {
      currentConfig.qty++;
      document.getElementById('configQtyDisplay').textContent = currentConfig.qty;
      updateConfigSubtotal();
    });

    document.getElementById('btnCloseConfigModal').addEventListener('click', closeConfigModal);
    document.getElementById('btnCancelConfig').addEventListener('click', closeConfigModal);
    document.getElementById('btnConfirmAddToCart').addEventListener('click', confirmAddToCart);

    // 6. Payment Modal Events
    document.getElementById('tabCash').addEventListener('click', () => setPaymentTab('cash'));
    document.getElementById('tabQris').addEventListener('click', () => setPaymentTab('qris'));
    document.getElementById('tabTransfer').addEventListener('click', () => setPaymentTab('transfer'));

    document.getElementById('cashReceivedInput').addEventListener('input', updateCashChange);

    // Cash shortcuts
    document.getElementById('btnCashExact').addEventListener('click', () => {
      const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
      let disc = (discountPercent > 0) ? Math.round(subtotal * (discountPercent / 100)) : manualDiscountAmount;
      const grandTotal = Math.max(0, subtotal - disc);
      document.getElementById('cashReceivedInput').value = grandTotal;
      updateCashChange();
      playBeep('add');
    });

    document.querySelectorAll('.btn-cash-quick[data-val]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.getAttribute('data-val'));
        document.getElementById('cashReceivedInput').value = val;
        updateCashChange();
        playBeep('add');
      });
    });

    document.getElementById('btnClosePayModal').addEventListener('click', closePaymentModal);
    document.getElementById('btnCancelPay').addEventListener('click', closePaymentModal);
    document.getElementById('btnCompletePayment').addEventListener('click', completeTransaction);

    // 7. Receipt Modal Events
    document.getElementById('btnCloseReceiptModal').addEventListener('click', closeReceiptModal);
    document.getElementById('btnNewTransaction').addEventListener('click', closeReceiptModal);
    document.getElementById('btnPrintReceipt').addEventListener('click', () => {
      window.print();
    });
    document.getElementById('btnShareWa').addEventListener('click', shareReceiptToWhatsApp);

    // 8. Report Modal Events
    document.getElementById('btnReportModal').addEventListener('click', openReportModal);
    document.getElementById('btnCloseReportModal').addEventListener('click', closeReportModal);
    document.getElementById('btnCloseReport').addEventListener('click', closeReportModal);
    document.getElementById('btnExportCsv').addEventListener('click', exportReportToCSV);
    document.getElementById('btnResetShift').addEventListener('click', resetShift);

    // 9. Manage Menu Events
    document.getElementById('btnManageMenu').addEventListener('click', openMenuManageModal);
    document.getElementById('btnCloseManageModal').addEventListener('click', closeMenuManageModal);
    document.getElementById('btnSaveMenuManage').addEventListener('click', saveMenuManagement);
    document.getElementById('btnResetMenuDefault').addEventListener('click', resetMenuToDefault);

    // 10. Sound Toggle
    const soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
        soundBtn.querySelector('.tool-label').textContent = `Suara: ${soundEnabled ? 'ON' : 'OFF'}`;
        soundBtn.style.opacity = soundEnabled ? '1' : '0.6';
        if (soundEnabled) playBeep('add');
      });
    }

    // 11. Admin Panel & PIN Events
    const btnOpenAdmin = document.getElementById('btnOpenAdmin');
    if (btnOpenAdmin) {
      btnOpenAdmin.addEventListener('click', openPinModal);
    }

    const btnClosePin = document.getElementById('btnClosePinModal');
    if (btnClosePin) {
      btnClosePin.addEventListener('click', closePinModal);
    }

    document.querySelectorAll('.key-btn[data-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        handlePinKey(btn.getAttribute('data-key'));
      });
    });

    const btnPinClear = document.getElementById('btnPinClear');
    if (btnPinClear) {
      btnPinClear.addEventListener('click', handlePinClear);
    }

    const btnPinSubmit = document.getElementById('btnPinSubmit');
    if (btnPinSubmit) {
      btnPinSubmit.addEventListener('click', verifyAdminPin);
    }

    const btnCloseAdmin = document.getElementById('btnCloseAdminModal');
    if (btnCloseAdmin) {
      btnCloseAdmin.addEventListener('click', closeAdminModal);
    }

    document.querySelectorAll('.admin-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        switchAdminTab(btn.getAttribute('data-tab'));
      });
    });

    // Menu CRUD Buttons
    const btnAddMenu = document.getElementById('btnAdminAddMenu');
    if (btnAddMenu) {
      btnAddMenu.addEventListener('click', openAddMenuForm);
    }

    const btnCloseMenuForm = document.getElementById('btnCloseMenuForm');
    if (btnCloseMenuForm) btnCloseMenuForm.addEventListener('click', closeMenuForm);

    const btnCancelMenuForm = document.getElementById('btnCancelMenuForm');
    if (btnCancelMenuForm) btnCancelMenuForm.addEventListener('click', closeMenuForm);

    const btnSaveMenuForm = document.getElementById('btnSaveMenuForm');
    if (btnSaveMenuForm) btnSaveMenuForm.addEventListener('click', saveMenuForm);

    // Toppings CRUD
    const btnAddTopping = document.getElementById('btnAdminAddTopping');
    if (btnAddTopping) btnAddTopping.addEventListener('click', openAddToppingPrompt);

    // Profile & Settings
    const btnSaveProfile = document.getElementById('btnSaveStoreProfile');
    if (btnSaveProfile) btnSaveProfile.addEventListener('click', saveStoreProfileForm);

    const btnSavePayments = document.getElementById('btnSavePaymentSettings');
    if (btnSavePayments) btnSavePayments.addEventListener('click', savePaymentSettingsForm);

    // Security & Backup
    const btnSavePin = document.getElementById('btnSaveNewPin');
    if (btnSavePin) btnSavePin.addEventListener('click', saveNewPin);

    const btnDownloadBackup = document.getElementById('btnDownloadBackup');
    if (btnDownloadBackup) btnDownloadBackup.addEventListener('click', downloadBackupFile);

    const fileRestoreInput = document.getElementById('fileRestoreInput');
    if (fileRestoreInput) fileRestoreInput.addEventListener('change', restoreBackupFile);

    const btnAdminExport = document.getElementById('btnAdminExportCsv');
    if (btnAdminExport) btnAdminExport.addEventListener('click', exportReportToCSV);

    // 12. Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      // '/' to focus search
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        const s = document.getElementById('menuSearchInput');
        if (s) {
          s.focus();
          s.select();
        }
      }

      // F4 or Space to open payment modal if not in input
      if ((e.key === 'F4' || (e.code === 'Space' && !isInput)) && cart.length > 0) {
        const payModal = document.getElementById('modalPayment');
        const configModal = document.getElementById('modalConfigItem');
        const receiptModal = document.getElementById('modalReceipt');
        const adminModal = document.getElementById('modalAdmin');
        if (payModal.style.display !== 'flex' && configModal.style.display !== 'flex' && receiptModal.style.display !== 'flex' && adminModal.style.display !== 'flex') {
          e.preventDefault();
          openPaymentModal();
        }
      }

      // Enter to complete transaction if in cash input
      if (e.key === 'Enter') {
        const payModal = document.getElementById('modalPayment');
        if (payModal.style.display === 'flex' && activeEl && activeEl.id === 'cashReceivedInput') {
          e.preventDefault();
          completeTransaction();
        }
      }

      // ESC to close any open modal
      if (e.key === 'Escape') {
        closeConfigModal();
        closePaymentModal();
        closeReceiptModal();
        closeReportModal();
        closeMenuManageModal();
        closePinModal();
        closeAdminModal();
        closeMenuForm();
      }
    });

    // Close modal when clicking outside card
    document.querySelectorAll('.pos-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.style.display = 'none';
        }
      });
    });
  }

  // ==========================================
  // 13. INITIAL BOOTSTRAP
  // ==========================================
  function init() {
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // Initial Order ID display
    document.getElementById('currentOrderId').textContent = getOrderIdString(orderCounter);

    // Sound button state
    const soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn) {
      soundBtn.querySelector('.tool-label').textContent = `Suara: ${soundEnabled ? 'ON' : 'OFF'}`;
      soundBtn.style.opacity = soundEnabled ? '1' : '0.6';
    }

    updateStoreProfileUI();
    renderCategories();
    renderMenuGrid();
    renderCart();
    updateHeaderOmzet();
    initEvents();

    console.log('%c BLS Street Coffee POS Online %c Outlet Tepi Jalan Edition ', 'background:#D97706;color:#fff;font-weight:bold;padding:4px;', 'background:#1C1917;color:#F59E0B;padding:4px;');
  }

  // Boot when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
