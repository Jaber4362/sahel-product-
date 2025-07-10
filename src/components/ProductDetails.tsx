import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Edit, 
  X, 
  AlertTriangle, 
  Calendar,
  Tag,
  DollarSign,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  productId: string;
  onClose: () => void;
  onEdit: () => void;
}

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  unit: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  barcode: string;
  weight: number;
  categories?: {
    name: string;
    color: string;
  };
}

const ProductDetails = ({ productId, onClose, onEdit }: ProductDetailsProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            color
          )
        `)
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (current: number, min: number, max: number) => {
    if (current === 0) return { text: "نفد المخزون", variant: "destructive" as const, percentage: 0 };
    if (current <= min) return { text: "مخزون منخفض", variant: "warning" as const, percentage: 25 };
    if (current >= max) return { text: "مخزون مرتفع", variant: "success" as const, percentage: 100 };
    return { text: "متوفر", variant: "success" as const, percentage: Math.min((current / max) * 100, 100) };
  };

  const getProfitMargin = (price: number, cost: number) => {
    if (cost === 0) return 0;
    return ((price - cost) / cost) * 100;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل بيانات المنتج...</p>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="bg-gradient-card shadow-soft border-0">
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">المنتج غير موجود</h3>
          <p className="text-muted-foreground">لم يتم العثور على المنتج المطلوب</p>
        </CardContent>
      </Card>
    );
  }

  const stockStatus = getStockStatus(product.stock_quantity, product.min_stock_level, product.max_stock_level);
  const profitMargin = getProfitMargin(product.price, product.cost_price);

  return (
    <Card className="bg-gradient-card shadow-soft border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            تفاصيل المنتج
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              تعديل
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={product.is_active ? "success" : "secondary"}>
                  {product.is_active ? "نشط" : "غير نشط"}
                </Badge>
                <span className="text-sm text-muted-foreground">رمز المنتج: {product.sku}</span>
              </div>
              {product.description && (
                <p className="text-muted-foreground">{product.description}</p>
              )}
            </div>

            {/* Category */}
            {product.categories && (
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Tag className="h-4 w-4 text-primary" />
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: product.categories.color }}
                  ></div>
                  <span className="font-medium">{product.categories.name}</span>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">الوحدة</span>
                <p className="font-medium">{product.unit}</p>
              </div>
              {product.barcode && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">الباركود</span>
                  <p className="font-medium">{product.barcode}</p>
                </div>
              )}
              {product.weight > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">الوزن</span>
                  <p className="font-medium">{product.weight} كجم</p>
                </div>
              )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="space-y-4">
            <Card className="bg-muted/30 border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">حالة المخزون</span>
                  <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>الكمية الحالية</span>
                    <span className="font-semibold">{product.stock_quantity}</span>
                  </div>
                  <Progress value={stockStatus.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>الحد الأدنى: {product.min_stock_level}</span>
                    <span>الحد الأقصى: {product.max_stock_level}</span>
                  </div>
                </div>
                {product.stock_quantity <= product.min_stock_level && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-warning/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm text-warning">يحتاج إعادة تزويد</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-muted/30 border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-success" />
                <span className="text-sm text-muted-foreground">سعر البيع</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {product.price.toLocaleString('ar-SA')} ر.س
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">تكلفة المنتج</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {product.cost_price.toLocaleString('ar-SA')} ر.س
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-warning" />
                <span className="text-sm text-muted-foreground">هامش الربح</span>
              </div>
              <p className="text-2xl font-bold text-warning">
                {profitMargin.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">تاريخ الإنشاء</span>
              <p className="font-medium">
                {new Date(product.created_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">آخر تحديث</span>
              <p className="font-medium">
                {new Date(product.updated_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;