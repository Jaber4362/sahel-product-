-- إنشاء جدول الفئات
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'package',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المنتجات
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sku TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 5,
  max_stock_level INTEGER DEFAULT 1000,
  unit TEXT DEFAULT 'قطعة',
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  barcode TEXT,
  weight DECIMAL(8,2),
  dimensions JSONB,
  supplier_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول حركات المخزون
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason TEXT,
  notes TEXT,
  reference_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان (عامة للجميع حالياً)
CREATE POLICY "Everyone can access categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Everyone can access products" ON public.products FOR ALL USING (true);
CREATE POLICY "Everyone can access inventory movements" ON public.inventory_movements FOR ALL USING (true);

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_inventory_movements_product_id ON public.inventory_movements(product_id);
CREATE INDEX idx_inventory_movements_type ON public.inventory_movements(movement_type);

-- إنشاء دالة لتحديث الوقت
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- إنشاء triggers لتحديث updated_at تلقائياً
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- إضافة بيانات تجريبية للفئات
INSERT INTO public.categories (name, description, color, icon) VALUES
('الكترونيات', 'أجهزة الكمبيوتر والهواتف والأجهزة الذكية', '#3B82F6', 'smartphone'),
('ملابس', 'ملابس رجالية ونسائية وأطفال', '#EF4444', 'shirt'),
('أثاث منزلي', 'أثاث المنزل والمكتب', '#10B981', 'sofa'),
('كتب وقرطاسية', 'الكتب والأدوات المكتبية', '#F59E0B', 'book'),
('رياضة ولياقة', 'معدات رياضية وأدوات اللياقة البدنية', '#8B5CF6', 'dumbbell');

-- إضافة بيانات تجريبية للمنتجات
INSERT INTO public.products (name, description, category_id, sku, price, cost_price, stock_quantity, min_stock_level, unit) 
SELECT 
  'آيفون 15 برو', 
  'هاتف ذكي من آبل بشاشة 6.1 بوصة', 
  id, 
  'IP15PRO001', 
  4500.00, 
  4000.00, 
  25, 
  5, 
  'قطعة'
FROM public.categories WHERE name = 'الكترونيات' LIMIT 1;

INSERT INTO public.products (name, description, category_id, sku, price, cost_price, stock_quantity, min_stock_level, unit) 
SELECT 
  'قميص قطني رجالي', 
  'قميص قطني عالي الجودة للرجال', 
  id, 
  'SHIRT001', 
  120.00, 
  80.00, 
  150, 
  20, 
  'قطعة'
FROM public.categories WHERE name = 'ملابس' LIMIT 1;

INSERT INTO public.products (name, description, category_id, sku, price, cost_price, stock_quantity, min_stock_level, unit) 
SELECT 
  'كرسي مكتب ergonomic', 
  'كرسي مكتب مريح مع دعم قطني', 
  id, 
  'CHAIR001', 
  850.00, 
  600.00, 
  12, 
  3, 
  'قطعة'
FROM public.categories WHERE name = 'أثاث منزلي' LIMIT 1;