/**
 * CODEXSORS — Admin Leads Management Logic
 */

const AdminApp = {
  AUTH_HASH: '78df750a1cbd1ecd21be4e539e4c98d420412ba743b9eb1bed39fbbd7199912b',
  STORAGE_KEY: 'codexsors_leads',
  currentLeads: [],

  init() {
    this.setupAuth();
    this.setupControls();
  },

  async hashInput(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  setupAuth() {
    const isAuth = sessionStorage.getItem('codexsors_admin_auth');
    if (isAuth === 'true') {
      this.showDashboard();
    } else {
      document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('adminPinInput');
        const entered = (input?.value || '').trim();
        const enteredHash = await this.hashInput(entered);
        if (enteredHash === this.AUTH_HASH) {
          sessionStorage.setItem('codexsors_admin_auth', 'true');
          this.showDashboard();
        } else {
          alert('رمز المرور غير صحيح! يرجى إعادة المحاولة.');
          if (input) {
            input.value = '';
            input.focus();
          }
        }
      });
    }
  },

  showDashboard() {
    document.getElementById('adminLockScreen').style.display = 'none';
    document.getElementById('adminMainContent').style.display = 'block';
    this.loadLeads();
  },

  loadLeads() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      this.currentLeads = data ? JSON.parse(data) : [];
    } catch (e) {
      console.error(e);
      this.currentLeads = [];
    }
    this.render();
  },

  saveLeads() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentLeads));
    this.render();
  },

  render() {
    this.renderStats();
    this.renderTable();
  },

  renderStats() {
    const total = this.currentLeads.length;
    const newCount = this.currentLeads.filter(l => l.status === 'new').length;
    const contactedCount = this.currentLeads.filter(l => l.status === 'contacted').length;
    const closedCount = this.currentLeads.filter(l => l.status === 'closed').length;

    document.getElementById('statTotalLeads').textContent = total;
    document.getElementById('statNewLeads').textContent = newCount;
    document.getElementById('statContactedLeads').textContent = contactedCount;
    document.getElementById('statClosedLeads').textContent = closedCount;
  },

  renderTable() {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    const searchTerm = document.getElementById('adminSearchInput')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('adminStatusFilter')?.value || 'all';

    let filtered = this.currentLeads.filter(lead => {
      const matchSearch = 
        (lead.name && lead.name.toLowerCase().includes(searchTerm)) ||
        (lead.phone && lead.phone.includes(searchTerm)) ||
        (lead.service && lead.service.toLowerCase().includes(searchTerm));
      
      const matchStatus = (statusFilter === 'all') || (lead.status === statusFilter);
      return matchSearch && matchStatus;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
            لا توجد طلبات مسجلة حتى الآن. ستظهر هنا الطلبات فور إرسالها من زوار الموقع.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(lead => {
      const formattedDate = new Date(lead.date).toLocaleDateString('ar-SA', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });

      // Clean phone number for WhatsApp
      let cleanPhone = lead.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('05')) {
        cleanPhone = '966' + cleanPhone.substring(1);
      } else if (cleanPhone.startsWith('5')) {
        cleanPhone = '966' + cleanPhone;
      }

      const waReplyText = encodeURIComponent(`مرحباً أستاذ ${lead.name}،
معك فريق CODEXSORS بخصوص طلبك لخدمة:
*${lead.service}*

يسعدنا مناقشة كافة متطلبات مشروعك وتزويدك بعرض السعر المناسب.`);

      return `
        <tr>
          <td style="font-size: 0.82rem; color: var(--text-muted);">${formattedDate}</td>
          <td><strong>${lead.name}</strong></td>
          <td style="font-family: var(--font-en);">${lead.phone}</td>
          <td><span class="badge" style="font-size: 0.8rem;">${lead.service}</span></td>
          <td>${lead.budget || 'غير محدد'}</td>
          <td style="max-width: 260px; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
            ${lead.details || '—'}
          </td>
          <td>
            <select onchange="AdminApp.updateStatus('${lead.id}', this.value)" class="form-control" style="padding: 4px 8px; font-size: 0.82rem; border-radius: 6px;">
              <option value="new" ${lead.status === 'new' ? 'selected' : ''}>جديد</option>
              <option value="contacted" ${lead.status === 'contacted' ? 'selected' : ''}>تم التواصل</option>
              <option value="closed" ${lead.status === 'closed' ? 'selected' : ''}>مكتمل</option>
            </select>
          </td>
          <td>
            <div style="display: flex; gap: 8px;">
              <a href="https://wa.me/${cleanPhone}?text=${waReplyText}" target="_blank" class="btn btn-whatsapp btn-sm" style="padding: 6px 12px; font-size: 0.8rem;">
                رد واتساب
              </a>
              <button onclick="AdminApp.deleteLead('${lead.id}')" class="btn btn-secondary btn-sm" style="padding: 6px 10px; font-size: 0.8rem; color: #F87171;">
                حذف
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  updateStatus(id, newStatus) {
    const lead = this.currentLeads.find(l => l.id === id);
    if (lead) {
      lead.status = newStatus;
      this.saveLeads();
    }
  },

  deleteLead(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      this.currentLeads = this.currentLeads.filter(l => l.id !== id);
      this.saveLeads();
    }
  },

  clearAll() {
    if (confirm('تنبيه: هل أنت متأكد من مسح جميع الطلبات؟')) {
      this.currentLeads = [];
      this.saveLeads();
    }
  },

  exportCSV() {
    if (this.currentLeads.length === 0) {
      alert('لا توجد طلبات لتصديرها.');
      return;
    }

    // CSV header with BOM for Arabic Excel
    let csv = '\uFEFFالتاريخ,الاسم,الجوال,الخدمة,الميزانية,التفاصيل,الحالة\n';
    this.currentLeads.forEach(l => {
      const cleanDetails = (l.details || '').replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
      csv += `"${l.date}","${l.name}","${l.phone}","${l.service}","${l.budget}","${cleanDetails}","${l.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CODEXSORS_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  setupControls() {
    document.getElementById('adminSearchInput')?.addEventListener('input', () => this.renderTable());
    document.getElementById('adminStatusFilter')?.addEventListener('change', () => this.renderTable());
    document.getElementById('btnClearAllLeads')?.addEventListener('click', () => this.clearAll());
    document.getElementById('btnExportCSV')?.addEventListener('click', () => this.exportCSV());
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AdminApp.init();
});
