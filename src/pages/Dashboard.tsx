import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Eye,
  BarChart3,
  DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/dashboard-hero.jpg";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  lowStockProducts: number;
  totalValue: number;
  averagePrice: number;
}

interface RecentProduct {
  id: string;
  name: string;
  sku: string;
  stock_quantity: number;
  min_stock_level: number;
  price: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    totalValue: 0,
    averagePrice: 0
  });
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // جلب إحصائيات المنتجات
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;

      // جلب إحصائيات الفئات
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('id');

      if (categoriesError) throw categoriesError;

      // حساب الإحصائيات
      const totalProducts = products?.length || 0;
      const totalCategories = categories?.length || 0;
      const lowStockProducts = products?.filter(p => p.stock_quantity <= p.min_stock_level).length || 0;
      const totalValue = products?.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0) || 0;
      const averagePrice = totalProducts > 0 ? products?.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;

      setStats({
        totalProducts,
        totalCategories,
        lowStockProducts,
        totalValue,
        averagePrice
      });

      // جلب أحدث المنتجات
      setRecentProducts(products?.slice(0, 5) || []);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحميل بيانات لوحة التحكم",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    if (current === 0) return { text: "نفد المخزون", variant: "destructive" as const };
    if (current <= min) return { text: "مخزون منخفض", variant: "warning" as const };
    return { text: "متوفر", variant: "success" as const };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-primary h-64 flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">نظام إدارة المنتجات</h1>
          <p className="text-xl opacity-90">إدارة شاملة ومتطورة لجميع منتجاتك</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20"></div>
      </div>

      <div className="container mx-auto p-6 -mt-16 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">منتج في النظام</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                الفئات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">فئة نشطة</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                مخزون منخفض
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">يحتاج إعادة تزويد</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                قيمة المخزون
              </CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {stats.totalValue.toLocaleString('ar-SA')} ر.س
              </div>
              <p className="text-xs text-muted-foreground">
                متوسط سعر المنتج: {stats.averagePrice.toFixed(2)} ر.س
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 bg-gradient-card shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                المنتجات الحديثة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock_quantity, product.min_stock_level);
                  const stockPercentage = Math.min((product.stock_quantity / (product.min_stock_level * 2)) * 100, 100);
                  
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-foreground">{product.name}</h4>
                          <Badge variant={stockStatus.variant} className="text-xs">
                            {stockStatus.text}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>رمز المنتج: {product.sku}</span>
                          <span>السعر: {product.price} ر.س</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>الكمية: {product.stock_quantity}</span>
                            <span>الحد الأدنى: {product.min_stock_level}</span>
                          </div>
                          <Progress value={stockPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {recentProducts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>لا توجد منتجات حتى الآن</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary shadow-soft border-0 text-white">
            <CardHeader>
              <CardTitle className="text-white">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover-lift"
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent('navigateToProducts', { detail: 'add' }))}
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة منتج جديد
              </Button>
              
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover-lift"
                variant="outline"
                onClick={() => window.dispatchEvent(new CustomEvent('navigateToProducts', { detail: 'view' }))}
              >
                <Eye className="h-4 w-4 mr-2" />
                عرض جميع المنتجات
              </Button>
              
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover-lift"
                variant="outline"
                onClick={() => alert('صفحة التقارير قيد التطوير - ستتوفر قريباً مع إحصائيات مفصلة!')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                تقارير المبيعات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="text-center text-muted-foreground">
          <p className="text-sm">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;