// Braketime Bikers - prototype app logic
// Data is stored in localStorage as mock data. No real backend.

function load(key, fallback) {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}

function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

var vendors = load('bb_vendors', null);
if (!vendors) {
    vendors = [
      { id: 1, name: 'Campus Kitchen', location: 'Main Campus Food Court' },
      { id: 2, name: 'Auntie Ama Waakye', location: 'Gate 2' },
      { id: 3, name: 'Golden Spoon Restaurant', location: 'Osu' }
        ];
    save('bb_vendors', vendors);
}

var riders = load('bb_riders', []);
var bikes = load('bb_bikes', []);
var orders = load('bb_orders', []);

function persistAll() {
    save('bb_riders', riders);
    save('bb_bikes', bikes);
    save('bb_orders', orders);
}

function uid() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

function setupTabs() {
    var buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
                  buttons.forEach(function (b) { b.classList.remove('active'); });
                  document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
                  btn.classList.add('active');
                  document.getElementById(btn.dataset.tab).classList.add('active');
          });
    });
}

function renderVendors() {
    var el = document.getElementById('vendors-list');
    el.innerHTML = '';
    vendors.forEach(function (v) {
          var div = document.createElement('div');
          div.className = 'card';
          div.innerHTML = '<div class="card-title">' + v.name + '</div><div>' + v.location + '</div>';
          el.appendChild(div);
    });
}

function fillVendorSelect() {
    var sel = document.getElementById('order-vendor');
    sel.innerHTML = '';
    vendors.forEach(function (v) {
          var opt = document.createElement('option');
          opt.value = v.id;
          opt.textContent = v.name;
          sel.appendChild(opt);
    });
}

function renderRiders() {
    var el = document.getElementById('riders-list');
    el.innerHTML = '';
    riders.forEach(function (r) {
          var div = document.createElement('div');
          div.className = 'card';
          var certLabel = r.certified ? 'certified' : 'pending';
          div.innerHTML = '<div class="card-title">' + r.name + ' <span class="status ' + certLabel + '">' + certLabel + '</span></div>' +
                  '<div>' + r.phone + (r.hasBike ? ' &middot; has own bike' : ' &middot; needs a bike') + '</div>';
          el.appendChild(div);
    });
}

function renderPendingRiders() {
    var el = document.getElementById('pending-riders');
    el.innerHTML = '';
    var pending = riders.filter(function (r) { return !r.certified; });
    if (pending.length === 0) {
          el.innerHTML = '<p class="hint">No riders waiting on certification.</p>';
          return;
    }
    pending.forEach(function (r) {
          var div = document.createElement('div');
          div.className = 'card';
          div.innerHTML = '<div class="card-title">' + r.name + '</div><div>' + r.phone + '</div>';
          var btn = document.createElement('button');
          btn.className = 'action-btn';
          btn.textContent = 'Certify rider';
          btn.addEventListener('click', function () {
                  r.certified = true;
                  r.status = 'active';
                  persistAll();
                  renderAll();
          });
          div.appendChild(btn);
          el.appendChild(div);
    });
}

function renderBikeForm() {
    var form = document.getElementById('bike-form');
    form.addEventListener('submit', function (e) {
          e.preventDefault();
          var idInput = document.getElementById('bike-id');
          var bikeId = idInput.value.trim();
          if (!bikeId) return;
          bikes.push({ id: uid(), bikeId: bikeId, status: 'available', holderId: null });
          idInput.value = '';
          persistAll();
          renderAll();
    });
}

function renderAdminBikesList() {
    var el = document.getElementById('admin-bikes-list');
    el.innerHTML = '';
    bikes.forEach(function (b) {
          var div = document.createElement('div');
          div.className = 'card';
          var holder = riders.find(function (r) { return r.id === b.holderId; });
          div.innerHTML = '<div class="card-title">Bike ' + b.bikeId + ' <span class="status ' + b.status + '">' + b.status + '</span></div>' +
                  (holder ? '<div>With: ' + holder.name + '</div>' : '');
          el.appendChild(div);
    });
}

