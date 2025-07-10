import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Save, X, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface ProductFormProps {
  productId?: string;
  onClose: () => void;
  onSave?: () => void;
}

const ProductForm = ({ productId, onClose, onSave }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost_price: 0,
    stock_quantity: 0,
    min_stock_level: 5,
    max_stock_level: 1000,
    unit: "قطعة",
    category_id: "",
    is_active: true,
    barcode: "",
    weight: 0
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!productId);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, color')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل الفئات",
        variant: "destructive"
      });
    }
  };

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات المنتج",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        price: Number(formData.price),
        cost_price: Number(formData.cost_price),
        stock_quantity: Number(formData.stock_quantity),
        min_stock_level: Number(formData.min_stock_level),
        max_stock_level: Number(formData.max_stock_level),
        weight: Number(formData.weight)
      };

      let error;
      if (productId) {
        ({ error } = await supabase
          .from('products')
          .update(data)
          .eq('id', productId));
      } else {
        ({ error } = await supabase
          .from('products')
          .insert([data]));
      }

      if (error) throw error;

      toast({
        title: productId ? "تم التحديث" : "تم الإضافة",
        description: productId ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح"
      });

      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في حفظ المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل بيانات المنتج...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-soft border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {productId ? "تعديل المنتج" : "إضافة منتج جديد"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم المنتج *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">رمز المنتج *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                required
                placeholder="مثال: PRD-001"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف المنتج</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="أدخل وصف المنتج"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">الفئة</Label>
            <Select value={formData.category_id} onValueChange={(value) => setFormData({...formData, category_id: value})}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">سعر البيع *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                required
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_price">سعر التكلفة</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_price}
                onChange={(e) => setFormData({...formData, cost_price: Number(e.target.value)})}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock Management */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">الكمية الحالية *</Label>
              <Input
                id="stock_quantity"
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})}
                required
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_stock_level">الحد الأدنى للمخزون</Label>
              <Input
                id="min_stock_level"
                type="number"
                min="0"
                value={formData.min_stock_level}
                onChange={(e) => setFormData({...formData, min_stock_level: Number(e.target.value)})}
                placeholder="5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_stock_level">الحد الأقصى للمخزون</Label>
              <Input
                id="max_stock_level"
                type="number"
                min="0"
                value={formData.max_stock_level}
                onChange={(e) => setFormData({...formData, max_stock_level: Number(e.target.value)})}
                placeholder="1000"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">وحدة القياس</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوحدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="قطعة">قطعة</SelectItem>
                  <SelectItem value="كيلوغرام">كيلوغرام</SelectItem>
                  <SelectItem value="لتر">لتر</SelectItem>
                  <SelectItem value="متر">متر</SelectItem>
                  <SelectItem value="علبة">علبة</SelectItem>
                  <SelectItem value="كرتون">كرتون</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">الباركود</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                placeholder="أدخل رمز الباركود"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="is_active">حالة المنتج</Label>
              <p className="text-sm text-muted-foreground">
                {formData.is_active ? "المنتج نشط ومتاح للبيع" : "المنتج غير نشط"}
              </p>
            </div>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-primary">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {productId ? "تحديث المنتج" : "إضافة المنتج"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;