# Shantaz CRM - Systematic Improvement Roadmap

## 🔴 CRITICAL ISSUES (Fix First)

### 1. Dashboard - No Real Data
**File:** `src/app/dashboard/page.tsx`
- [ ] All stats show "0" (hardcoded)
- [ ] Need to fetch actual counts from database
- [ ] Fix: Add API calls to get real-time stats
  - Total Leads count
  - Active Service Requests count  
  - Pending Installations count
  - Active Contracts count

### 2. Quick Actions - Non-functional Buttons
**File:** `src/app/dashboard/page.tsx`
- [ ] "New Lead" button doesn't navigate
- [ ] "New Service Request" button doesn't navigate
- [ ] "New Quote" button doesn't navigate
- [ ] "View Reports" button doesn't navigate
- [ ] Fix: Add proper navigation with `useRouter` or `<Link>`

### 3. Missing Loading States
**All List Pages:** leads, contacts, accounts, deals, quotes, etc.
- [ ] No loading spinner while fetching data
- [ ] Fix: Add `<Loading />` component with skeleton screens

### 4. Missing Error Handling
**All Pages:**
- [ ] No error messages when API fails
- [ ] No retry mechanism
- [ ] Fix: Add try-catch with user-friendly error messages

### 5. Missing Success Notifications
**All Form Pages:**
- [ ] No confirmation when lead/contact created
- [ ] No feedback on update/delete actions
- [ ] Fix: Add toast notifications library (sonner or react-hot-toast)

---

## 🟡 HIGH PRIORITY (Week 1)

### 6. Form Validations Missing
**All "New" Pages:** leads/new, contacts/new, deals/new, etc.
- [ ] No client-side validation
- [ ] Can submit empty forms
- [ ] No email format validation
- [ ] No phone number validation
- [ ] Fix: Add Zod schema validation with react-hook-form

### 7. Delete Confirmation Missing
**All List Pages:**
- [ ] Delete button works without confirmation
- [ ] Risk of accidental deletion
- [ ] Fix: Add confirmation dialog component

### 8. Search Functionality Issues
**All List Pages:**
- [ ] Search only on name/email/company
- [ ] Need to search on more fields (phone, address, etc.)
- [ ] Fix: Enhance filter logic

### 9. Pagination Missing
**All List Pages:**
- [ ] Showing all records (will slow down with more data)
- [ ] Fix: Add pagination (10-50 items per page)

### 10. Filtering Options Limited
**All List Pages:**
- [ ] No status filter dropdown
- [ ] No date range filter
- [ ] No priority filter
- [ ] Fix: Add filter sidebar with multiple options

---

## 🟢 MEDIUM PRIORITY (Week 2)

### 11. PDF Generation
**Priority Files:** Quotes, Invoices, Sales Orders
- [ ] No PDF download option
- [ ] Fix: Add @react-pdf/renderer or puppeteer
- [ ] Generate professional PDFs with company logo

### 12. Email Templates
**Files:** Quote sent, Invoice reminder, Service request created
- [ ] No email functionality
- [ ] Fix: Create email templates with nodemailer
- [ ] Add "Send Email" button on quote/invoice pages

### 13. File Upload Missing
**Files:** Service requests, Contracts, Quotes
- [ ] No attachment upload
- [ ] Fix: Add file upload to AWS S3 or Cloudflare R2
- [ ] Allow images/PDF attachments

### 14. Activity Timeline
**Detail Pages:** Lead detail, Contact detail, Account detail
- [ ] No activity history showing
- [ ] Fix: Create timeline component showing all activities/comments

### 15. Comments System
**All Detail Pages:**
- [ ] Comments section exists in schema but not in UI
- [ ] Fix: Add comment input box at bottom of detail pages
- [ ] Show comment history

---

## 🔵 LOW PRIORITY (Week 3+)

### 16. Advanced Search
- [ ] Global search across all modules
- [ ] Fix: Add command palette (Cmd+K) with search

### 17. Bulk Actions
- [ ] Select multiple items and perform actions
- [ ] Fix: Add checkboxes and bulk delete/update

### 18. Export to Excel
- [ ] No export functionality
- [ ] Fix: Add "Export to CSV" button on list pages

### 19. Custom Fields
- [ ] Cannot add custom fields without code changes
- [ ] Fix: Build custom field builder (complex)

### 20. Audit Logs
- [ ] No tracking of who changed what
- [ ] Fix: Add audit log table and display

---

## 📊 DASHBOARD IMPROVEMENTS NEEDED

### Current Dashboard Issues:
1. **Stats are hardcoded (0)**
   ```typescript
   // Current (WRONG):
   <dd className="text-3xl font-semibold text-gray-900">0</dd>
   
   // Should be (CORRECT):
   <dd className="text-3xl font-semibold text-gray-900">{stats.totalLeads}</dd>
   ```

2. **No Recent Activities Section**
   - Add "Recent Activities" list showing last 10 activities
   
3. **No Charts/Graphs**
   - Add revenue chart (last 6 months)
   - Add deals pipeline chart
   - Add service requests by status chart

4. **No Quick Stats Cards Are Clickable**
   - Make cards clickable to navigate to respective pages

---

## 🎯 PHASE 1 ACTION PLAN (This Week)

### Day 1-2: Fix Critical Issues
- [ ] Task 1: Create stats API endpoint
- [ ] Task 2: Update dashboard with real data
- [ ] Task 3: Fix quick action buttons navigation
- [ ] Task 4: Add loading states to all pages
- [ ] Task 5: Add error handling with toast notifications

### Day 3-4: Form Improvements
- [ ] Task 6: Install react-hook-form + zod
- [ ] Task 7: Add validation to "New Lead" form
- [ ] Task 8: Add validation to "New Contact" form
- [ ] Task 9: Add delete confirmation dialogs
- [ ] Task 10: Add success toast on create/update/delete

### Day 5: Polish & Testing
- [ ] Task 11: Test all forms with validation
- [ ] Task 12: Test delete confirmations
- [ ] Task 13: Test loading states
- [ ] Task 14: Deploy to Vercel
- [ ] Task 15: User acceptance testing

---

## 📦 REQUIRED NPM PACKAGES

```bash
# Notifications
npm install sonner

# Form Validation
npm install react-hook-form zod @hookform/resolvers

# PDF Generation
npm install @react-pdf/renderer

# File Upload (later)
npm install @aws-sdk/client-s3 # or use Cloudflare R2

# Charts (later)
npm install recharts
```

---

## 🚀 LET'S START!

**Ready to begin Phase 1, Day 1-2?**

Which would you like me to tackle first:
1. **Dashboard with real stats** ← Most visible impact
2. **Toast notifications system** ← Enables better UX for everything
3. **Loading states everywhere** ← Prevents "blank page" feeling

Your choice! 🎯