function renderBikesTab() {
    var listEl = document.getElementById('bikes-list');
    listEl.innerHTML = '';
    bikes.forEach(function (b) {
          var div = document.createElement('div');
          div.className = 'card';
          var holder = riders.find(function (r) { return r.id === b.holderId; });
          div.innerHTML = '<div class="card-title">Bike ' + b.bikeId + ' <span class="status ' + b.status + '">' + b.status + '</span></div>' +
                  (holder ? '<div>Checked out by: ' + holder.name + '</div>' : '');
          if (b.status === 'checked_out') {
                  var returnBtn = document.createElement('button');
                  returnBtn.className = 'action-btn secondary';
                  returnBtn.textContent = 'Return bike';
                  returnBtn.addEventListener('click', function () {
                            b.status = 'available';
                            b.holderId = null;
                            persistAll();
                            renderAll();
                  });
                  div.appendChild(returnBtn);
          }
          listEl.appendChild(div);
    });

  var checkoutBox = document.getElementById('checkout-box');
    checkoutBox.innerHTML = '';
    var eligibleRiders = riders.filter(function (r) {
          return r.certified && !r.hasBike && !bikes.some(function (b) { return b.holderId === r.id; });
    });
    var availableBikes = bikes.filter(function (b) { return b.status === 'available'; });

  if (eligibleRiders.length === 0 || availableBikes.length === 0) {
        checkoutBox.innerHTML = '<p class="hint">No certified riders waiting for a bike, or no bikes available right now.</p>';
        return;
  }

  var riderSelect = document.createElement('select');
    eligibleRiders.forEach(function (r) {
          var opt = document.createElement('option');
          opt.value = r.id;
          opt.textContent = r.name;
          riderSelect.appendChild(opt);
    });

  var bikeSelect = document.createElement('select');
    availableBikes.forEach(function (b) {
          var opt = document.createElement('option');
          opt.value = b.id;
          opt.textContent = 'Bike ' + b.bikeId;
          bikeSelect.appendChild(opt);
    });

  var checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'action-btn';
    checkoutBtn.textContent = 'Check out bike';
    checkoutBtn.addEventListener('click', function () {
          var riderId = Number(riderSelect.value);
          var bikeId = Number(bikeSelect.value);
          var bike = bikes.find(function (b) { return b.id === bikeId; });
          if (bike) {
                  bike.status = 'checked_out';
                  bike.holderId = riderId;
                  persistAll();
                  renderAll();
          }
    });

  checkoutBox.appendChild(riderSelect);
    checkoutBox.appendChild(bikeSelect);
    checkoutBox.appendChild(checkoutBtn);
}

function renderOrders() {
    var el = document.getElementById('orders-list');
    el.innerHTML = '';
    orders.slice().reverse().forEach(function (o) {
          var vendor = vendors.find(function (v) { return v.id === o.vendorId; });
          var rider = riders.find(function (r) { return r.id === o.riderId; });
          var div = document.createElement('div');
          div.className = 'card';
          div.innerHTML = '<div class="card-title">' + (vendor ? vendor.name : 'Unknown vendor') + ' &rarr; ' + o.customer +
                  ' <span class="status ' + o.status + '">' + o.status + '</span></div>' +
                  '<div>Drop-off: ' + o.dropoff + '</div>' +
                  (rider ? '<div>Rider: ' + rider.name + '</div>' : '');

                                         if (o.status === 'open') {
                                                 var findBtn = document.createElement('button');
                                                 findBtn.className = 'action-btn';
                                                 findBtn.textContent = 'Find a rider';
                                                 findBtn.addEventListener('click', function () {
                                                           var available = riders.find(function (r) {
                                                                       return r.certified && !orders.some(function (other) { return other.riderId === r.id && other.status === 'assigned'; });
                                                           });
                                                           if (!available) {
                                                                       alert('No certified riders are available right now.');
                                                                       return;
                                                           }
                                                           o.riderId = available.id;
                                                           o.status = 'assigned';
                                                           persistAll();
                                                           renderAll();
                                                 });
                                                 div.appendChild(findBtn);
                                         } else if (o.status === 'assigned') {
                                                 var deliveredBtn = document.createElement('button');
                                                 deliveredBtn.className = 'action-btn secondary';
                                                 deliveredBtn.textContent = 'Mark delivered';
                                                 deliveredBtn.addEventListener('click', function () {
                                                           o.status = 'delivered';
                                                           persistAll();
                                                           renderAll();
                                                 });
                                                 div.appendChild(deliveredBtn);
                                         }

                                         el.appendChild(div);
    });
}

function renderAll() {
    renderVendors();
    fillVendorSelect();
    renderRiders();
    renderPendingRiders();
    renderAdminBikesList();
    renderBikesTab();
    renderOrders();
}

function setupForms() {
    document.getElementById('rider-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var name = document.getElementById('rider-name').value.trim();
          var phone = document.getElementById('rider-phone').value.trim();
          var ghanaCard = document.getElementById('rider-ghana-card').value.trim();
          var hasBike = document.getElementById('rider-has-bike').checked;
          if (!name || !phone || !ghanaCard) return;
          riders.push({
                  id: uid(),
                  name: name,
                  phone: phone,
                  ghanaCardNumber: ghanaCard,
                  hasBike: hasBike,
                  certified: false,
                  status: 'pending'
          });
          e.target.reset();
          persistAll();
          renderAll();
    });

  document.getElementById('order-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var vendorId = Number(document.getElementById('order-vendor').value);
        var customer = document.getElementById('order-customer').value.trim();
        var dropoff = document.getElementById('order-dropoff').value.trim();
        if (!customer || !dropoff) return;
        orders.push({
                id: uid(),
                vendorId: vendorId,
                customer: customer,
                dropoff: dropoff,
                status: 'open',
                riderId: null
        });
        e.target.reset();
        persistAll();
        renderAll();
  });

  renderBikeForm();
}

document.addEventListener('DOMContentLoaded', function () {
    setupTabs();
    setupForms();
    renderAll();
});
