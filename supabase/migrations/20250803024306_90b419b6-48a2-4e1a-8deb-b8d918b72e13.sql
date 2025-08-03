-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create invoice_items table
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  service_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT NOT NULL UNIQUE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'check', 'card', 'bank_transfer', 'insurance')),
  reference_number TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create billing_accounts table for patient billing information
CREATE TABLE public.billing_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  account_number TEXT NOT NULL UNIQUE,
  billing_address TEXT,
  billing_contact_name TEXT,
  billing_contact_phone TEXT,
  billing_contact_email TEXT,
  insurance_primary TEXT,
  insurance_secondary TEXT,
  payment_terms INTEGER DEFAULT 30, -- days
  credit_limit DECIMAL(10,2) DEFAULT 0.00,
  current_balance DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create financial_transactions table for general accounting
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT NOT NULL UNIQUE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense', 'refund', 'adjustment')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_id UUID, -- can reference invoices, payments, etc.
  reference_type TEXT, -- 'invoice', 'payment', 'expense', etc.
  account_code TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices
CREATE POLICY "Allow all operations on invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow all operations on invoice_items" ON public.invoice_items FOR ALL USING (true);
CREATE POLICY "Allow all operations on payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow all operations on billing_accounts" ON public.billing_accounts FOR ALL USING (true);
CREATE POLICY "Allow all operations on financial_transactions" ON public.financial_transactions FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_invoices_patient_id ON public.invoices(patient_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_date ON public.invoices(invoice_date);
CREATE INDEX idx_payments_invoice_id ON public.payments(invoice_id);
CREATE INDEX idx_payments_patient_id ON public.payments(patient_id);
CREATE INDEX idx_payments_date ON public.payments(payment_date);
CREATE INDEX idx_billing_accounts_patient_id ON public.billing_accounts(patient_id);
CREATE INDEX idx_financial_transactions_date ON public.financial_transactions(transaction_date);
CREATE INDEX idx_financial_transactions_type ON public.financial_transactions(transaction_type);

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_accounts_updated_at
  BEFORE UPDATE ON public.billing_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();